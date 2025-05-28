import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { Button, Card, Chip, FAB, Searchbar, SegmentedButtons, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appointments } from '../../../services/api';
import { Appointment, AppointmentStatus } from '../../../types/api';
import { COLORS } from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';

export default function AppointmentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'all'>('all');
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Extrair userId do token armazenado
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
      
      const data = await appointments.getAll(userId);
      setAppointmentsList(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar consultas';
      setError(errorMessage);
      setShowError(true);
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (status: AppointmentStatus | 'all') => {
    setFilterStatus(status);
    // For now, just filter locally since the backend might not support status filtering
    // In the future, this could make a new API call with status filter
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      Alert.alert(
        'Cancelar Consulta',
        'Tem certeza que deseja cancelar esta consulta?',
        [
          { text: 'Não', style: 'cancel' },
          {
            text: 'Sim',
            style: 'destructive',
            onPress: async () => {
              try {
                await appointments.cancel(id);
                loadAppointments();
              } catch (err) {
                const message = 'Erro ao cancelar consulta';
                setError(message);
                setShowError(true);
                console.error('Error canceling appointment:', err);
              }
            }
          }
        ]
      );
    } catch (err) {
      console.error('Error in cancel appointment:', err);
    }
  };

  const filteredAppointments = appointmentsList.filter((appointment) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = appointment.doctorId?.toLowerCase().includes(searchLower) || 
                         appointment.notes?.toLowerCase().includes(searchLower) ||
                         false;
    
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return COLORS.warning || '#FFC107';
      case AppointmentStatus.CONFIRMED:
      case AppointmentStatus.SCHEDULED:
        return COLORS.primary || '#2196F3';
      case AppointmentStatus.COMPLETED:
        return COLORS.success || '#4CAF50';
      case AppointmentStatus.CANCELLED:
        return COLORS.error || '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.PENDING:
        return 'Pendente';
      case AppointmentStatus.CONFIRMED:
        return 'Confirmada';
      case AppointmentStatus.SCHEDULED:
        return 'Agendada';
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
        <Text style={{ marginTop: 16 }}>Carregando consultas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Search Bar */}
        <Searchbar
          placeholder="Buscar consultas..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {/* Status Filter */}
        <SegmentedButtons
          value={filterStatus}
          onValueChange={handleStatusChange}
          buttons={[
            { value: 'all', label: 'Todas' },
            { value: AppointmentStatus.SCHEDULED, label: 'Agendadas' },
            { value: AppointmentStatus.COMPLETED, label: 'Realizadas' },
            { value: AppointmentStatus.CANCELLED, label: 'Canceladas' },
          ]}
          style={styles.segmentedButtons}
        />

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>
              {appointmentsList.length === 0 
                ? 'Você não tem consultas agendadas' 
                : 'Nenhuma consulta encontrada com os filtros aplicados'
              }
            </Text>
            <Button 
              mode="contained" 
              onPress={() => router.push('/(tabs)/new-appointment')}
              style={styles.newAppointmentButton}
            >
              Agendar Nova Consulta
            </Button>
          </View>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment.id} style={styles.appointmentCard}>
              <Card.Content>
                <View style={styles.appointmentHeader}>
                  <Text variant="titleMedium">
                    Médico: {appointment.doctorId}
                  </Text>
                  <Chip 
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                    textStyle={{ color: 'white' }}
                  >
                    {getStatusText(appointment.status)}
                  </Chip>
                </View>
                
                <Text variant="bodyMedium" style={styles.appointmentDate}>
                  📅 {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                </Text>
                
                {appointment.notes && (
                  <Text variant="bodySmall" style={styles.appointmentNotes}>
                    📝 {appointment.notes}
                  </Text>
                )}
              </Card.Content>
              
              <Card.Actions>
                {appointment.status === AppointmentStatus.SCHEDULED && (
                  <Button 
                    mode="outlined" 
                    onPress={() => handleCancelAppointment(appointment.id)}
                    textColor={COLORS.error}
                  >
                    Cancelar
                  </Button>
                )}
                <Button mode="text">
                  Detalhes
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(tabs)/new-appointment')}
      />

      {/* Error Snackbar */}
      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        action={{
          label: 'Tentar novamente',
          onPress: loadAppointments,
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
    backgroundColor: COLORS.background || '#f5f5f5',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchbar: {
    margin: 16,
  },
  segmentedButtons: {
    margin: 16,
  },
  appointmentCard: {
    margin: 16,
    marginTop: 8,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentDate: {
    marginBottom: 4,
  },
  appointmentNotes: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 16,
    opacity: 0.7,
  },
  newAppointmentButton: {
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
  },
}); 