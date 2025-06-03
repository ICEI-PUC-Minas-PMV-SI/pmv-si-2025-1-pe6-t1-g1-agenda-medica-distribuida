import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { 
  Card, 
  Text, 
  Button, 
  ActivityIndicator, 
  FAB, 
  Portal, 
  Modal, 
  TextInput, 
  HelperText,
  Snackbar,
  IconButton,
  Chip
} from 'react-native-paper';
import { router } from 'expo-router';
import { doctors } from '../../services/api';
import { Doctor } from '../../services/api';
import { COLORS } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';

interface DoctorFormData {
  name: string;
  speciality: string;
  crm: string;
  pricePerAppointment: string;
  doctorImage: string;
  about: string;
}

interface FormErrors {
  name?: string;
  speciality?: string;
  crm?: string;
  pricePerAppointment?: string;
  about?: string;
}

export default function AdminDoctorsScreen() {
  const { user } = useAuth();
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    speciality: '',
    crm: '',
    pricePerAppointment: '',
    doctorImage: '',
    about: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Verificar se o usuário é admin - só mostrar alerta se usuário existe e não é admin
    if (user && !user.isAdmin) {
      Alert.alert(
        'Acesso Negado',
        'Apenas administradores podem acessar esta tela.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
      return;
    }
    
    // Só carregar médicos se o usuário for admin
    if (user?.isAdmin) {
      loadDoctors();
    }
  }, [user]);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await doctors.getAll();
      setDoctorsList(data);
      
    } catch (err: any) {
      console.error('Error loading doctors:', err);
      setError(`Erro ao carregar médicos: ${err.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Nome é obrigatório';
    }

    if (!formData.speciality.trim()) {
      errors.speciality = 'Especialidade é obrigatória';
    }

    if (!formData.crm.trim()) {
      errors.crm = 'CRM é obrigatório';
    }

    if (!formData.pricePerAppointment.trim()) {
      errors.pricePerAppointment = 'Preço é obrigatório';
    } else if (isNaN(Number(formData.pricePerAppointment))) {
      errors.pricePerAppointment = 'Preço deve ser um número válido';
    }

    if (!formData.about.trim()) {
      errors.about = 'Descrição é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const doctorData = {
        ...formData,
        pricePerAppointment: Number(formData.pricePerAppointment)
      };

      if (editingDoctor) {
        // Atualizar médico existente
        const crm = editingDoctor.crm || editingDoctor.id;
        if (!crm) {
          throw new Error('CRM do médico não encontrado');
        }
        await doctors.updateDoctor(crm, doctorData);
        setSnackbarMessage('Médico atualizado com sucesso!');
      } else {
        // Criar novo médico
        await doctors.createDoctor(doctorData);
        setSnackbarMessage('Médico criado com sucesso!');
      }

      setShowModal(false);
      setEditingDoctor(null);
      resetForm();
      await loadDoctors();
      setSnackbarVisible(true);

    } catch (error: any) {
      console.error('Error saving doctor:', error);
      Alert.alert(
        'Erro',
        `Erro ao ${editingDoctor ? 'atualizar' : 'criar'} médico: ${error.message || 'Tente novamente.'}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      speciality: doctor.specialty || '',
      crm: doctor.crm || '',
      pricePerAppointment: doctor.fees?.toString() || '',
      doctorImage: doctor.image || '',
      about: doctor.about || ''
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleDelete = (doctor: Doctor) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o médico ${doctor.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => confirmDelete(doctor)
        }
      ]
    );
  };

  const confirmDelete = async (doctor: Doctor) => {
    try {
      await doctors.deleteDoctor(doctor.crm || doctor.id);
      setSnackbarMessage('Médico excluído com sucesso!');
      await loadDoctors();
      setSnackbarVisible(true);
    } catch (error: any) {
      console.error('Error deleting doctor:', error);
      Alert.alert(
        'Erro',
        `Erro ao excluir médico: ${error.message || 'Tente novamente.'}`
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      speciality: '',
      crm: '',
      pricePerAppointment: '',
      doctorImage: '',
      about: ''
    });
    setFormErrors({});
  };

  const handleAddNew = () => {
    setEditingDoctor(null);
    resetForm();
    setShowModal(true);
  };

  if (!user) {
    // Usuário não carregado ainda ou fez logout - não mostrar nada
    return null;
  }

  if (!user.isAdmin) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Acesso negado</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando médicos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={loadDoctors} style={styles.retryButton}>
          Tentar novamente
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Administração de Médicos
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {doctorsList.length} médicos cadastrados
          </Text>
        </View>

        <View style={styles.doctorsList}>
          {doctorsList.map((doctor) => (
            <Card key={doctor.id} style={styles.card}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <View style={styles.doctorInfo}>
                    <Text variant="titleMedium" style={styles.doctorName}>
                      {doctor.name}
                    </Text>
                    <Chip mode="outlined" style={styles.specialtyChip}>
                      {doctor.specialty || 'Especialidade não informada'}
                    </Chip>
                  </View>
                  <View style={styles.cardActions}>
                    <IconButton
                      icon="pencil"
                      size={20}
                      onPress={() => handleEdit(doctor)}
                    />
                    <IconButton
                      icon="delete"
                      size={20}
                      iconColor={COLORS.error}
                      onPress={() => handleDelete(doctor)}
                    />
                  </View>
                </View>
                
                {doctor.crm && (
                  <Text variant="bodySmall" style={styles.info}>
                    CRM: {doctor.crm}
                  </Text>
                )}
                {doctor.fees && (
                  <Text variant="bodySmall" style={styles.fees}>
                    Consulta: R$ {doctor.fees.toFixed(2)}
                  </Text>
                )}
                {doctor.about && (
                  <Text variant="bodySmall" style={styles.about} numberOfLines={2}>
                    {doctor.about}
                  </Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddNew}
      />

      <Portal>
        <Modal
          visible={showModal}
          onDismiss={() => setShowModal(false)}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              {editingDoctor ? 'Editar Médico' : 'Novo Médico'}
            </Text>

            <TextInput
              mode="outlined"
              label="Nome *"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              error={!!formErrors.name}
              style={styles.input}
            />
            {formErrors.name && (
              <HelperText type="error">{formErrors.name}</HelperText>
            )}

            <TextInput
              mode="outlined"
              label="Especialidade *"
              value={formData.speciality}
              onChangeText={(text) => setFormData(prev => ({ ...prev, speciality: text }))}
              error={!!formErrors.speciality}
              style={styles.input}
            />
            {formErrors.speciality && (
              <HelperText type="error">{formErrors.speciality}</HelperText>
            )}

            <TextInput
              mode="outlined"
              label="CRM *"
              value={formData.crm}
              onChangeText={(text) => setFormData(prev => ({ ...prev, crm: text }))}
              error={!!formErrors.crm}
              style={styles.input}
              editable={!editingDoctor} // CRM não pode ser editado
            />
            {formErrors.crm && (
              <HelperText type="error">{formErrors.crm}</HelperText>
            )}

            <TextInput
              mode="outlined"
              label="Preço da Consulta *"
              value={formData.pricePerAppointment}
              onChangeText={(text) => setFormData(prev => ({ ...prev, pricePerAppointment: text }))}
              error={!!formErrors.pricePerAppointment}
              keyboardType="numeric"
              style={styles.input}
            />
            {formErrors.pricePerAppointment && (
              <HelperText type="error">{formErrors.pricePerAppointment}</HelperText>
            )}

            <TextInput
              mode="outlined"
              label="URL da Imagem"
              value={formData.doctorImage}
              onChangeText={(text) => setFormData(prev => ({ ...prev, doctorImage: text }))}
              style={styles.input}
            />

            <TextInput
              mode="outlined"
              label="Sobre o Médico *"
              value={formData.about}
              onChangeText={(text) => setFormData(prev => ({ ...prev, about: text }))}
              error={!!formErrors.about}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            {formErrors.about && (
              <HelperText type="error">{formErrors.about}</HelperText>
            )}

            <View style={styles.modalActions}>
              <Button
                mode="outlined"
                onPress={() => setShowModal(false)}
                style={styles.cancelButton}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={submitting}
                disabled={submitting}
                style={styles.saveButton}
              >
                {editingDoctor ? 'Atualizar' : 'Criar'}
              </Button>
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.surface,
    marginBottom: 8,
  },
  title: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  doctorsList: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  specialtyChip: {
    alignSelf: 'flex-start',
  },
  cardActions: {
    flexDirection: 'row',
  },
  info: {
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  fees: {
    color: COLORS.success,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  about: {
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  modal: {
    backgroundColor: COLORS.surface,
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '90%',
  },
  modalTitle: {
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
  },
}); 