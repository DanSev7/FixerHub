import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Wrench, ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#2563EB', '#1E40AF']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Wrench size={48} color="#FFFFFF" strokeWidth={2} />
          </View>
          <Text style={styles.title}>Welcome to FixerHub</Text>
          <Text style={styles.description}>
            Connect with verified professionals for all your repair and service needs. 
            From plumbing to beauty services, find trusted experts near you.
          </Text>
        </View>

        {/* Feature emojis */}
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

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/auth/sign-up')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <ArrowRight size={22} color="#2563EB" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/')}
            activeOpacity={0.6}
          >
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
    paddingHorizontal: 28,
    paddingTop: 70,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 26,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 14,
  },
  description: {
    fontSize: 17,
    color: '#BBD7FF',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
  },
  illustrationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  illustrationCard: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 22,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    alignItems: 'center',
  },
  illustrationEmoji: {
    fontSize: 36,
    marginBottom: 12,
  },
  illustrationText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonSection: {
    marginTop: 40,
    gap: 18,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A7C3FF',
    textDecorationLine: 'underline',
  },
});
