import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button, Card, Chip, FAB, Searchbar, SegmentedButtons, Text } from 'react-native-paper';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appointments } from '../../../services/api';
import { Appointment } from '../../../types/api';
import { useAuth } from '../../../context/AuthContext';

export default function AppointmentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('upcoming');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [appointmentsList, setAppointmentsList] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      console.error('Error loading appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointmentsList.filter((appointment) => {
    const matchesSearch = appointment.doctorId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#2196F3';
      case 'completed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando consultas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button mode="contained" onPress={loadAppointments} style={styles.retryButton}>
          Tentar novamente
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Search and Filters */}
        <View style={styles.filtersContainer}>
          <Searchbar
            placeholder="Buscar consultas..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          <SegmentedButtons
            value={filterStatus}
            onValueChange={setFilterStatus}
            buttons={[
              { value: 'all', label: 'Todas' },
              { value: 'scheduled', label: 'Agendadas' },
              { value: 'completed', label: 'Realizadas' },
            ]}
            style={styles.segmentedButtons}
          />
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsList}>
          {filteredAppointments.map((appointment) => (
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
                <Text variant="titleMedium">Consulta #{appointment.id}</Text>
                <Text variant="bodyMedium">Data: {appointment.date}</Text>
                <Text variant="bodyMedium">Horário: {appointment.time}</Text>
                <View style={styles.statusContainer}>
                  <Text
                    variant="bodySmall"
                    style={[styles.statusText, { color: getStatusColor(appointment.status) }]}
                  >
                    {getStatusText(appointment.status)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  statusContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusText: {
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginHorizontal: 16,
  },
}); 