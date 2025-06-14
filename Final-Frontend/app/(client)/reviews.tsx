import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Star, Plus, X } from 'lucide-react-native';

interface Review {
  review_id: string;
  professional_id: string;
  professional_name: string;
  rating: number;
  review_text: string | null;
  timestamp: string;
}

export default function ClientReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    professionalId: '',
    rating: 0,
    reviewText: '',
  });

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user]);

  const loadReviews = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          professional:users!reviews_professional_id_fkey(username)
        `)
        .eq('client_id', user.id)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const formattedReviews = data?.map((review: any) => ({
        review_id: review.review_id,
        professional_id: review.professional_id,
        professional_name: review.professional.username,
        rating: review.rating,
        review_text: review.review_text,
        timestamp: review.timestamp,
      })) || [];

      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user || !newReview.professionalId || newReview.rating === 0) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          client_id: user.id,
          professional_id: newReview.professionalId,
          rating: newReview.rating,
          review_text: newReview.reviewText || null,
        });

      if (error) throw error;

      setShowAddReview(false);
      setNewReview({ professionalId: '', rating: 0, reviewText: '' });
      loadReviews();
      Alert.alert('Success', 'Review submitted successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const renderStars = (rating: number, size = 16, interactive = false, onPress?: (rating: number) => void) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => interactive && onPress?.(i)}
          disabled={!interactive}
          style={styles.starButton}
        >
          <Star
            size={size}
            color={i <= rating ? '#F59E0B' : '#D1D5DB'}
            fill={i <= rating ? '#F59E0B' : 'transparent'}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewInfo}>
          <Text style={styles.professionalName}>{item.professional_name}</Text>
          {renderStars(item.rating)}
        </View>
        <Text style={styles.reviewDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      
      {item.review_text && (
        <Text style={styles.reviewText}>{item.review_text}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reviews</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddReview(true)}
        >
          <Plus size={20} color="white" />
        </TouchableOpacity>
      </View>

      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item.review_id}
          style={styles.reviewsList}
          contentContainerStyle={styles.reviewsContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Star size={48} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          <Text style={styles.emptyDescription}>
            Leave reviews for professionals you've worked with to help other clients
          </Text>
        </View>
      )}

      <Modal
        visible={showAddReview}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Review</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowAddReview(false)}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Professional ID</Text>
              <TextInput
                style={styles.input}
                value={newReview.professionalId}
                onChangeText={(text) => setNewReview(prev => ({ ...prev, professionalId: text }))}
                placeholder="Enter professional ID"
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.helpText}>
                You can find this in your message history with the professional
              </Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rating</Text>
              {renderStars(newReview.rating, 32, true, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Review (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newReview.reviewText}
                onChangeText={(text) => setNewReview(prev => ({ ...prev, reviewText: text }))}
                placeholder="Share your experience with this professional..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                maxLength={500}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, newReview.rating === 0 && styles.submitButtonDisabled]}
              onPress={submitReview}
              disabled={newReview.rating === 0}
            >
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
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
  reviewsList: {
    flex: 1,
  },
  reviewsContent: {
    padding: 20,
  },
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  starButton: {
    marginRight: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  reviewText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
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
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: 'white',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});