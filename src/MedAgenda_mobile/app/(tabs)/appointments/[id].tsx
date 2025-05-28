import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';
import { appointments, doctors } from '../../../services/api';
import { Appointment, Doctor } from '../../../services/api';
import { ScrollView as ScrollViewRN } from 'react-native';
import { Text as TextRN } from 'react-native';
import { Button as ButtonRN } from 'react-native';
import { Card as CardRN } from 'react-native';
import { Divider } from 'react-native-paper';
import { Portal, Dialog } from 'react-native-paper';
import { COLORS } from '../../constants/theme';

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  useEffect(() => {
    loadAppointmentDetails();
  }, [id]);

  const loadAppointmentDetails = async () => {
    try {
      setLoading(true);
      const appointmentData = await appointments.getById(id as string);
      setAppointment(appointmentData);

      if (appointmentData.doctorId) {
        const doctorData = await doctors.getById(appointmentData.doctorId);
        setDoctor(doctorData);
      }
    } catch (err) {
      setError('Erro ao carregar detalhes da consulta');
      console.error('Error loading appointment details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      setLoading(true);
      await appointments.update(id as string, { status: 'cancelled' });
      router.back();
    } catch (err) {
      setError('Erro ao cancelar consulta');
      console.error('Error cancelling appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !appointment) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error || 'Consulta não encontrada'}</Text>
        <Button mode="contained" onPress={loadAppointmentDetails} style={styles.retryButton}>
          Tentar novamente
        </Button>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.title}>
              Detalhes da Consulta
            </Text>

            <View style={styles.section}>
              <Text variant="titleMedium">Informações do Médico</Text>
              {doctor ? (
                <>
                  <Text variant="bodyMedium">Nome: {doctor.name}</Text>
                  <Text variant="bodyMedium">Especialidade: {doctor.specialty}</Text>
                  <Text variant="bodyMedium">Email: {doctor.email}</Text>
                  <Text variant="bodyMedium">Telefone: {doctor.phone}</Text>
                </>
              ) : (
                <Text variant="bodyMedium">Médico não encontrado</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text variant="titleMedium">Informações da Consulta</Text>
              <Text variant="bodyMedium">Data: {appointment.date}</Text>
              <Text variant="bodyMedium">Horário: {appointment.time}</Text>
              <Text variant="bodyMedium">
                Status:{' '}
                <Text style={{ color: getStatusColor(appointment.status) }}>
                  {getStatusText(appointment.status)}
                </Text>
              </Text>
              {appointment.notes && (
                <Text variant="bodyMedium">Observações: {appointment.notes}</Text>
              )}
            </View>

            {appointment.status === 'scheduled' && (
              <Button
                mode="contained"
                onPress={() => setShowCancelDialog(true)}
                style={styles.cancelButton}
                buttonColor="#F44336"
              >
                Cancelar Consulta
              </Button>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Cancel Confirmation Dialog */}
      <Portal>
        <Dialog visible={showCancelDialog} onDismiss={() => setShowCancelDialog(false)}>
          <Dialog.Title>Cancelar Consulta</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowCancelDialog(false)}>Não</Button>
            <Button
              onPress={handleCancelAppointment}
              textColor={COLORS.error}
              loading={loading}
            >
              Sim, Cancelar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  title: {
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  cancelButton: {
    marginTop: 16,
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