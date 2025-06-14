import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';

export default function UploadDocuments() {
  const router = useRouter();

  const { userProfile } = useAuth();
  const [nationalID, setNationalID] = useState<DocumentPicker.DocumentResult | null>(null);
  const [workClearance, setWorkClearance] = useState<DocumentPicker.DocumentResult | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickDocument = async (type: 'national' | 'clearance') => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.canceled) return;

    if (type === 'national') setNationalID(result.assets[0]);
    else setWorkClearance(result.assets[0]);
  };

  const handleUpload = async () => {
    if (!nationalID || !workClearance) {
      Alert.alert('Missing Files', 'Please upload both required documents.');
      return;
    }

    try {
      setUploading(true);

      // Upload to Supabase Storage
      const uploadFile = async (file: DocumentPicker.DocumentPickerAsset, path: string) => {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(path, blob, { upsert: true });

        if (error) throw error;
        return `${supabase.storage.from('documents').getPublicUrl(path).data.publicUrl}`;
      };

      const nationalIDUrl = await uploadFile(nationalID, `national_ids/${userProfile.user_id}-${Date.now()}`);
      const clearanceUrl = await uploadFile(workClearance, `clearance_docs/${userProfile.user_id}-${Date.now()}`);

      // Insert into professional_documents
      const { error } = await supabase.from('professional_documents').upsert({
        user_id: userProfile.user_id,
        national_id_document_url: nationalIDUrl,
        work_clearance_document_url: clearanceUrl,
        verification_status: 'pending',
        verification_otp: null,
        verified_name: null,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Success', 'Documents uploaded successfully. Verification is pending.');
      setNationalID(null);
      setWorkClearance(null);
    } catch (err: any) {
      Alert.alert('Upload Failed', err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
  <Text style={styles.backButtonText}>← Back</Text>
</TouchableOpacity>

      <Text style={styles.title}>Upload Verification Documents</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('national')}>
        <Text style={styles.uploadButtonText}>
          {nationalID ? `Selected: ${nationalID.name}` : 'Upload National ID'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument('clearance')}>
        <Text style={styles.uploadButtonText}>
          {workClearance ? `Selected: ${workClearance.name}` : 'Upload Work Clearance'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpload} disabled={uploading}>
        {uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Submit</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#E5E7EB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButtonText: {
    textAlign: 'center',
    color: '#111827',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
  },backButton: {
  marginBottom: 16,
},
backButtonText: {
  fontSize: 16,
  color: '#2563EB',
  fontWeight: '500',
},

});
