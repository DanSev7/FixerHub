import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Users, Search } from 'lucide-react-native';

export default function Index() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/auth');
      } else if (userProfile) {
        if (!userProfile.is_verified) {
          router.replace('/auth/verify');
        } else if (userProfile.role === 'client') {
          router.replace('/(client)');
        } else if (userProfile.role === 'professional') {
          router.replace('/(professional)');
        }
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return (
      <LinearGradient
        colors={['#2563EB', '#1D4ED8', '#1E40AF']}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Settings size={64} color="white" strokeWidth={1.5} />
            <Text style={styles.logoText}>FixerHub</Text>
            <Text style={styles.tagline}>Connecting You with Trusted Professionals</Text>
          </View>
          
          <View style={styles.features}>
            <View style={styles.feature}>
              <Users size={24} color="rgba(255,255,255,0.8)" />
              <Text style={styles.featureText}>Verified Professionals</Text>
            </View>
            <View style={styles.feature}>
              <Search size={24} color="rgba(255,255,255,0.8)" />
              <Text style={styles.featureText}>AI-Powered Search</Text>
            </View>
            <View style={styles.feature}>
              <Settings size={24} color="rgba(255,255,255,0.8)" />
              <Text style={styles.featureText}>Quality Services</Text>
            </View>
          </View>

          <ActivityIndicator size="large" color="white" style={styles.loader} />
        </View>
      </LinearGradient>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  logoText: {
    fontSize: 42,
    fontWeight: '700',
    color: 'white',
    marginTop: 16,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '400',
  },
  features: {
    width: '100%',
    marginBottom: 48,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  featureText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  loader: {
    marginTop: 32,
  },
});