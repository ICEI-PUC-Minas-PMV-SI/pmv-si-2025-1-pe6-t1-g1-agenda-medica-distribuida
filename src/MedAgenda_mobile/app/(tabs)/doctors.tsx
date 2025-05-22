import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Chip, Searchbar, Text, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { doctors } from '../../services/api';
import { Doctor } from '../../services/api';

export default function DoctorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDoctors();
    loadSpecialties();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctors.getAll();
      setDoctorsList(data);
    } catch (err) {
      setError('Erro ao carregar médicos');
      console.error('Error loading doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadSpecialties = async () => {
    try {
      const data = await doctors.getSpecialties();
      setSpecialties(data);
    } catch (err) {
      console.error('Error loading specialties:', err);
    }
  };

  const filteredDoctors = doctorsList.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
        <Button mode="contained" onPress={loadDoctors} style={styles.retryButton}>
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
            placeholder="Buscar médicos..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.specialtiesContainer}
          >
            <Chip
              selected={!selectedSpecialty}
              onPress={() => setSelectedSpecialty('')}
              style={styles.chip}
            >
              Todas
            </Chip>
            {specialties.map((specialty) => (
              <Chip
                key={specialty}
                selected={selectedSpecialty === specialty}
                onPress={() => setSelectedSpecialty(specialty)}
                style={styles.chip}
              >
                {specialty}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Doctors List */}
        <View style={styles.doctorsList}>
          {filteredDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              style={styles.card}
              onPress={() => {
                router.push({
                  pathname: '/(tabs)/new-appointment',
                  params: { doctorId: doctor.id }
                });
              }}
            >
              <Card.Content>
                <Text variant="titleMedium">{doctor.name}</Text>
                <Text variant="bodyMedium">{doctor.specialty}</Text>
                <Text variant="bodySmall">Email: {doctor.email}</Text>
                <Text variant="bodySmall">Telefone: {doctor.phone}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
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
  specialtiesContainer: {
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
  },
  doctorsList: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
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