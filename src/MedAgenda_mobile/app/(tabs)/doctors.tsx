import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Chip, Searchbar, Text, ActivityIndicator, Button } from 'react-native-paper';
import { router } from 'expo-router';
import { doctors } from '../../services/api';
import { Doctor } from '../../services/api';
import { COLORS } from '../../constants/theme';

export default function DoctorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading doctors and specialties...');
      
      // Load doctors and specialties
      const [doctorsData, specialtiesData] = await Promise.all([
        doctors.getAll(),
        doctors.getSpecialties()
      ]);
      
      console.log('Doctors loaded:', doctorsData.length);
      console.log('Specialties loaded:', specialtiesData);
      
      setDoctorsList(doctorsData);
      setSpecialties(specialtiesData);
      
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(`Erro ao carregar dados: ${err.message || 'Tente novamente.'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctorsList.filter((doctor) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = doctor.name.toLowerCase().includes(searchLower) ||
      (doctor.specialty?.toLowerCase().includes(searchLower) ?? false);
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando médicos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.error}>{error}</Text>
        <Button mode="contained" onPress={loadData} style={styles.retryButton}>
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
          {filteredDoctors.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>
                {searchQuery || selectedSpecialty 
                  ? 'Nenhum médico encontrado com os filtros aplicados'
                  : 'Nenhum médico disponível'
                }
              </Text>
            </View>
          ) : (
            filteredDoctors.map((doctor) => (
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
                  <Text variant="titleMedium" style={styles.doctorName}>
                    {doctor.name}
                  </Text>
                  <Text variant="bodyMedium" style={styles.specialty}>
                    {doctor.specialty || 'Especialidade não informada'}
                  </Text>
                  {doctor.crm && (
                    <Text variant="bodySmall" style={styles.info}>
                      CRM: {doctor.crm}
                    </Text>
                  )}
                  {doctor.experience && (
                    <Text variant="bodySmall" style={styles.info}>
                      Experiência: {doctor.experience}
                    </Text>
                  )}
                  {doctor.fees && (
                    <Text variant="bodySmall" style={styles.fees}>
                      Consulta: R$ {doctor.fees.toFixed(2)}
                    </Text>
                  )}
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.surface,
  },
  doctorName: {
    color: COLORS.textPrimary,
    fontWeight: 'bold',
  },
  specialty: {
    color: COLORS.primary,
    marginBottom: 4,
  },
  info: {
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  fees: {
    color: COLORS.success,
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyText: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: COLORS.error,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
  },
}); 