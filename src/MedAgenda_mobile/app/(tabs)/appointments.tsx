import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { 
  Card, 
  Text, 
  ActivityIndicator, 
  Snackbar, 
  FAB, 
  Chip,
  Portal,
  Dialog,
  Button
} from 'react-native-paper';
import { router } from 'expo-router';
import { appointments } from '../../services/api';
import { Appointment, AppointmentStatus } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';
import DoctorImage from '../../components/DoctorImage';

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | 'all'>('all');
  const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  const loadAppointments = async () => {
    if (!user?.id) {
      console.log('User ID not available, skipping appointment load');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Loading appointments for user:', user.id);
      const data = await appointments.getByUserId(user.id);
      console.log('Appointments loaded:', data.length);
      console.log('Appointments data:', data);
      
      // Log each appointment to check doctor data
      data.forEach((appointment, index) => {
        console.log(`Appointment ${index + 1}:`, {
          id: appointment.id,
          doctorId: appointment.doctorId,
          doctorObject: appointment.doctor,
          doctorName: appointment.doctor?.name,
          doctorSpecialty: appointment.doctor?.specialty,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status
        });
        
        // Log the complete doctor object structure
        if (appointment.doctor) {
          console.log(`Appointments - Doctor object for appointment ${index + 1}:`, appointment.doctor);
        } else {
          console.log(`Appointments - No doctor object for appointment ${index + 1}, doctorId:`, appointment.doctorId);
        }
      });
      
      setAppointmentsList(data || []);
    } catch (error: any) {
      console.error('Error loading appointments:', error);
      const errorMessage = error?.message || 'Erro desconhecido ao carregar consultas';
      setSnackbarMessage(`Erro ao carregar consultas: ${errorMessage}`);
      setSnackbarVisible(true);
      // Set empty array on error to avoid undefined state
      setAppointmentsList([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAppointments();
  }, [user?.id]);

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      await appointments.cancel(appointmentToCancel);
      setSnackbarMessage('Consulta cancelada com sucesso');
      setSnackbarVisible(true);
      await loadAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setSnackbarMessage('Erro ao cancelar consulta');
      setSnackbarVisible(true);
    } finally {
      setCancelDialogVisible(false);
      setAppointmentToCancel(null);
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return COLORS.warning;
      case 'confirmed':
      case 'scheduled':
        return COLORS.primary;
      case 'completed':
        return COLORS.success;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.gray;
    }
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmada';
      case 'scheduled':
        return 'Agendada';
      case 'completed':
        return 'Realizada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const filteredAppointments = appointmentsList.filter(appointment => 
    selectedStatus === 'all' || appointment.status === selectedStatus
  );

  const statusFilters = [
    { value: 'all' as const, label: 'Todas' },
    { value: 'scheduled' as AppointmentStatus, label: 'Agendadas' },
    { value: 'completed' as AppointmentStatus, label: 'Realizadas' },
    { value: 'cancelled' as AppointmentStatus, label: 'Canceladas' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando consultas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Status Filters */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {statusFilters.map((filter) => (
              <Chip
                key={filter.value}
                selected={selectedStatus === filter.value}
                onPress={() => setSelectedStatus(filter.value)}
                style={styles.filterChip}
                textStyle={styles.filterChipText}
              >
                {filter.label}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {selectedStatus === 'all' 
                ? 'Nenhuma consulta encontrada' 
                : `Nenhuma consulta ${getStatusLabel(selectedStatus as AppointmentStatus).toLowerCase()} encontrada`
              }
            </Text>
          </View>
        ) : (
          filteredAppointments.map((appointment, index) => {
            return (
              <Card key={appointment.id} style={styles.appointmentCard}>
                <Card.Content>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.doctorSection}>
                      <DoctorImage
                        imageUrl={appointment.doctor?.image}
                        doctorName={appointment.doctor?.name}
                        size={50}
                        index={index}
                      />
                      <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>
                          Dr. {appointment.doctor?.name || 'Médico não informado'}
                        </Text>
                        <Text style={styles.specialty}>
                          {appointment.doctor?.specialty || 'Especialidade não informada'}
                        </Text>
                      </View>
                    </View>
                    <Chip
                      style={[styles.statusChip, { backgroundColor: getStatusColor(appointment.status) }]}
                      textStyle={styles.statusChipText}
                    >
                      {getStatusLabel(appointment.status)}
                    </Chip>
                  </View>
                  
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.dateTime}>
                      📅 {appointment.date} às {appointment.time}
                    </Text>
                    {appointment.doctor?.address && (
                      <Text style={styles.location}>
                        📍 {appointment.doctor.address.line1}
                      </Text>
                    )}
                    {appointment.amount && (
                      <Text style={styles.amount}>
                        💰 R$ {appointment.amount.toFixed(2)}
                      </Text>
                    )}
                  </View>

                  {appointment.status === 'scheduled' && (
                    <View style={styles.actionsContainer}>
                      <Button
                        mode="outlined"
                        onPress={() => {
                          setAppointmentToCancel(appointment.id);
                          setCancelDialogVisible(true);
                        }}
                        style={styles.cancelButton}
                        textColor={COLORS.error}
                      >
                        Cancelar
                      </Button>
                    </View>
                  )}
                </Card.Content>
              </Card>
            );
          })
        )}
      </ScrollView>

      {/* FAB for new appointment */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(tabs)/new-appointment')}
      />

      {/* Cancel Confirmation Dialog */}
      <Portal>
        <Dialog visible={cancelDialogVisible} onDismiss={() => setCancelDialogVisible(false)}>
          <Dialog.Title>Cancelar Consulta</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja cancelar esta consulta?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCancelDialogVisible(false)}>Não</Button>
            <Button onPress={handleCancelAppointment} textColor={COLORS.error}>
              Sim, Cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Snackbar */}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  filtersContainer: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  filterChip: {
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
  appointmentCard: {
    margin: 16,
    marginTop: 8,
    backgroundColor: COLORS.surface,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    color: COLORS.surface,
    fontSize: 12,
    fontWeight: 'bold',
  },
  specialty: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 8,
  },
  appointmentDetails: {
    marginBottom: 12,
  },
  dateTime: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  amount: {
    fontSize: 14,
    color: COLORS.success,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    borderColor: COLORS.error,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
}); 