import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useImageUploadDebug as useImageUpload } from '../hooks/useImageUploadDebug';

// Especialidades disponíveis (mesmas que o usuário não administrador usa)
const SPECIALTIES = [
  'Clínico Geral',
  'Ginecologista',
  'Dermatologista',
  'Pediatra',
  'Neurologista',
  'Gastroenterologista'
];

interface Doctor {
  name: string;
  specialty: string;
  crm: string;
  email: string;
  phone: string;
  imageUrl?: string;
}

interface AddDoctorFormProps {
  onSubmit: (doctor: Doctor) => Promise<void>;
  onCancel: () => void;
}

export const AddDoctorForm: React.FC<AddDoctorFormProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [doctor, setDoctor] = useState<Doctor>({
    name: '',
    specialty: '',
    crm: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isUploading,
    uploadProgress,
    selectedImage,
    uploadedImageUrl,
    error: uploadError,
    selectImage,
    selectImageFromCamera,
    uploadImage,
    clearImage,
    clearError,
  } = useImageUpload();

  const handleImageSelection = () => {
    Alert.alert(
      'Selecionar Foto',
      'Escolha uma opção:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galeria', onPress: selectImage },
        { text: 'Câmera', onPress: selectImageFromCamera },
      ]
    );
  };

  const handleSubmit = async () => {
    // Validação básica
    if (!doctor.name.trim() || !doctor.specialty.trim() || !doctor.crm.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      setIsSubmitting(true);
      
      let imageUrl = uploadedImageUrl;
      
      // Se há uma imagem selecionada mas não foi feito upload, fazer o upload
      if (selectedImage && !uploadedImageUrl) {
        const uploadResponse = await uploadImage('doctors');
        imageUrl = uploadResponse?.secure_url || null;
      }

      const doctorData: Doctor = {
        ...doctor,
        imageUrl: imageUrl || undefined,
      };

      await onSubmit(doctorData);
      
      // Limpar formulário após sucesso
      setDoctor({
        name: '',
        specialty: '',
        crm: '',
        email: '',
        phone: '',
      });
      clearImage();
      
      Alert.alert('Sucesso', 'Médico adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar médico. Tente novamente.');
      console.error('Erro ao adicionar médico:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayImage = uploadedImageUrl || selectedImage;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Adicionar Médico</Text>

      {/* Seção de Foto */}
      <View style={styles.imageSection}>
        <Text style={styles.label}>Foto do Médico</Text>
        
        {displayImage ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: displayImage }} style={styles.image} />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={handleImageSelection}
              disabled={isUploading}
            >
              <Text style={styles.changeImageText}>Alterar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={clearImage}
              disabled={isUploading}
            >
              <Text style={styles.removeImageText}>Remover</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.selectImageButton}
            onPress={handleImageSelection}
            disabled={isUploading}
          >
            <Text style={styles.selectImageText}>
              {isUploading ? 'Fazendo Upload...' : 'Selecionar Foto'}
            </Text>
          </TouchableOpacity>
        )}

        {isUploading && (
          <View style={styles.uploadProgress}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.uploadText}>
              Upload: {uploadProgress}%
            </Text>
          </View>
        )}

        {uploadError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{uploadError}</Text>
            <TouchableOpacity onPress={clearError}>
              <Text style={styles.clearErrorText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Campos do Formulário */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Nome Completo *</Text>
        <TextInput
          style={styles.input}
          value={doctor.name}
          onChangeText={(text) => setDoctor({ ...doctor, name: text })}
          placeholder="Digite o nome completo"
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Especialidade *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={doctor.specialty}
            onValueChange={(itemValue: string) => setDoctor({ ...doctor, specialty: itemValue })}
            style={styles.picker}
            enabled={!isSubmitting}
          >
            <Picker.Item label="Selecione uma especialidade" value="" />
            {SPECIALTIES.map((specialty) => (
              <Picker.Item 
                key={specialty} 
                label={specialty} 
                value={specialty} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>CRM *</Text>
        <TextInput
          style={styles.input}
          value={doctor.crm}
          onChangeText={(text) => setDoctor({ ...doctor, crm: text })}
          placeholder="Digite o CRM"
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={doctor.email}
          onChangeText={(text) => setDoctor({ ...doctor, email: text })}
          placeholder="Digite o email"
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isSubmitting}
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={doctor.phone}
          onChangeText={(text) => setDoctor({ ...doctor, phone: text })}
          placeholder="Digite o telefone"
          keyboardType="phone-pad"
          editable={!isSubmitting}
        />
      </View>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
          disabled={isSubmitting || isUploading}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitButtonText}>Adicionar</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  imageSection: {
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
    alignSelf: 'flex-start',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  selectImageButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  selectImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  changeImageButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  removeImageButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007AFF',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    flex: 1,
  },
  clearErrorText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
  },
  formSection: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginLeft: 10,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 