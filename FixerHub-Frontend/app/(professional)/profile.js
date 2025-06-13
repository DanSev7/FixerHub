import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Settings, 
  HelpCircle, 
  LogOut,
  Bell,
  Shield,
  CreditCard,
  FileText,
  CheckCircle
} from 'lucide-react-native';

export default function ProfessionalProfile() {
  const { userProfile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth');
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      title: 'Document Verification',
      icon: <FileText size={20} color="#6B7280" />,
      onPress: () => {
        // TODO: Navigate to document verification
        Alert.alert('Coming Soon', 'Document verification will be available soon');
      }
    },
    {
      title: 'Account Settings',
      icon: <Settings size={20} color="#6B7280" />,
      onPress: () => {
        // TODO: Navigate to account settings
        Alert.alert('Coming Soon', 'Account settings will be available soon');
      }
    },
    {
      title: 'Notifications',
      icon: <Bell size={20} color="#6B7280" />,
      onPress: () => {
        // TODO: Navigate to notification settings
        Alert.alert('Coming Soon', 'Notification settings will be available soon');
      }
    },
    {
      title: 'Privacy & Security',
      icon: <Shield size={20} color="#6B7280" />,
      onPress: () => {
        // TODO: Navigate to privacy settings
        Alert.alert('Coming Soon', 'Privacy settings will be available soon');
      }
    },
    {
      title: 'Payment Settings',
      icon: <CreditCard size={20} color="#6B7280" />,
      onPress: () => {
        // TODO: Navigate to payment settings
        Alert.alert('Coming Soon', 'Payment settings will be available soon');
      }
    },
    {
      title: 'Help & Support',
      icon: <HelpCircle size={20} color="#6B7280" />,
      onPress: () => {
        // TODO: Navigate to help section
        Alert.alert('Coming Soon', 'Help & support will be available soon');
      }
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <User size={40} color="white" strokeWidth={2} />
          </View>
          <Text style={styles.name}>{userProfile?.username}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.role}>Professional</Text>
            {userProfile?.is_verified && (
              <CheckCircle size={16} color="#10B981" style={styles.verifiedIcon} />
            )}
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoItem}>
            <Mail size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userProfile?.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Phone size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{userProfile?.phone_number}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MapPin size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>
                {userProfile?.location || 'Not set'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              {item.icon}
              <Text style={styles.menuItemText}>{item.title}</Text>
              <View style={styles.menuItemArrow}>
                <Text style={styles.arrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dangerSection}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>FixerHub v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 FixerHub. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  role: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  verifiedIcon: {
    marginLeft: 6,
  },
  infoSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoContent: {
    flex: 1,
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  menuSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 16,
  },
  menuItemArrow: {
    opacity: 0.5,
  },
  arrowText: {
    fontSize: 20,
    color: '#6B7280',
  },
  dangerSection: {
    backgroundColor: 'white',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 16,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
});