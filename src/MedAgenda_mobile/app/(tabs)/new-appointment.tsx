import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, HelperText, TextInput, Text, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants/theme';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

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

  // Mock data - replace with API data
  const specialties = ['Cardiologia', 'Clínico Geral', 'Dermatologia', 'Ortopedia'];
  const doctors = [
    'Dr. Maria Silva',
    'Dr. João Santos',
    'Dra. Ana Oliveira',
    'Dr. Pedro Costa'
  ];

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
      // TODO: Implement appointment creation logic
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Create appointment:', {
        specialty,
        doctor,
        date,
        notes,
      });
      
      router.back();
    } catch (error) {
      console.error('Error creating appointment:', error);
      // TODO: Show error message to user
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
              value={doctor}
              onChangeText={(value) => {
                setDoctor(value);
                setErrors(prev => ({ ...prev, doctor: undefined }));
              }}
              error={!!errors.doctor}
              style={{ marginBottom: 8 }}
            />
            {errors.doctor && (
              <HelperText type="error" visible={!!errors.doctor}>
                {errors.doctor}
              </HelperText>
            )}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {doctors.map((item) => (
                <Button
                  key={item}
                  mode={doctor === item ? 'contained' : 'outlined'}
                  onPress={() => {
                    setDoctor(item);
                    setErrors(prev => ({ ...prev, doctor: undefined }));
                  }}
                  style={{ marginBottom: 8 }}
                >
                  {item}
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