import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, DollarSign, Settings } from 'lucide-react-native';

// Interfaces for type safety
interface Job {
  job_id: string;
  category_id: string;
  category_name: string;
  category_price: number;
  is_active: boolean;
  location: string | null;
  subcategories: SubCategory[];
}

interface SubCategory {
  sub_category_id: string;
  sub_category_name: string;
  price: number;
}

interface Category {
  category_id: string;
  category_name: string;
}

interface UserProfile {
  user_id: string;
  username: string;
  email: string;
  phone_number: string | null;
  role: 'client' | 'professional';
  is_verified: boolean;
  location: string | null;
}

// Fallback categories (temporary, for debugging)
const FALLBACK_CATEGORIES: Category[] = [
  { category_id: '1', category_name: 'Plumbing' },
  { category_id: '2', category_name: 'Electrical' },
  { category_id: '3', category_name: 'Carpentry' },
  { category_id: '4', category_name: 'Painting' },
  { category_id: '5', category_name: 'Cleaning' },
  { category_id: '6', category_name: 'Gardening' },
  { category_id: '7', category_name: 'HVAC' },
  { category_id: '8', category_name: 'Roofing' },
  { category_id: '9', category_name: 'Masonry' },
  { category_id: '10', category_name: 'Appliance Repair' },
];

export default function ProfessionalJobs() {
  const { userProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddJob, setShowAddJob] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryPrice, setCategoryPrice] = useState<string>('');
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const [subName, setSubName] = useState<string>('');
  const [subPrice, setSubPrice] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  // Debug Supabase connection and tables
  useEffect(() => {
    console.log('Supabase client debug:', {
      url: process.env.EXPO_PUBLIC_SUPABASE_URL,
      userId: userProfile?.user_id,
      email: userProfile?.email,
    });

    // Fetch available tables for debugging
    const debugTables = async () => {
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_schema, table_name')
          .eq('table_schema', 'public');
        console.log('Available tables in public schema:', { data, error });
      } catch (err) {
        console.error('Error fetching tables:', err);
      }
    };
    debugTables();
  }, [userProfile]);

  // Load jobs and categories
  useEffect(() => {
    if (userProfile?.role === 'professional') {
      loadJobs();
      loadCategories();
    }
  }, [userProfile]);

  // Load professional jobs
  const loadJobs = useCallback(async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { data: jobsData, error: jobsError } = await supabase
        .from('professional_jobs')
        .select(`
          job_id,
          category_id,
          category_price,
          is_active,
          location,
          job_sub_category_pricing (
            id,
            price,
            sub_category_id,
            sub_categories (
              sub_category_id,
              sub_category_name
            )
          )
        `)
        .eq('user_id', userProfile.user_id);

      if (jobsError) throw jobsError;

      const categoryIds = [...new Set(jobsData?.map((job: any) => job.category_id) || [])];
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('category_id, category_name')
        .in('category_id', categoryIds);

      if (categoriesError) throw categoriesError;

      const categoryMap = new Map(categoriesData?.map((cat: Category) => [cat.category_id, cat.category_name]) || []);

      const transformedJobs: Job[] = jobsData?.map((job: any) => ({
        job_id: job.job_id,
        category_id: job.category_id,
        category_name: categoryMap.get(job.category_id) || 'Unknown Category',
        category_price: parseFloat(job.category_price) || 0,
        is_active: job.is_active,
        location: job.location || 'Addis Ababa',
        subcategories: job.job_sub_category_pricing?.map((pricing: any) => ({
          sub_category_id: pricing.sub_category_id,
          sub_category_name: pricing.sub_categories?.sub_category_name || 'Unknown Subcategory',
          price: parseFloat(pricing.price) || 0,
        })) || [],
      })) || [];

      setJobs(transformedJobs);
    } catch (error: any) {
      console.error('Error loading jobs:', error);
      Alert.alert('Error', error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  // Load all available categories (no user filter)
  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      console.log('Fetching all categories');
      const { data, error, status, count } = await supabase
        .from('categories')
        .select('category_id, category_name', { count: 'exact' })
        .order('category_name', { ascending: true });

      console.log('Supabase categories response:', { data, error, status, count });

      if (error) {
        throw new Error(`Error fetching categories: ${error.message}`);
      }

      if (data && data.length > 0) {
        setCategories(data);
        setUsingFallback(false);
      } else {
        console.warn('No categories found in database. Using fallback categories.');
        setCategories(FALLBACK_CATEGORIES);
        setUsingFallback(true);
        setCategoriesError(
          'Failed to load categories from the database. Using temporary categories. Please contact support.'
        );
      }
    } catch (error: any) {
      console.error('Error loading categories:', error);
      setCategories(FALLBACK_CATEGORIES);
      setUsingFallback(true);
      setCategoriesError(
        error.message || 'Failed to load categories. Using temporary categories. Please contact support.'
      );
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Toggle job active/inactive status
  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('professional_jobs')
        .update({ is_active: !currentStatus })
        .eq('job_id', jobId);

      if (error) throw error;

      await loadJobs();
      Alert.alert('Success', `Job ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update job status');
    }
  };

  // Delete a job and its subcategories
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
              const { error: pricingError } = await supabase
                .from('job_sub_category_pricing')
                .delete()
                .eq('job_id', jobId);

              if (pricingError) throw pricingError;

              const { error: jobError } = await supabase
                .from('professional_jobs')
                .delete()
                .eq('job_id', jobId);

              if (jobError) throw jobError;

              await loadJobs();
              Alert.alert('Success', 'Job deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete job');
            }
          },
        },
      ]
    );
  };

  // Reset form fields
  const resetForm = () => {
    setSelectedCategory('');
    setCategoryPrice('');
    setSubcategories([]);
    setSubName('');
    setSubPrice('');
  };

  // Add a subcategory to the form
  const handleAddSubcategory = () => {
    if (!subName.trim() || !subPrice.trim() || isNaN(parseFloat(subPrice))) {
      Alert.alert('Error', 'Please enter a valid subcategory name and price.');
      return;
    }
    setSubcategories([
      ...subcategories,
      { sub_category_id: '', sub_category_name: subName.trim(), price: parseFloat(subPrice) },
    ]);
    setSubName('');
    setSubPrice('');
  };

  // Remove a subcategory from the form
  const handleRemoveSubcategory = (index: number) => {
    setSubcategories(subcategories.filter((_, i) => i !== index));
  };

  // Save a new job
  const handleSaveJob = async () => {
    if (!userProfile) {
      Alert.alert('Error', 'User profile not found');
      return;
    }
    if (!selectedCategory || !categoryPrice.trim() || isNaN(parseFloat(categoryPrice))) {
      Alert.alert('Error', 'Please select a category and enter a valid price.');
      return;
    }
    if (usingFallback) {
      Alert.alert(
        'Warning',
        'Using temporary categories. Job creation may fail due to invalid category IDs. Please contact support.'
      );
      return;
    }
    setSaving(true);
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('professional_jobs')
        .insert({
          user_id: userProfile.user_id,
          category_id: selectedCategory,
          category_price: parseFloat(categoryPrice),
          is_active: true,
          location: userProfile.location || 'Addis Ababa',
        })
        .select('job_id')
        .single();

      if (jobError) throw jobError;

      for (const sub of subcategories) {
        let subCatId: string | null = null;
        const { data: existingSub, error: findError } = await supabase
          .from('sub_categories')
          .select('sub_category_id')
          .eq('sub_category_name', sub.sub_category_name)
          .eq('category_id', selectedCategory)
          .maybeSingle();

        if (findError) throw findError;

        if (existingSub) {
          subCatId = existingSub.sub_category_id;
        } else {
          const { data: newSub, error: newSubError } = await supabase
            .from('sub_categories')
            .insert({
              sub_category_name: sub.sub_category_name,
              category_id: selectedCategory,
            })
            .select('sub_category_id')
            .single();
          if (newSubError) throw newSubError;
          subCatId = newSub.sub_category_id;
        }

        const { error: pricingError } = await supabase
          .from('job_sub_category_pricing')
          .insert({
            job_id: jobData.job_id,
            sub_category_id: subCatId,
            price: sub.price,
          });
        if (pricingError) throw pricingError;
      }

      setShowAddJob(false);
      resetForm();
      await loadJobs();
      Alert.alert('Success', 'Job added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add job.');
    } finally {
      setSaving(false);
    }
  };

  // Render each job item
  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.category_name}</Text>
          <View style={styles.priceContainer}>
            <DollarSign size={16} color="#10B981" />
            <Text style={styles.jobPrice}>ETB {item.category_price.toFixed(2)}</Text>
          </View>
          <Text style={styles.jobLocation}>{item.location}</Text>
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
        {item.subcategories.length > 0 ? (
          item.subcategories.map((sub) => (
            <View key={sub.sub_category_id} style={styles.subcategoryItem}>
              <Text style={styles.subcategoryName}>{sub.sub_category_name}</Text>
              <Text style={styles.subcategoryPrice}>ETB {sub.price.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.subcategoryName}>No subcategories</Text>
        )}
      </View>
      <View style={styles.jobFooter}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => Alert.alert('Coming Soon', 'Job editing will be available soon')}
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
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddJob(true)}>
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : jobs.length > 0 ? (
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
            Welcome, Ayele! Add your first job to start receiving client requests in Addis Ababa
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={() => setShowAddJob(true)}>
            <Text style={styles.emptyButtonText}>Add Your First Job</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showAddJob}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowAddJob(false);
          resetForm();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Job</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowAddJob(false);
                resetForm();
              }}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryPicker}>
              {categoriesLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator color="#2563EB" size="large" />
                  <Text style={styles.loaderText}>Loading categories...</Text>
                </View>
              ) : categoriesError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{categoriesError}</Text>
                  <TouchableOpacity style={styles.retryButton} onPress={loadCategories}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : categories.length === 0 ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>No categories available. Please contact support.</Text>
                </View>
              ) : (
                categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.category_id}
                    style={[
                      styles.categoryOption,
                      selectedCategory === cat.category_id && styles.selectedCategory,
                    ]}
                    onPress={() => setSelectedCategory(cat.category_id)}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        selectedCategory === cat.category_id && styles.selectedCategoryText,
                      ]}
                    >
                      {cat.category_name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <Text style={styles.inputLabel}>Category Price (ETB)</Text>
            <TextInput
              placeholder="Enter price"
              value={categoryPrice}
              onChangeText={setCategoryPrice}
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Subcategories</Text>
            {subcategories.map((sub, idx) => (
              <View key={idx} style={styles.subcategoryRow}>
                <Text style={styles.subcategoryText}>
                  {sub.sub_category_name} (ETB {sub.price.toFixed(2)})
                </Text>
                <TouchableOpacity onPress={() => handleRemoveSubcategory(idx)}>
                  <Text style={styles.removeSubcategoryText}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.subcategoryInputRow}>
              <TextInput
                placeholder="Subcategory name"
                value={subName}
                onChangeText={setSubName}
                style={[styles.input, styles.subcategoryNameInput]}
              />
              <TextInput
                placeholder="Price"
                value={subPrice}
                onChangeText={setSubPrice}
                keyboardType="numeric"
                style={[styles.input, styles.subcategoryPriceInput]}
              />
              <TouchableOpacity style={styles.addSubcategoryButton} onPress={handleAddSubcategory}>
                <Text style={styles.addSubcategoryText}>Add</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, saving && styles.disabledButton]}
              onPress={handleSaveJob}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Job</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFA',
  },
  jobsList: {
    flex: 1,
    backgroundColor: '#F9FAFA',
  },
  jobsContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  jobCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    marginBottom: 6,
  },
  jobLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  jobPrice: {
    fontSize: 16,
    fontWeight: '500',
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
    marginBottom: 12,
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
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
    paddingHorizontal: 12,
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
    paddingHorizontal: 12,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  modalContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexGrow: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  categoryPicker: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 200,
  },
  loaderContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loaderText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectedCategory: {
    backgroundColor: '#EBF8FF',
  },
  categoryText: {
    fontSize: 16,
    color: '#111827',
  },
  selectedCategoryText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  subcategoryInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subcategoryNameInput: {
    flex: 2,
    marginRight: 8,
  },
  subcategoryPriceInput: {
    flex: 1,
    marginRight: 8,
  },
  addSubcategoryButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addSubcategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  subcategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  subcategoryText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
  },
  removeSubcategoryText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#A3BFFA',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});