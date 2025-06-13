import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Settings, Users, ArrowRight } from 'lucide-react-native';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<'client' | 'professional' | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) {
      Alert.alert('Error', 'Please select a role');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: selectedRole })
        .eq('user_id', user.id);

      if (error) throw error;

      // Navigate based on role
      if (selectedRole === 'client') {
        router.replace('/(client)');
      } else {
        router.replace('/(professional)');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#2563EB', '#1D4ED8', '#1E40AF']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Settings size={48} color="white" strokeWidth={1.5} />
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>How would you like to use FixerHub?</Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.option,
              selectedRole === 'client' && styles.optionSelected,
            ]}
            onPress={() => setSelectedRole('client')}
          >
            <View style={styles.optionContent}>
              <Search size={32} color={selectedRole === 'client' ? '#2563EB' : 'white'} strokeWidth={1.5} />
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionTitle,
                  selectedRole === 'client' && styles.optionTitleSelected,
                ]}>
                  I'm a Client
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedRole === 'client' && styles.optionDescriptionSelected,
                ]}>
                  I need to hire professionals for services and repairs
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selectedRole === 'professional' && styles.optionSelected,
            ]}
            onPress={() => setSelectedRole('professional')}
          >
            <View style={styles.optionContent}>
              <Users size={32} color={selectedRole === 'professional' ? '#2563EB' : 'white'} strokeWidth={1.5} />
              <View style={styles.optionText}>
                <Text style={[
                  styles.optionTitle,
                  selectedRole === 'professional' && styles.optionTitleSelected,
                ]}>
                  I'm a Professional
                </Text>
                <Text style={[
                  styles.optionDescription,
                  selectedRole === 'professional' && styles.optionDescriptionSelected,
                ]}>
                  I offer professional services and want to find clients
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (!selectedRole || loading) && styles.buttonDisabled,
          ]}
          onPress={handleRoleSelection}
          disabled={!selectedRole || loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Setting up...' : 'Continue'}
          </Text>
          {!loading && <ArrowRight size={20} color="#2563EB" style={styles.buttonIcon} />}
        </TouchableOpacity>
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
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  options: {
    marginBottom: 32,
  },
  option: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  optionSelected: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#2563EB',
  },
  optionDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  optionDescriptionSelected: {
    color: 'rgba(37, 99, 235, 0.7)',
  },
  button: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 8,
  },
});