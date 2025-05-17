import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Chip, FAB, Searchbar, SegmentedButtons, Text } from 'react-native-paper';
import { COLORS } from '../../constants/theme';
import { router } from 'expo-router';

export default function AppointmentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('upcoming');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  // Mock data - replace with actual data from your API
  const appointments = [
    {
      id: '1',
      doctor: 'Dr. Maria Silva',
      specialty: 'Cardiologia',
      date: '2024-03-25',
      time: '14:30',
      status: 'upcoming',
    },
    {
      id: '2',
      doctor: 'Dr. João Santos',
      specialty: 'Clínico Geral',
      date: '2024-03-27',
      time: '10:00',
      status: 'upcoming',
    },
    {
      id: '3',
      doctor: 'Dra. Ana Oliveira',
      specialty: 'Dermatologia',
      date: '2024-03-20',
      time: '09:15',
      status: 'completed',
    },
  ];

  const specialties = ['Cardiologia', 'Clínico Geral', 'Dermatologia', 'Ortopedia'];

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch = appointment.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSpecialty = selectedSpecialties.length === 0 || 
      selectedSpecialties.includes(appointment.specialty);
    return matchesSearch && matchesStatus && matchesSpecialty;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return COLORS.primary;
      case 'completed':
        return COLORS.accent;
      default:
        return COLORS.text;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView>
        {/* Search and Filters */}
        <View style={{ padding: 16 }}>
          <Searchbar
            placeholder="Buscar consultas..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={{ marginBottom: 16 }}
          />

          <SegmentedButtons
            value={filterStatus}
            onValueChange={setFilterStatus}
            buttons={[
              { value: 'all', label: 'Todas' },
              { value: 'upcoming', label: 'Próximas' },
              { value: 'completed', label: 'Realizadas' },
            ]}
            style={{ marginBottom: 16 }}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            {specialties.map((specialty) => (
              <Chip
                key={specialty}
                selected={selectedSpecialties.includes(specialty)}
                onPress={() => {
                  setSelectedSpecialties(
                    selectedSpecialties.includes(specialty)
                      ? selectedSpecialties.filter(s => s !== specialty)
                      : [...selectedSpecialties, specialty]
                  );
                }}
                style={{ marginRight: 8 }}
              >
                {specialty}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Appointments List */}
        <View style={{ padding: 16 }}>
          {filteredAppointments.map((appointment) => (
            <Card
              key={appointment.id}
              style={{ marginBottom: 16 }}
              onPress={() => {
                router.push({
                  pathname: '/(tabs)/appointments/[id]',
                  params: { id: appointment.id }
                });
              }}
            >
              <Card.Content>
                <Text variant="titleMedium">{appointment.doctor}</Text>
                <Text variant="bodyMedium">{appointment.specialty}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text variant="bodySmall">
                    {appointment.date} às {appointment.time}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: getStatusColor(appointment.status) }}
                  >
                    {appointment.status === 'upcoming' ? 'Agendada' : 'Realizada'}
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
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => {
          router.push('/(tabs)/appointments/new');
        }}
      />
    </View>
  );
} 