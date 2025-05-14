import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';

const specialties = [
  { name: 'Cardiology', icon: 'heart', color: '#FF6B6B' },
  { name: 'Neurology', icon: 'brain', color: '#4ECDC4' },
  { name: 'Pediatrics', icon: 'baby', color: '#45B7D1' },
  { name: 'Orthopedics', icon: 'bone', color: '#96CEB4' },
  { name: 'Dentistry', icon: 'tooth', color: '#FFEEAD' },
  { name: 'Ophthalmology', icon: 'eye', color: '#D4A5A5' },
];

export default function SpecialityMenu() {
  const router = useRouter();

  const handleSpecialtyPress = (specialty) => {
    router.push(`/doctors/${specialty.toLowerCase()}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Specialties</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {specialties.map((specialty, index) => (
          <TouchableOpacity
            key={index}
            style={styles.specialtyCard}
            onPress={() => handleSpecialtyPress(specialty.name)}
          >
            <View style={[styles.iconContainer, { backgroundColor: specialty.color }]}>
              <FontAwesome5 name={specialty.icon} size={24} color="white" />
            </View>
            <Text style={styles.specialtyName}>{specialty.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  specialtyCard: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 100,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  specialtyName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 