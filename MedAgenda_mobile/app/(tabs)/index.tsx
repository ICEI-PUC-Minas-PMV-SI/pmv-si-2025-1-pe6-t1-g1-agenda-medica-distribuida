import { ScrollView, View } from 'react-native';
import { Avatar, Button, Card, Divider, List, Text } from 'react-native-paper';
import { COLORS } from '../constants/theme';
import { router } from 'expo-router';

export default function HomeScreen() {
  // Mock data - replace with actual data from your API
  const upcomingAppointments = [
    {
      id: '1',
      doctor: 'Dr. Maria Silva',
      specialty: 'Cardiologia',
      date: '2024-03-25',
      time: '14:30',
    },
    {
      id: '2',
      doctor: 'Dr. João Santos',
      specialty: 'Clínico Geral',
      date: '2024-03-27',
      time: '10:00',
    },
  ];

  const notifications = [
    {
      id: '1',
      title: 'Lembrete de Consulta',
      description: 'Sua consulta com Dr. Maria Silva é amanhã às 14:30',
      time: '1h atrás',
    },
    {
      id: '2',
      title: 'Nova Mensagem',
      description: 'Dr. João Santos enviou um resultado de exame',
      time: '2h atrás',
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Welcome Section */}
      <View style={{ padding: 16, backgroundColor: COLORS.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Avatar.Text size={48} label="JS" style={{ backgroundColor: COLORS.accent }} />
          <View style={{ marginLeft: 12 }}>
            <Text variant="titleMedium" style={{ color: 'white' }}>Bem-vindo(a),</Text>
            <Text variant="headlineSmall" style={{ color: 'white' }}>João Silva</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          mode="contained"
          icon="calendar-plus"
          onPress={() => router.push('/(tabs)/appointments')}
          style={{ flex: 1, marginRight: 8 }}
        >
          Nova Consulta
        </Button>
        <Button
          mode="contained-tonal"
          icon="history"
          onPress={() => router.push('/(tabs)/appointments')}
          style={{ flex: 1, marginLeft: 8 }}
        >
          Histórico
        </Button>
      </View>

      {/* Upcoming Appointments */}
      <Card style={{ margin: 16 }}>
        <Card.Title title="Próximas Consultas" />
        <Card.Content>
          {upcomingAppointments.map((appointment) => (
            <View key={appointment.id} style={{ marginBottom: 12 }}>
              <Text variant="titleMedium">{appointment.doctor}</Text>
              <Text variant="bodyMedium">{appointment.specialty}</Text>
              <Text variant="bodySmall" style={{ color: COLORS.primary }}>
                {appointment.date} às {appointment.time}
              </Text>
              {appointment.id !== upcomingAppointments[upcomingAppointments.length - 1].id && (
                <Divider style={{ marginTop: 8 }} />
              )}
            </View>
          ))}
        </Card.Content>
        <Card.Actions>
          <Button onPress={() => router.push('/(tabs)/appointments')}>Ver Todas</Button>
        </Card.Actions>
      </Card>

      {/* Notifications */}
      <Card style={{ margin: 16 }}>
        <Card.Title title="Notificações" />
        <Card.Content>
          {notifications.map((notification) => (
            <List.Item
              key={notification.id}
              title={notification.title}
              description={notification.description}
              right={() => <Text variant="bodySmall">{notification.time}</Text>}
              style={{ marginBottom: 8 }}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
} 