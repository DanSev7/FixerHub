import React, { createContext, useContext, useEffect, useState } from 'react';
import { Database } from '@/types/database';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, ENDPOINTS } from '@/config/api';
import { router } from 'expo-router';

type UserProfile = Database['public']['Tables']['users']['Row'];

interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  token: string | null;
  signUp: (email: string, password: string, userData: { username: string; phone_number: string; role?: string }) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<any>;
  resendVerification: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const fetchUserProfile = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.ME}`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      // Log the response for debugging
      console.log('Profile Response Status:', response.status);
      const responseText = await response.text();
      console.log('Profile Response Text:', responseText);

      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid server response');
      }

      if (response.ok) {
        setUserProfile(data);
        return true;
      } else {
        console.error('Profile fetch failed:', data.error || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken && !isTokenExpired(storedToken)) {
          setToken(storedToken);
          await fetchUserProfile(storedToken);
        } else {
          // Clear any expired or invalid token
          if (storedToken) {
            await AsyncStorage.removeItem('token');
          }
          setToken(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear any invalid state
        setToken(null);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, userData: { username: string; phone_number: string; role?: string }) => {
    const response = await fetch(`${API_URL}${ENDPOINTS.SIGNUP}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...userData, 
        email, 
        password,
        role: userData.role
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Signup failed');
    return data;
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}${ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        await AsyncStorage.setItem('token', data.token);
        
        // Fetch profile and get the data directly
        const profileResponse = await fetch(`${API_URL}${ENDPOINTS.ME}`, {
          headers: { 
            'Authorization': `Bearer ${data.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        const profileData = await profileResponse.json();
        
        if (profileResponse.ok) {
          setUserProfile(profileData);
          // Navigate based on role from the profile data
          if (profileData.role === 'client') {
            router.replace('/(client)');
          } else if (profileData.role === 'professional') {
            router.replace('/(professional)');
          }
        }
      } else {
        throw new Error(data.error || 'Login failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}${ENDPOINTS.LOGOUT}`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch (error) {
        // console.error('Logout error:', error);
      }
    }
    setUserProfile(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  const verifyEmail = async (email: string, otp: string) => {
    const response = await fetch(`${API_URL}${ENDPOINTS.VERIFY_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      await AsyncStorage.setItem('token', data.token);
      
      // Fetch profile and get the data directly
      const profileResponse = await fetch(`${API_URL}${ENDPOINTS.ME}`, {
        headers: { 
          'Authorization': `Bearer ${data.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });
      const profileData = await profileResponse.json();
      
      if (profileResponse.ok) {
        setUserProfile(profileData);
        // Navigate based on role from the profile data
        if (profileData.role === 'client') {
          router.replace('/(client)');
        } else if (profileData.role === 'professional') {
          router.replace('/(professional)');
        }
      }
      
      return { role: data.role };
    }
    if (!response.ok) throw new Error(data.error || 'Verification failed');
    return data;
  };

  const resendVerification = async (email: string) => {
    const response = await fetch(`${API_URL}${ENDPOINTS.RESEND_VERIFICATION}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Resend failed');
    return data;
  };

  const value = {
    userProfile,
    loading,
    token,
    signUp,
    signIn,
    signOut,
    verifyEmail,
    resendVerification,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}