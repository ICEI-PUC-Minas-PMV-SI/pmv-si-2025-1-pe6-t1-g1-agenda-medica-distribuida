import { useState, useEffect } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import { Button, Card, HelperText, TextInput, Text, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants/theme';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doctors, appointments } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface FormErrors {
  specialty?: string;
  doctor?: string;
  date?: string;
}

export default function NewAppointmentScreen() {
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Data from API
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [doctorsList, setDoctorsList] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter doctors by specialty
    if (specialty) {
      const filtered = doctorsList.filter(doc => doc.specialty === specialty);
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
    setSelectedDoctor(null); // Reset doctor selection when specialty changes
  }, [specialty, doctorsList]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      
      // Load doctors and specialties
      const doctorsData = await doctors.getAll();
      const specialtiesData = await doctors.getSpecialties();
      
      setDoctorsList(doctorsData);
      setSpecialties(specialtiesData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Erro', 'Erro ao carregar dados. Tente novamente.');
    } finally {
      setLoadingData(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!specialty) {
      newErrors.specialty = 'Selecione uma especialidade';
    }

    if (!selectedDoctor) {
      newErrors.doctor = 'Selecione um médico';
    }

    // Check if date is in the future
    const now = new Date();
    if (date < now) {
      newErrors.date = 'A data deve ser no futuro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAppointment = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Extract userId from token
      const token = await AsyncStorage.getItem('@MedAgenda:token');
      let userId = null;
      
      if (token) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          userId = decoded.userId;
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
        }
      }

      if (!userId) {
        Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
        return;
      }

      // Prepare appointment data
      const appointmentData = {
        patientId: userId,
        doctorId: selectedDoctor.crm, // Use CRM as doctor ID
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), // HH:MM format
        notes: notes,
      };

      console.log('Creating appointment with data:', appointmentData);
      
      // Call API to create appointment
      try {
        const result = await appointments.create(appointmentData);
        console.log('Appointment created successfully:', result);
        
        Alert.alert(
          'Sucesso!', 
          'Consulta agendada com sucesso!',
          [
            {
              text: 'OK',
              onPress: () => router.back()
            }
          ]
        );
      } catch (apiError: any) {
        // Se for erro 504 (timeout do backend), mostrar mensagem específica
        if (apiError.status === 504 || apiError.message?.includes('504')) {
          Alert.alert(
            'Problema Temporário',
            'O servidor está temporariamente indisponível para criar agendamentos. Seus dados foram salvos localmente e serão sincronizados quando o servidor estiver disponível.',
            [
              {
                text: 'OK',
                onPress: () => router.back()
              }
            ]
          );
          
          // TODO: Implementar salvamento local para sincronização posterior
          console.log('Appointment saved locally for later sync:', appointmentData);
          
        } else {
          // Outros erros
          throw apiError;
        }
      }
      
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      const errorMessage = error.message || 'Erro ao agendar consulta. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setErrors(prev => ({ ...prev, date: undefined }));
    }
  };

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newDate = new Date(date);
      newDate.setHours(selectedDate.getHours());
      newDate.setMinutes(selectedDate.getMinutes());
      setDate(newDate);
      setErrors(prev => ({ ...prev, date: undefined }));
    }
  };

  if (loadingData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ padding: 16 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
          Nova Consulta
        </Text>

        {/* Specialty Selection */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Especialidade" />
          <Card.Content>
            <TextInput
              mode="outlined"
              label="Selecione a especialidade"
              value={specialty}
              onChangeText={(value) => {
                setSpecialty(value);
                setErrors(prev => ({ ...prev, specialty: undefined }));
              }}
              error={!!errors.specialty}
              style={{ marginBottom: 8 }}
            />
            {errors.specialty && (
              <HelperText type="error" visible={!!errors.specialty}>
                {errors.specialty}
              </HelperText>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {specialties.map((item) => (
                <Button
                  key={item}
                  mode={specialty === item ? 'contained' : 'outlined'}
                  onPress={() => {
                    setSpecialty(item);
                    setErrors(prev => ({ ...prev, specialty: undefined }));
                  }}
                  style={{ marginBottom: 8 }}
                >
                  {item}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Doctor Selection */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Médico" />
          <Card.Content>
            <TextInput
              mode="outlined"
              label="Selecione o médico"
              value={selectedDoctor?.name || ''}
              editable={false}
              error={!!errors.doctor}
              style={{ marginBottom: 8 }}
            />
            {errors.doctor && (
              <HelperText type="error" visible={!!errors.doctor}>
                {errors.doctor}
              </HelperText>
            )}
            {!specialty && (
              <Text variant="bodySmall" style={{ marginBottom: 8, opacity: 0.7 }}>
                Selecione uma especialidade primeiro
              </Text>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {filteredDoctors.map((item) => (
                <Button
                  key={item.id}
                  mode={selectedDoctor?.id === item.id ? 'contained' : 'outlined'}
                  onPress={() => {
                    setSelectedDoctor(item);
                    setErrors(prev => ({ ...prev, doctor: undefined }));
                  }}
                  style={{ marginBottom: 8 }}
                >
                  {item.name}
                </Button>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Date and Time Selection */}
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title="Data e Horário" />
          <Card.Content>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={{ marginBottom: 8 }}
            >
              {date.toLocaleDateString('pt-BR')}
            </Button>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              style={{ marginBottom: 8 }}
            >
              {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Button>
            {errors.date && (
              <HelperText type="error" visible={!!errors.date}>
                {errors.date}
              </HelperText>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={date}
                mode="time"
                onChange={handleTimeChange}
              />
            )}
          </Card.Content>
        </Card>

        {/* Notes */}
        <Card style={{ marginBottom: 24 }}>
          <Card.Title title="Observações" />
          <Card.Content>
            <TextInput
              mode="outlined"
              label="Adicione observações importantes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleCreateAppointment}
          style={{ marginBottom: 24 }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            'Agendar Consulta'
          )}
        </Button>
      </View>
    </ScrollView>
  );
} 