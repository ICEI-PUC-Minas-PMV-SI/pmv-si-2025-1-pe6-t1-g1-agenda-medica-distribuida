import React from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Divider, Text, Portal, Dialog } from 'react-native-paper';
import { COLORS } from '../../constants/theme';
import { router, useLocalSearchParams } from 'expo-router';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Mock data - replace with API call
  const appointment: Appointment = {
    id: '1',
    doctor: 'Dr. Maria Silva',
    specialty: 'Cardiologia',
    date: '2024-03-25',
    time: '14:30',
    status: 'upcoming',
    notes: 'Trazer exames anteriores',
  };

  const getStatusLabel = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Agendada';
      case 'completed':
        return 'Realizada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming':
        return COLORS.primary;
      case 'completed':
        return COLORS.accent;
      case 'cancelled':
        return COLORS.error;
      default:
        return COLORS.text;
    }
  };

  const handleCancelAppointment = async () => {
    setLoading(true);
    try {
      // TODO: Implement cancellation logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Cancel appointment:', id);
      router.back();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    } finally {
      setLoading(false);
      setShowCancelDialog(false);
    }
  };

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
        <View style={{ padding: 16 }}>
          <Text variant="headlineMedium" style={{ marginBottom: 24 }}>
            Detalhes da Consulta
          </Text>

          {/* Status Card */}
          <Card style={{ marginBottom: 16 }}>
            <Card.Content>
              <Text variant="titleLarge" style={{ color: getStatusColor(appointment.status) }}>
                {getStatusLabel(appointment.status)}
              </Text>
            </Card.Content>
          </Card>

          {/* Appointment Details */}
          <Card style={{ marginBottom: 16 }}>
            <Card.Title title="Informações" />
            <Card.Content>
              <View style={{ marginBottom: 16 }}>
                <Text variant="titleMedium">Médico</Text>
                <Text variant="bodyLarge">{appointment.doctor}</Text>
              </View>
              <Divider style={{ marginVertical: 8 }} />
              <View style={{ marginBottom: 16 }}>
                <Text variant="titleMedium">Especialidade</Text>
                <Text variant="bodyLarge">{appointment.specialty}</Text>
              </View>
              <Divider style={{ marginVertical: 8 }} />
              <View style={{ marginBottom: 16 }}>
                <Text variant="titleMedium">Data e Horário</Text>
                <Text variant="bodyLarge">
                  {appointment.date} às {appointment.time}
                </Text>
              </View>
              {appointment.notes && (
                <>
                  <Divider style={{ marginVertical: 8 }} />
                  <View>
                    <Text variant="titleMedium">Observações</Text>
                    <Text variant="bodyLarge">{appointment.notes}</Text>
                  </View>
                </>
              )}
            </Card.Content>
          </Card>

          {/* Actions */}
          {appointment.status === 'upcoming' && (
            <View style={{ gap: 8 }}>
              <Button
                mode="contained"
                onPress={() => router.push({
                  pathname: '/appointments/new',
                  params: { id: appointment.id }
                })}
                style={{ marginBottom: 8 }}
              >
                Remarcar Consulta
              </Button>
              <Button
                mode="outlined"
                onPress={() => setShowCancelDialog(true)}
                textColor={COLORS.error}
                style={{ borderColor: COLORS.error }}
                disabled={loading}
              >
                Cancelar Consulta
              </Button>
            </View>
          )}
        </View>
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