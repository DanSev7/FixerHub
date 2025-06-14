import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, DollarSign, Settings } from 'lucide-react-native';

interface Job {
  job_id: string;
  category_id: string;
  category_name: string;
  category_price: number;
  is_active: boolean;
  subcategories: SubCategory[];
}

interface SubCategory {
  sub_category_id: string;
  sub_category_name: string;
  price: number;
}

export default function ProfessionalJobs() {
  const { userProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);

  useEffect(() => {
    if (userProfile) {
      loadJobs();
    }
  }, [userProfile]);

  const loadJobs = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('professional_jobs')
        .select(`
          job_id,
          category_id,
          category_price,
          is_active,
          categories!inner (
            category_name
          ),
          job_sub_category_pricing!inner (
            price,
            sub_categories!inner (
              sub_category_id,
              sub_category_name
            )
          )
        `)
        .eq('user_id', userProfile.user_id);

      if (error) throw error;

      // Transform the data to group subcategories by job
      const transformedJobs = data?.map((job: any) => ({
        job_id: job.job_id,
        category_id: job.category_id,
        category_name: job.categories.category_name,
        category_price: job.category_price,
        is_active: job.is_active,
        subcategories: job.job_sub_category_pricing.map((pricing: any) => ({
          sub_category_id: pricing.sub_categories.sub_category_id,
          sub_category_name: pricing.sub_categories.sub_category_name,
          price: pricing.price,
        })),
      })) || [];

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
      Alert.alert('Error', 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('professional_jobs')
        .update({ is_active: !currentStatus })
        .eq('job_id', jobId);

      if (error) throw error;

      loadJobs();
      Alert.alert(
        'Success', 
        `Job ${!currentStatus ? 'activated' : 'deactivated'} successfully`
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const deleteJob = async (jobId: string) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete subcategory pricing first
              await supabase
                .from('job_sub_category_pricing')
                .delete()
                .eq('job_id', jobId);

              // Then delete the job
              const { error } = await supabase
                .from('professional_jobs')
                .delete()
                .eq('job_id', jobId);

              if (error) throw error;

              loadJobs();
              Alert.alert('Success', 'Job deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.category_name}</Text>
          <View style={styles.priceContainer}>
            <DollarSign size={16} color="#10B981" />
            <Text style={styles.jobPrice}>${item.category_price}</Text>
          </View>
        </View>
        <View style={styles.jobActions}>
          <TouchableOpacity
            style={[styles.statusButton, item.is_active ? styles.activeButton : styles.inactiveButton]}
            onPress={() => toggleJobStatus(item.job_id, item.is_active)}
          >
            <Text style={[styles.statusText, item.is_active ? styles.activeText : styles.inactiveText]}>
              {item.is_active ? 'Active' : 'Inactive'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.subcategoriesContainer}>
        <Text style={styles.subcategoriesTitle}>Services:</Text>
        {item.subcategories.map((sub) => (
          <View key={sub.sub_category_id} style={styles.subcategoryItem}>
            <Text style={styles.subcategoryName}>{sub.sub_category_name}</Text>
            <Text style={styles.subcategoryPrice}>${sub.price}</Text>
          </View>
        ))}
      </View>

      <View style={styles.jobFooter}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            // TODO: Navigate to edit job screen
            Alert.alert('Coming Soon', 'Job editing will be available soon');
          }}
        >
          <Edit size={16} color="#2563EB" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteJob(item.job_id)}
        >
          <Trash2 size={16} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Jobs</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddJob(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {jobs.length > 0 ? (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.job_id}
          style={styles.jobsList}
          contentContainerStyle={styles.jobsContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Settings size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Jobs Yet</Text>
          <Text style={styles.emptyDescription}>
            Add your first job to start receiving client requests
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setShowAddJob(true)}
          >
            <Text style={styles.emptyButtonText}>Add Your First Job</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showAddJob}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Job</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddJob(false)}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.comingSoonText}>
              Job creation interface coming soon!
            </Text>
            <Text style={styles.comingSoonDescription}>
              You'll be able to select categories, add subcategories, set prices, and manage your service offerings.
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobsList: {
    flex: 1,
  },
  jobsContent: {
    padding: 20,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  jobActions: {
    alignItems: 'flex-end',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  activeButton: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  inactiveButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#10B981',
  },
  inactiveText: {
    color: '#EF4444',
  },
  subcategoriesContainer: {
    marginBottom: 16,
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  subcategoryName: {
    fontSize: 14,
    color: '#111827',
  },
  subcategoryPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EBF8FF',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
    marginLeft: 6,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});