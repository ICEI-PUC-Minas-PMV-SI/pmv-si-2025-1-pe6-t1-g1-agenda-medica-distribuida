import { ScrollView, View } from 'react-native';
import { Avatar, Button, Card, Divider, List, Text, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../constants/theme';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { appointments, doctors } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUserAppointments();
  }, []);

  const loadUserAppointments = async () => {
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
      
      if (!userId) {
        setError('Usuário não autenticado');
        return;
      }

      // Carregar agendamentos do usuário usando a API diretamente com token
      const response = await fetch(`https://med-agenda-backend.vercel.app/api/appointment?_id=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'client': 'not-browser',
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao carregar agendamentos');
      }
      
      const data = await response.json();
      const userAppointments = data.appointments || [];
      
              // Filtrar apenas agendamentos futuros e ordenar por data
        const now = new Date();
        const futureAppointments = userAppointments
          .filter((appointment: any) => {
            const appointmentDate = new Date(appointment.slotDate || appointment.date);
            return appointmentDate >= now && !appointment.cancelled;
          })
          .sort((a: any, b: any) => new Date(a.slotDate || a.date).getTime() - new Date(b.slotDate || b.date).getTime())
          .slice(0, 3); // Mostrar apenas os próximos 3

        // Carregar dados dos médicos para cada agendamento
        const appointmentsWithDoctors = await Promise.all(
          futureAppointments.map(async (appointment: any) => {
                      try {
              const doctor = await doctors.getById(appointment.doctor || appointment.doctorId);
              return {
                id: appointment._id || appointment.id,
                doctor: doctor.name,
                specialty: doctor.specialty,
                date: new Date(appointment.slotDate || appointment.date).toLocaleDateString('pt-BR'),
                time: appointment.slotTime || appointment.time,
              };
            } catch (error) {
              // Se não conseguir carregar o médico, usar dados básicos
              return {
                id: appointment._id || appointment.id,
                doctor: `Médico: ${appointment.doctor || appointment.doctorId}`,
                specialty: 'Não informado',
                date: new Date(appointment.slotDate || appointment.date).toLocaleDateString('pt-BR'),
                time: appointment.slotTime || appointment.time,
              };
            }
        })
      );

      setUpcomingAppointments(appointmentsWithDoctors);
      
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
      <View style={{ padding: 16, backgroundColor: COLORS.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Avatar.Text 
            size={48} 
            label={user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'} 
            style={{ backgroundColor: COLORS.accent }} 
          />
          <View style={{ marginLeft: 12 }}>
            <Text variant="titleMedium" style={{ color: 'white' }}>Bem-vindo(a),</Text>
            <Text variant="headlineSmall" style={{ color: 'white' }}>{user?.name || 'Usuário'}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
        <Button
          mode="contained"
          icon="calendar-plus"
          onPress={() => router.push('/(tabs)/new-appointment')}
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
        <Card.Title 
          title="Próximas Consultas" 
          right={() => loading ? <ActivityIndicator size="small" /> : null}
        />
        <Card.Content>
          {loading ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <ActivityIndicator size="large" />
              <Text style={{ marginTop: 8 }}>Carregando agendamentos...</Text>
            </View>
          ) : error ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
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
                style={{ marginTop: 8 }}
              >
                Agendar Consulta
              </Button>
            </View>
          ) : (
            upcomingAppointments.map((appointment) => (
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