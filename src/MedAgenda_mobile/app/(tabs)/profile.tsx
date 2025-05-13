import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { profileService } from '../../services/api';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  allergies: string;
  medications: string;
  imageUrl?: string;
};

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bloodType: '',
    allergies: '',
    medications: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await profileService.updateProfile(profile);
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePick = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos.');
        return;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        try {
          setSaving(true);
          // Upload image
          await profileService.updateProfileImage({
            uri: result.assets[0].uri,
            type: 'image/jpeg',
            name: 'profile-image.jpg',
          });
          // Refresh profile to get new image URL
          await fetchProfile();
          Alert.alert('Success', 'Profile picture updated successfully!');
        } catch (err) {
          Alert.alert('Error', 'Failed to update profile picture. Please try again.');
        } finally {
          setSaving(false);
        }
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const renderField = (label: string, value: string, key: keyof UserProfile) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={(text) => setProfile({ ...profile, [key]: text })}
          />
        ) : (
          <Text style={styles.fieldValue}>{value}</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={
              profile.imageUrl
                ? { uri: profile.imageUrl }
                : require('../../assets/images/default-avatar.png')
            }
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.editImageButton}
            onPress={handleImagePick}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialIcons name="photo-camera" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <MaterialIcons
              name={isEditing ? 'check' : 'edit'}
              size={24}
              color="#007AFF"
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {renderField('Name', profile.name, 'name')}
        {renderField('Email', profile.email, 'email')}
        {renderField('Phone', profile.phone, 'phone')}
        {renderField('Date of Birth', profile.dateOfBirth, 'dateOfBirth')}
        {renderField('Blood Type', profile.bloodType, 'bloodType')}
        {renderField('Allergies', profile.allergies, 'allergies')}
        {renderField('Current Medications', profile.medications, 'medications')}

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="history" size={24} color="#666" />
            <Text style={styles.actionText}>Medical History</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="description" size={24} color="#666" />
            <Text style={styles.actionText}>Documents</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="settings" size={24} color="#666" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  content: {
    padding: 16,
  },
  fieldContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
}); 