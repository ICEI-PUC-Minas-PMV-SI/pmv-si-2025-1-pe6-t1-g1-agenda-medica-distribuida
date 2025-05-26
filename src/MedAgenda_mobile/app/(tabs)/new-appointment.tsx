import { useState, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, HelperText, TextInput, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { COLORS } from '../../constants/theme';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { appointments, doctors as doctorsApi } from '../../services/api';
import { AppointmentType } from '../../types/api';

interface FormErrors {
  specialty?: string;
  doctor?: string;
  date?: string;
}

export default function NewAppointmentScreen() {
  const [specialty, setSpecialty] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadSpecialties();
  }, []);

  useEffect(() => {
    if (specialty) {
      loadDoctors(specialty);
    }
  }, [specialty]);

  const loadSpecialties = async () => {
    try {
      const data = await doctorsApi.getSpecialties();
      setSpecialties(data);
    } catch (error) {
      console.error('Error loading specialties:', error);
      setErrorMessage('Erro ao carregar especialidades');
      setShowError(true);
    }
  };

  const loadDoctors = async (specialty: string) => {
    try {
      const data = await doctorsApi.getAll(specialty);
      setDoctors(data);
    } catch (error) {
      console.error('Error loading doctors:', error);
      setErrorMessage('Erro ao carregar médicos');
      setShowError(true);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!specialty) {
      newErrors.specialty = 'Selecione uma especialidade';
    }

    if (!doctor) {
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
      await appointments.create({
        doctorId: doctor,
        date: date.toISOString().split('T')[0],
        time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: AppointmentType.CONSULTATION,
        notes,
      });
      
      router.push('/(tabs)/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      setErrorMessage('Erro ao criar consulta');
      setShowError(true);
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
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {specialties.map((item) => (
                <Button
                  key={item}
                  mode={specialty === item ? 'contained' : 'outlined'}
                  onPress={() => {
                    setSpecialty(item);
                    setDoctor('');
                    setErrors(prev => ({ ...prev, specialty: undefined }));
                  }}
                  style={{ marginBottom: 8 }}
                >
                  {item}
                </Button>
              ))}
            </View>
            {errors.specialty && (
              <HelperText type="error" visible={!!errors.specialty}>
                {errors.specialty}
              </HelperText>
            )}
          </Card.Content>
        </Card>

        {/* Doctor Selection */}
        {specialty && (
          <Card style={{ marginBottom: 16 }}>
            <Card.Title title="Médico" />
            <Card.Content>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {doctors.map((item) => (
                  <Button
                    key={item.id}
                    mode={doctor === item.id ? 'contained' : 'outlined'}
                    onPress={() => {
                      setDoctor(item.id);
                      setErrors(prev => ({ ...prev, doctor: undefined }));
                    }}
                    style={{ marginBottom: 8 }}
                  >
                    {item.name}
                  </Button>
                ))}
              </View>
              {errors.doctor && (
                <HelperText type="error" visible={!!errors.doctor}>
                  {errors.doctor}
                </HelperText>
              )}
            </Card.Content>
          </Card>
        )}

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

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        action={{
          label: 'OK',
          onPress: () => setShowError(false),
        }}
      >
        {errorMessage}
      </Snackbar>
    </ScrollView>
  );
} 