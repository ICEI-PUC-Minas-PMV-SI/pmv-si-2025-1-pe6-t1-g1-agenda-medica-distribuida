import { ScrollView, View } from 'react-native';
import { Avatar, Button, Card, Divider, List, Text, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../constants/theme';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { appointments } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Usar diretamente o nome do usuário do contexto, com fallback para "Usuário"
  const displayName = user?.name || 'Usuário';

  useEffect(() => {
    if (user?.id) {
      loadUserAppointments();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const loadUserAppointments = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('Loading appointments for user:', user.id);
      
      // Usar a API do serviço que já está configurada corretamente
      const userAppointments = await appointments.getByUserId(user.id);
      
      console.log('Raw appointments from API:', userAppointments);
      
      // Filtrar apenas agendamentos futuros e ordenar por data
      const now = new Date();
      const futureAppointments = userAppointments
        .filter((appointment) => {
          const appointmentDate = new Date(appointment.date);
          return appointmentDate >= now && appointment.status !== 'cancelled';
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3); // Mostrar apenas os próximos 3

      console.log('Filtered future appointments:', futureAppointments);

      // Transformar para o formato esperado pela UI
      const appointmentsForUI = futureAppointments.map((appointment) => ({
        id: appointment.id,
        doctor: appointment.doctor?.name || 'Médico não informado',
        specialty: appointment.doctor?.specialty || 'Especialidade não informada',
        date: new Date(appointment.date).toLocaleDateString('pt-BR'),
        time: appointment.time,
      }));

      console.log('Final appointments for UI:', appointmentsForUI);
      setUpcomingAppointments(appointmentsForUI);
      
    } catch (err: any) {
      console.error('Error loading appointments:', err);
      setError('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  const notifications = [
    {
      id: '1',
      title: 'Bem-vindo ao MedAgenda!',
      description: 'Gerencie suas consultas médicas de forma fácil e prática',
      time: 'Agora',
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Welcome Section */}
      <View style={{ padding: 16, backgroundColor: COLORS.headerBackground }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Avatar.Text 
            size={48} 
            label={displayName !== 'Usuário' ? displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'} 
            style={{ backgroundColor: COLORS.secondary }} 
          />
          <View style={{ marginLeft: 12 }}>
            <Text variant="titleMedium" style={{ color: 'white' }}>Bem-vindo(a),</Text>
            <Text variant="headlineSmall" style={{ color: 'white' }}>{displayName}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          mode="contained"
          icon="calendar-plus"
          onPress={() => router.push('/(tabs)/new-appointment')}
          style={{ flex: 1, marginRight: 8, backgroundColor: COLORS.primary }}
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
      <Card style={{ margin: 16, backgroundColor: COLORS.cardBackground }}>
        <Card.Title 
          title="Próximas Consultas" 
          right={() => loading ? <ActivityIndicator size="small" /> : null}
        />
        <Card.Content>
          {loading ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={{ marginTop: 8 }}>Carregando agendamentos...</Text>
            </View>
          ) : error ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ color: COLORS.error, textAlign: 'center' }}>{error}</Text>
              <Button mode="outlined" onPress={loadUserAppointments} style={{ marginTop: 8 }}>
                Tentar novamente
              </Button>
            </View>
          ) : upcomingAppointments.length === 0 ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ textAlign: 'center', opacity: 0.7 }}>
                Você não tem consultas agendadas
              </Text>
              <Button 
                mode="contained" 
                onPress={() => router.push('/(tabs)/new-appointment')} 
                style={{ marginTop: 8, backgroundColor: COLORS.primary }}
              >
                Agendar Consulta
              </Button>
            </View>
          ) : (
            upcomingAppointments.map((appointment) => (
              <View key={appointment.id} style={{ marginBottom: 12 }}>
                <Text variant="titleMedium">{appointment.doctor}</Text>
                <Text variant="bodyMedium" style={{ color: COLORS.textSecondary }}>{appointment.specialty}</Text>
                <Text variant="bodySmall" style={{ color: COLORS.secondary }}>
                  {appointment.date} às {appointment.time}
                </Text>
                {appointment.id !== upcomingAppointments[upcomingAppointments.length - 1].id && (
                  <Divider style={{ marginTop: 8 }} />
                )}
              </View>
            ))
          )}
        </Card.Content>
        {upcomingAppointments.length > 0 && (
          <Card.Actions>
            <Button onPress={() => router.push('/(tabs)/appointments')}>Ver Todas</Button>
          </Card.Actions>
        )}
      </Card>

      {/* Notifications */}
      <Card style={{ margin: 16, backgroundColor: COLORS.cardBackground }}>
        <Card.Title title="Notificações" />
        <Card.Content>
          {notifications.map((notification) => (
            <List.Item
              key={notification.id}
              title={notification.title}
              description={notification.description}
              right={() => <Text variant="bodySmall" style={{ color: COLORS.textSecondary }}>{notification.time}</Text>}
              style={{ marginBottom: 8 }}
            />
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
} 