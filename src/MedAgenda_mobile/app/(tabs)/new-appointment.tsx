import { useState, useEffect } from 'react';
import { ScrollView, View, Alert, StyleSheet } from 'react-native';
import { Button, Card, HelperText, TextInput, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { COLORS } from '../../constants/theme';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { doctors, appointments } from '../../services/api';
import { AppointmentType, Doctor } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DoctorImage from '../../components/DoctorImage';

interface FormErrors {
  specialty?: string;
  doctor?: string;
  date?: string;
}

export default function NewAppointmentScreen() {
  const { user } = useAuth();
  const [specialty, setSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Data from API
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter doctors by specialty
    if (specialty) {
      const filtered = doctorsList.filter(doc => 
        doc.specialty?.toLowerCase() === specialty.toLowerCase()
      );
      setFilteredDoctors(filtered);
    } else {
      setFilteredDoctors([]);
    }
    setSelectedDoctor(null); // Reset doctor selection when specialty changes
  }, [specialty, doctorsList]);

  const loadData = async () => {
    try {
      setLoadingData(true);
      setErrorMessage('');
      
      console.log('Loading doctors and specialties...');
      
      // Load doctors and specialties
      const doctorsData = await doctors.getAll();
      const specialtiesData = await doctors.getSpecialties();
      
      console.log('Doctors loaded:', doctorsData.length);
      console.log('Specialties loaded:', specialtiesData);
      
      setDoctorsList(doctorsData);
      setSpecialties(specialtiesData);
      
    } catch (error: any) {
      console.error('Error loading data:', error);
      setErrorMessage(`Erro ao carregar dados: ${error.message || 'Tente novamente.'}`);
      setShowError(true);
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
    const selectedDateTime = new Date(date);
    if (selectedDateTime <= now) {
      newErrors.date = 'A data e horário devem ser no futuro';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAppointment = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não autenticado. Faça login novamente.');
      return;
    }

    setLoading(true);
    try {
      // Prepare appointment data
      const appointmentData = {
        userId: user.id,
        doctorId: selectedDoctor!.id,
        date: date.toISOString().split('T')[0], // YYYY-MM-DD format
        time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }), // HH:MM format
        type: 'consultation' as AppointmentType,
        notes: notes,
      };

      console.log('Creating appointment with data:', appointmentData);
      
      // Call API to create appointment
      const result = await appointments.create(appointmentData);
      console.log('Appointment created successfully:', result);
      
      Alert.alert(
        'Sucesso!', 
        'Consulta agendada com sucesso!',
        [
          {
            text: 'OK',
            onPress: () => {
              try {
                router.back();
              } catch (error) {
                // If back navigation fails, go to appointments tab
                router.replace('/(tabs)/appointments');
              }
            }
          }
        ]
      );
      
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      const errorMessage = error.message || 'Erro ao agendar consulta. Tente novamente.';
      setErrorMessage(errorMessage);
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

  if (loadingData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 16, color: COLORS.textSecondary }}>Carregando especialidades e médicos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ padding: 16 }}>
        <Text variant="headlineMedium" style={{ marginBottom: 24, color: COLORS.textPrimary }}>
          Nova Consulta
        </Text>

        {/* Specialty Selection */}
        <Card style={{ marginBottom: 16, backgroundColor: COLORS.surface }}>
          <Card.Title title="Especialidade" titleStyle={{ color: COLORS.textPrimary }} />
          <Card.Content>
            {specialties.length === 0 ? (
              <View style={{ padding: 16, alignItems: 'center' }}>
                <Text style={{ color: COLORS.textSecondary, textAlign: 'center' }}>
                  Nenhuma especialidade encontrada.
                </Text>
                <Button 
                  mode="outlined" 
                  onPress={loadData}
                  style={{ marginTop: 8 }}
                >
                  Tentar novamente
                </Button>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {specialties.map((item) => (
                  <Button
                    key={item}
                    mode={specialty === item ? 'contained' : 'outlined'}
                    onPress={() => {
                      setSpecialty(item);
                      setSelectedDoctor(null);
                      setErrors(prev => ({ ...prev, specialty: undefined }));
                    }}
                    style={{ marginBottom: 8 }}
                  >
                    {item}
                  </Button>
                ))}
              </View>
            )}
            {errors.specialty && (
              <HelperText type="error" visible={!!errors.specialty}>
                {errors.specialty}
              </HelperText>
            )}
          </Card.Content>
        </Card>

        {/* Doctor Selection */}
        <Card style={{ marginBottom: 16, backgroundColor: COLORS.surface }}>
          <Card.Title title="Médico" titleStyle={{ color: COLORS.textPrimary }} />
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
              <Text variant="bodySmall" style={{ marginBottom: 8, opacity: 0.7, color: COLORS.textSecondary }}>
                Selecione uma especialidade primeiro
              </Text>
            )}
            {specialty && filteredDoctors.length === 0 && (
              <Text variant="bodySmall" style={{ marginBottom: 8, color: COLORS.textSecondary }}>
                Nenhum médico encontrado para esta especialidade
              </Text>
            )}
            <View style={{ gap: 12 }}>
              {filteredDoctors.map((item, index) => {
                const isSelected = selectedDoctor?.id === item.id;
                
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.doctorCard,
                      isSelected && styles.doctorCardSelected
                    ]}
                  >
                    <Button
                      mode={isSelected ? 'contained' : 'outlined'}
                      onPress={() => {
                        setSelectedDoctor(item);
                        setErrors(prev => ({ ...prev, doctor: undefined }));
                      }}
                      style={[
                        styles.doctorButton,
                        isSelected && styles.doctorButtonSelected
                      ]}
                      contentStyle={styles.doctorButtonContent}
                    >
                      <View style={styles.doctorInfo}>
                        <DoctorImage
                          imageUrl={item.image}
                          doctorName={item.name}
                          size={60}
                          index={index}
                        />
                        <View style={styles.doctorTextInfo}>
                          <Text 
                            variant="titleMedium" 
                            style={[
                              styles.doctorName,
                              isSelected && styles.doctorNameSelected
                            ]}
                          >
                            Dr. {item.name}
                          </Text>
                          {item.crm && (
                            <Text 
                              variant="bodySmall" 
                              style={[
                                styles.doctorCrm,
                                isSelected && styles.doctorCrmSelected
                              ]}
                            >
                              CRM: {item.crm}
                            </Text>
                          )}
                          {item.experience && (
                            <Text 
                              variant="bodySmall" 
                              style={[
                                styles.doctorExperience,
                                isSelected && styles.doctorExperienceSelected
                              ]}
                            >
                              {item.experience}
                            </Text>
                          )}
                        </View>
                      </View>
                    </Button>
                  </View>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* Date and Time Selection */}
        <Card style={{ marginBottom: 16, backgroundColor: COLORS.surface }}>
          <Card.Title title="Data e Horário" titleStyle={{ color: COLORS.textPrimary }} />
          <Card.Content>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={{ marginBottom: 8 }}
            >
              📅 {date.toLocaleDateString('pt-BR')}
            </Button>
            <Button
              mode="outlined"
              onPress={() => setShowTimePicker(true)}
              style={{ marginBottom: 8 }}
            >
              🕐 {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
        <Card style={{ marginBottom: 24, backgroundColor: COLORS.surface }}>
          <Card.Title title="Observações" titleStyle={{ color: COLORS.textPrimary }} />
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
          style={{ marginBottom: 24, backgroundColor: COLORS.primary }}
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

const styles = StyleSheet.create({
  doctorCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  doctorCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  doctorButton: {
    borderRadius: 12,
    marginBottom: 0,
  },
  doctorButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  doctorButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'flex-start',
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  doctorTextInfo: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 12,
  },
  doctorName: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  doctorNameSelected: {
    color: COLORS.white,
  },
  doctorCrm: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  doctorCrmSelected: {
    color: COLORS.white,
    opacity: 0.9,
  },
  doctorExperience: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  doctorExperienceSelected: {
    color: COLORS.white,
    opacity: 0.9,
  },
}); 