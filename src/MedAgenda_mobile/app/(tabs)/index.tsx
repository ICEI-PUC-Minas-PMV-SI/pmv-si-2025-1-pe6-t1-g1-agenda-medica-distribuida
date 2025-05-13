import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { appointmentService } from '../../services/api';

type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
};

export default function AppointmentsScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError('Failed to load appointments');
      Alert.alert('Error', 'Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAppointments();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleCancelAppointment = async (id: string) => {
    try {
      await appointmentService.cancelAppointment(id);
      // Refresh the appointments list
      fetchAppointments();
      Alert.alert('Success', 'Appointment cancelled successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to cancel appointment. Please try again.');
    }
  };

  const renderAppointment = ({ item }: { item: Appointment }) => (
    <TouchableOpacity style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <Text style={styles.doctorName}>{item.doctorName}</Text>
        <Text style={[styles.status, styles[item.status]]}>{item.status}</Text>
      </View>
      <Text style={styles.specialty}>{item.specialty}</Text>
      <View style={styles.appointmentFooter}>
        <View style={styles.dateTimeContainer}>
          <MaterialIcons name="event" size={16} color="#666" />
          <Text style={styles.dateTime}>{item.date}</Text>
        </View>
        <View style={styles.dateTimeContainer}>
          <MaterialIcons name="access-time" size={16} color="#666" />
          <Text style={styles.dateTime}>{item.time}</Text>
        </View>
      </View>
      {item.status === 'scheduled' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            Alert.alert(
              'Cancel Appointment',
              'Are you sure you want to cancel this appointment?',
              [
                { text: 'No', style: 'cancel' },
                { text: 'Yes', onPress: () => handleCancelAppointment(item.id) },
              ]
            );
          }}
        >
          <MaterialIcons name="cancel" size={16} color="#c62828" />
          <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {error || 'No appointments scheduled'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTime: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scheduled: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  completed: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  cancelled: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
  },
  cancelButtonText: {
    marginLeft: 8,
    color: '#c62828',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
