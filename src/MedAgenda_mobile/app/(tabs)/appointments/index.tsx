import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, Card, Chip, FAB, Searchbar, SegmentedButtons, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { appointments } from '../../../services/api';
import { Appointment, AppointmentStatus } from '../../../types/api';
import { COLORS } from '../../../constants/theme';

export default function AppointmentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'all'>('all');
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await appointments.getAll(filterStatus === 'all' ? undefined : filterStatus);
      setAppointmentsList(data);
    } catch (err) {
      const message = 'Erro ao carregar consultas';
      setError(message);
      setShowError(true);
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: AppointmentStatus | 'all') => {
    setFilterStatus(status);
    try {
      setLoading(true);
      const data = await appointments.getAll(status === 'all' ? undefined : status);
      setAppointmentsList(data);
    } catch (err) {
      const message = 'Erro ao filtrar consultas';
      setError(message);
      setShowError(true);
      console.error('Error filtering appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      await appointments.cancel(id);
      loadAppointments();
    } catch (err) {
      const message = 'Erro ao cancelar consulta';
      setError(message);
      setShowError(true);
      console.error('Error canceling appointment:', err);
    }
  };

  const filteredAppointments = appointmentsList.filter((appointment) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      appointment.doctor?.name.toLowerCase().includes(searchLower) ||
      appointment.doctor?.specialty.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return COLORS.warning;
      case AppointmentStatus.CONFIRMED:
        return COLORS.primary;
      case AppointmentStatus.COMPLETED:
        return COLORS.success;
      case AppointmentStatus.CANCELLED:
        return COLORS.error;
      default:
        return COLORS.disabled;
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'Pendente';
      case AppointmentStatus.CONFIRMED:
        return 'Confirmada';
      case AppointmentStatus.COMPLETED:
        return 'Realizada';
      case AppointmentStatus.CANCELLED:
        return 'Cancelada';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Search and Filters */}
        <View style={styles.filtersContainer}>
          <Searchbar
            placeholder="Buscar por médico ou especialidade..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          <SegmentedButtons
            value={filterStatus}
            onValueChange={handleStatusChange}
            buttons={[
              { value: 'all', label: 'Todas' },
              { value: AppointmentStatus.CONFIRMED, label: 'Confirmadas' },
              { value: AppointmentStatus.COMPLETED, label: 'Realizadas' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsList}>
          {filteredAppointments.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma consulta encontrada</Text>
          ) : (
            filteredAppointments.map((appointment) => (
              <Card
                key={appointment.id}
                style={styles.card}
                onPress={() => {
                  router.push({
                    pathname: '/(tabs)/appointments/[id]',
                    params: { id: appointment.id }
                  });
                }}
              >
                <Card.Content>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text variant="titleMedium">{appointment.doctor?.name}</Text>
                      <Text variant="bodyMedium">{appointment.doctor?.specialty}</Text>
                    </View>
                    <Chip
                      mode="flat"
                      textStyle={{ color: 'white' }}
                      style={{ backgroundColor: getStatusColor(appointment.status) }}
                    >
                      {getStatusText(appointment.status)}
                    </Chip>
                  </View>
                  
                  <View style={styles.appointmentInfo}>
                    <Text variant="bodyMedium">Data: {new Date(appointment.date).toLocaleDateString('pt-BR')}</Text>
                    <Text variant="bodyMedium">Horário: {appointment.time}</Text>
                  </View>

                  {appointment.status === AppointmentStatus.CONFIRMED && (
                    <Button
                      mode="outlined"
                      onPress={() => handleCancelAppointment(appointment.id)}
                      style={styles.cancelButton}
                      textColor={COLORS.error}
                    >
                      Cancelar Consulta
                    </Button>
                  )}
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB for new appointment */}
      <FAB
        icon="plus"
        label="Nova Consulta"
        style={styles.fab}
        onPress={() => {
          router.push('/(tabs)/new-appointment');
        }}
      />

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        action={{
          label: 'OK',
          onPress: () => setShowError(false),
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersContainer: {
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  appointmentsList: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  appointmentInfo: {
    marginVertical: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: COLORS.disabled,
  },
}); 