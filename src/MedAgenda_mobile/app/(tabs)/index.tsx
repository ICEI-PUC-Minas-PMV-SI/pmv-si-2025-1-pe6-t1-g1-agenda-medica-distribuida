import { ScrollView, View } from 'react-native';
import { Avatar, Button, Card, Divider, List, Text, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../constants/theme';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { appointments, doctors, users } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const { user, updateUser } = useAuth();
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState<string>('Usuário');

  // Log user data for debugging
  console.log('🏠 Home Screen - User object from context:', user);
  console.log('🏠 Home Screen - User name from context:', user?.name);
  console.log('🏠 Home Screen - User ID from context:', user?.id);
  console.log('🏠 Home Screen - Local userName state:', userName);

  useEffect(() => {
    checkStoredUserData();
    
    // Update local userName state when user changes
    if (user?.name && user.name !== 'Usuário') {
      console.log('🔄 Updating local userName state to:', user.name);
      setUserName(user.name);
    } else if (user?.id) {
      console.log('🔍 User name is missing or default, attempting to fetch profile...');
      fetchUserProfile();
    }
    
    if (user?.id) {
      loadUserAppointments();
    }
  }, [user?.id, user?.name]);

  const checkStoredUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('authToken');
      
      console.log('💾 Stored user data:', storedUser);
      console.log('💾 Stored token exists:', !!storedToken);
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('💾 Parsed stored user:', parsedUser);
        console.log('💾 Parsed stored user name:', parsedUser.name);
        
        // If stored user has a valid name, use it
        if (parsedUser.name && parsedUser.name !== 'Usuário') {
          console.log('🔄 Using stored user name:', parsedUser.name);
          setUserName(parsedUser.name);
        }
      }
      
      // If we still don't have a name, try to extract from token
      if (storedToken && userName === 'Usuário') {
        console.log('🔍 Attempting to extract name from token...');
        tryExtractNameFromToken(storedToken);
      }
    } catch (error) {
      console.error('❌ Error checking stored data:', error);
    }
  };

  const tryExtractNameFromToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      console.log('🔍 Decoded token for name extraction:', decoded);
      
      const extractedName = decoded.name || decoded.fullName || decoded.firstName || decoded.username;
      if (extractedName && extractedName !== 'Usuário') {
        console.log('✅ Extracted name from token:', extractedName);
        setUserName(extractedName);
      }
    } catch (error) {
      console.error('❌ Error extracting name from token:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      console.log('🔍 Attempting to fetch user profile for name...');
      const profileData = await users.getProfile();
      console.log('✅ Fetched profile data:', profileData);
      
      if (profileData.name && profileData.name !== 'Usuário') {
        console.log('🔄 Updating user name from profile:', profileData.name);
        setUserName(profileData.name);
        await updateUser({ name: profileData.name });
      } else {
        console.log('⚠️ Profile data does not contain a valid name:', profileData.name);
      }
    } catch (error: any) {
      console.warn('❌ Could not fetch user profile (this is normal if endpoint does not exist):', error.message);
      // Don't throw error - this is a fallback mechanism
      // If API doesn't exist, we'll use other strategies
    }
  };

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
      
      // Log each appointment to check doctor data
      userAppointments.forEach((appointment, index) => {
        console.log(`Home - Appointment ${index + 1}:`, {
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
          console.log(`Home - Doctor object for appointment ${index + 1}:`, appointment.doctor);
        } else {
          console.log(`Home - No doctor object for appointment ${index + 1}, doctorId:`, appointment.doctorId);
        }
      });
      
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
      <View style={{ padding: 16, backgroundColor: COLORS.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Avatar.Text 
            size={48} 
            label={userName !== 'Usuário' ? userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'} 
            style={{ backgroundColor: COLORS.accent }} 
          />
          <View style={{ marginLeft: 12 }}>
            <Text variant="titleMedium" style={{ color: 'white' }}>Bem-vindo(a),</Text>
            <Text variant="headlineSmall" style={{ color: 'white' }}>{userName}</Text>
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