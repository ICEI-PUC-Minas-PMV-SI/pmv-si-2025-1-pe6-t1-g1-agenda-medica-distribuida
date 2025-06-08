import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '../constants/theme';
import { UploadService } from '../services/uploadService';

interface ImageUploaderProps {
  value: string;
  onImageSelected: (imageUri: string) => void;
  placeholder?: string;
}

export default function ImageUploader({ value, onImageSelected, placeholder = "Selecionar Imagem" }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Necessária',
        'Precisamos de permissão para acessar suas fotos.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Quadrado para foto de perfil
        quality: 0.8,
        base64: false, // Não precisamos de base64 para upload
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await uploadImage(asset);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Erro ao selecionar imagem. Tente novamente.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Necessária',
        'Precisamos de permissão para usar a câmera.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        await uploadImage(asset);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Erro ao tirar foto. Tente novamente.');
    }
  };

  const uploadImage = async (asset: ImagePicker.ImagePickerAsset) => {
    setUploading(true);
    try {
      console.log('🚀 Iniciando upload da imagem...');
      
      const result = await UploadService.uploadImage(asset);
      
      if (result.success && result.url) {
        console.log('✅ Upload concluído:', result.url);
        onImageSelected(result.url);
        Alert.alert('Sucesso', 'Imagem carregada com sucesso!');
      } else {
        console.error('❌ Erro no upload:', result.error);
        Alert.alert('Erro', result.error || 'Erro ao fazer upload da imagem.');
      }
    } catch (error: any) {
      console.error('❌ Erro inesperado no upload:', error);
      Alert.alert('Erro', 'Erro inesperado ao fazer upload. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Selecionar Imagem',
      'Escolha uma opção:',
      [
        { text: 'Galeria', onPress: pickImage },
        { text: 'Câmera', onPress: takePhoto },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {value ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: value }} style={styles.image} />
          <Button
            mode="outlined"
            onPress={showImageOptions}
            style={styles.changeButton}
            disabled={uploading}
          >
            Alterar Imagem
          </Button>
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Nenhuma imagem selecionada</Text>
          <Button
            mode="contained"
            onPress={showImageOptions}
            style={styles.selectButton}
            disabled={uploading}
          >
            {placeholder}
          </Button>
        </View>
      )}
      
      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.uploadingText}>Fazendo upload...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  changeButton: {
    marginTop: 8,
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: COLORS.primary,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  uploadingText: {
    marginLeft: 8,
    color: COLORS.textSecondary,
  },
}); 