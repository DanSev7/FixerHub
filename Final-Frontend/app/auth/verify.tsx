// File: VerifyEmail.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail } from 'lucide-react-native';

export default function VerifyEmail() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const inputRefs = useRef<TextInput[]>([]);
  const hasSentOtp = useRef(false); // Add ref to track if OTP has been sent
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get email from navigation params
  const emailFromParams = params.email as string | undefined;
  console.log('VerifyEmail - emailFromParams:', emailFromParams);

  // Combined effect to handle email setting and verification code sending
  useEffect(() => {
    if (emailFromParams && !hasSentOtp.current) {
      setEmail(emailFromParams);
      // Send verification code only once when email is set
      sendVerificationCode(emailFromParams);
      hasSentOtp.current = true; // Mark that OTP has been sent
    }
  }, [emailFromParams]);

  const sendVerificationCode = async (emailToVerify: string) => {
    if (!emailToVerify) {
      console.error('No email found for verification:', { emailFromParams });
      Alert.alert('Error', 'No email found. Please try signing up again.');
      router.push('/auth/role-selection');
      return;
    }
    setResendLoading(true);
    try {
      await resendVerification(emailToVerify);
      Alert.alert('Success', 'Verification code sent to your email');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }

    if (!email) {
      console.error('No email for verification:', { emailFromParams });
      Alert.alert('Error', 'No email found. Please try signing up again.');
      router.push('/auth/role-selection'); // Redirect to role selection if no email
      return;
    }

    setLoading(true);
    try {
      const response = await verifyEmail(email, otpCode);
      // Navigate based on user role
      if (response.role === 'client') {
        router.replace('/(client)');
      } else if (response.role === 'professional') {
        router.replace('/(professional)');
      } else {
        // Fallback to role selection if role is not set
        router.push('/auth/role-selection');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert('Verification Failed', error.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (email) {
      sendVerificationCode(email);
    }
  };

  return (
    <LinearGradient colors={['#2563EB', '#1D4ED8', '#1E40AF']} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Mail size={48} color="white" strokeWidth={1.5} />
            </View>
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.email}>{email || 'your email'}</Text>
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { if (ref) inputRefs.current[index] = ref; }}
                style={[styles.otpInput, digit && styles.otpInputFilled]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
                keyboardType="numeric"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleVerify} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify Email'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Didn't receive the code? </Text>
            <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
              <Text style={[styles.linkText, resendLoading && styles.linkDisabled]}>
                {resendLoading ? 'Sending...' : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 32, paddingTop: 60, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 60, left: 32, padding: 8 },
  header: { alignItems: 'center', marginBottom: 48 },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '700', color: 'white', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 24 },
  email: { fontWeight: '600', color: 'white' },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32, paddingHorizontal: 8 },
  otpInput: { width: 48, height: 56, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 24, fontWeight: '600' },
  otpInputFilled: { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.4)' },
  button: { backgroundColor: 'white', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#2563EB', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  linkText: { color: 'white', fontSize: 16, fontWeight: '600' },
  linkDisabled: { opacity: 0.5 },
});