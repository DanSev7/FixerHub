import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Star,
  Briefcase,
  AlertCircle
} from 'lucide-react-native';

interface Stats {
  totalJobs: number;
  totalEarnings: number;
  messagesCount: number;
  averageRating: number;
  totalReviews: number;
}

interface VerificationStatus {
  status: 'pending' | 'verified' | 'failed' | null;
  hasDocuments: boolean;
}

export default function ProfessionalDashboard() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalEarnings: 0,
    messagesCount: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>({
    status: null,
    hasDocuments: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadDashboardData();
      checkVerificationStatus();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    if (!userProfile) return;

    try {
      // Load jobs count
      const { data: jobs, error: jobsError } = await supabase
        .from('professional_jobs')
        .select('*')
        .eq('user_id', userProfile.user_id);

      if (jobsError) throw jobsError;

      // Load messages count
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', userProfile.user_id)
        .eq('is_read', false);

      if (messagesError) throw messagesError;

      // Load reviews and calculate average rating
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('professional_id', userProfile.user_id);

      if (reviewsError) throw reviewsError;

      const totalReviews = reviews?.length || 0;
      const averageRating = totalReviews > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      // Calculate total earnings (mock calculation based on job prices)
      const totalEarnings = jobs?.reduce((sum, job) => sum + job.category_price, 0) || 0;

      setStats({
        totalJobs: jobs?.length || 0,
        totalEarnings,
        messagesCount: messages?.length || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const checkVerificationStatus = async () => {
    if (!userProfile) return;

    try {
      const { data, error } = await supabase
        .from('professional_documents')
        .select('verification_status, national_id_document_url, work_clearance_document_url')
        .eq('user_id', userProfile.user_id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setVerificationStatus({
          status: data.verification_status,
          hasDocuments: !!(data.national_id_document_url && data.work_clearance_document_url),
        });
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
  };

 const handleDocumentUpload = () => {
  router.push('/professional_documents');
};


  const renderVerificationBanner = () => {
    if (verificationStatus.status === 'verified') {
      return (
        <View style={[styles.banner, styles.successBanner]}>
          <CheckCircle size={20} color="#10B981" />
          <Text style={styles.bannerText}>Your account is verified!</Text>
        </View>
      );
    }

    if (verificationStatus.status === 'failed') {
      return (
        <View style={[styles.banner, styles.errorBanner]}>
          <XCircle size={20} color="#EF4444" />
          <View style={styles.bannerContent}>
            <Text style={styles.bannerText}>Verification failed</Text>
            <TouchableOpacity onPress={handleDocumentUpload}>
              <Text style={styles.bannerAction}>Upload new documents</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    if (verificationStatus.status === 'pending') {
      return (
        <View style={[styles.banner, styles.warningBanner]}>
          <Clock size={20} color="#F59E0B" />
          <Text style={styles.bannerText}>Verification in progress...</Text>
        </View>
      );
    }

    return (
      <View style={[styles.banner, styles.infoBanner]}>
        <AlertCircle size={20} color="#2563EB" />
        <View style={styles.bannerContent}>
          <Text style={styles.bannerText}>Complete your verification</Text>
          <TouchableOpacity onPress={handleDocumentUpload}>
            <Text style={styles.bannerAction}>Upload documents</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const statCards = [
    {
      title: 'Active Jobs',
      value: stats.totalJobs.toString(),
      icon: <Briefcase size={24} color="#2563EB" />,
      color: '#EBF8FF',
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toLocaleString()}`,
      icon: <DollarSign size={24} color="#10B981" />,
      color: '#ECFDF5',
    },
    {
      title: 'New Messages',
      value: stats.messagesCount.toString(),
      icon: <MessageSquare size={24} color="#F59E0B" />,
      color: '#FFFBEB',
    },
    {
      title: 'Rating',
      value: stats.averageRating > 0 ? `${stats.averageRating}★` : 'No rating',
      icon: <Star size={24} color="#EF4444" />,
      color: '#FEF2F2',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Welcome back, {userProfile?.username}!</Text>
        </View>

        {renderVerificationBanner()}

        <View style={styles.statsContainer}>
          {statCards.map((card, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: card.color }]}>
              {card.icon}
              <Text style={styles.statValue}>{card.value}</Text>
              <Text style={styles.statTitle}>{card.title}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(professional)/jobs')}
          >
            <View style={styles.actionContent}>
              <Briefcase size={24} color="#2563EB" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Manage Jobs</Text>
                <Text style={styles.actionDescription}>
                  Add, edit, or remove your service offerings
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(professional)/messages')}
          >
            <View style={styles.actionContent}>
              <MessageSquare size={24} color="#10B981" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>View Messages</Text>
                <Text style={styles.actionDescription}>
                  Respond to client inquiries and requests
                </Text>
              </View>
              {stats.messagesCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{stats.messagesCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/(professional)/reviews')}
          >
            <View style={styles.actionContent}>
              <Star size={24} color="#F59E0B" />
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Customer Reviews</Text>
                <Text style={styles.actionDescription}>
                  See what clients are saying about your work
                </Text>
              </View>
            </View>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 12,
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  errorBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  warningBanner: {
    backgroundColor: '#FFFBEB',
    borderColor: '#F59E0B',
    borderWidth: 1,
  },
  infoBanner: {
    backgroundColor: '#EBF8FF',
    borderColor: '#2563EB',
    borderWidth: 1,
  },
  bannerContent: {
    flex: 1,
    marginLeft: 12,
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  bannerAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563EB',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  actionsContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});