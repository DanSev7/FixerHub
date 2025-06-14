import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Wrench, ArrowRight } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#2563EB', '#1E40AF']}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Wrench size={50} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.title}>Welcome to FixerHub</Text>
          <Text style={styles.description}>
            Connect with verified professionals for all your repair and service needs. 
            From plumbing to beauty services, find trusted experts near you.
          </Text>
        </View>

        <View style={styles.illustrationSection}>
          <View style={styles.illustrationCard}>
            <Text style={styles.illustrationEmoji}>🔧</Text>
            <Text style={styles.illustrationText}>Find Professionals</Text>
          </View>
          <View style={styles.illustrationCard}>
            <Text style={styles.illustrationEmoji}>✅</Text>
            <Text style={styles.illustrationText}>Get Verified</Text>
          </View>
          <View style={styles.illustrationCard}>
            <Text style={styles.illustrationEmoji}>⭐</Text>
            <Text style={styles.illustrationText}>Leave Reviews</Text>
          </View>
        </View>

        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/auth/sign-up')}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <ArrowRight size={20} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/')}>
            <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#93C5FD',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  illustrationSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  illustrationCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
    marginHorizontal: 6,
  },
  illustrationEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  illustrationText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonSection: {
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563EB',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#93C5FD',
    textDecorationLine: 'underline',
  },
});