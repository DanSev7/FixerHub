import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '@/config/api';

export default function ProfessionalDocument() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );

      console.log('[📸 Image Selected]');
      console.log('URI:', manipulatedImage.uri);
      console.log('Base64 length:', manipulatedImage.base64?.length);

      setImageUri(manipulatedImage.uri);
      setBase64Image(`data:image/jpeg;base64,${manipulatedImage.base64}`);
      setResultMessage('');
    }
  };

  const verifyId = async () => {
    if (!base64Image || !token) {
      Alert.alert('Missing data', 'Image or token is missing');
      return;
    }

    console.log('[🔑 Token]', token.slice(0, 10) + '...');

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/verify-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ image: base64Image }),
      });

      const responseText = await response.text();
      console.log('[📨 Response Status]', response.status);
      console.log('[📨 Response Body]', responseText);

      try {
        const data = JSON.parse(responseText);
        setResultMessage(data.message || 'Unknown response');
      } catch (jsonErr) {
        console.error('❌ JSON parse error:', jsonErr);
        setResultMessage('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      setResultMessage('Error verifying ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>National ID Verification</Text>

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>📷 Select ID Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.card}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      {base64Image && !loading && (
        <TouchableOpacity style={styles.buttonSecondary} onPress={verifyId}>
          <Text style={styles.buttonText}>🔍 Verify ID</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 20 }} />}

      {resultMessage !== '' && (
        <View style={styles.resultBox}>
          <Text
            style={[
              styles.result,
              resultMessage.toLowerCase().includes('success')
                ? styles.success
                : styles.error,
            ]}
          >
            {resultMessage}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    marginTop: 20,
    color: '#222',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonSecondary: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    padding: 10,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  resultBox: {
    marginTop: 25,
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  result: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  success: {
    color: '#28a745',
  },
  error: {
    color: '#dc3545',
  },
});
