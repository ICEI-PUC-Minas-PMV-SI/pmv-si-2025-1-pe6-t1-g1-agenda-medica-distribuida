import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { doctorService } from '../../services/api';

type DoctorDetails = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: string;
  imageUrl: string;
  education: string[];
  languages: string[];
  about: string;
  location: string;
  consultationFee: string;
  availability: {
    days: string[];
    hours: string;
  };
};

export default function DoctorDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<DoctorDetails | null>(null);

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getDoctorById(id as string);
      setDoctor(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load doctor details. Please try again.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={16}
          color={i <= rating ? '#FFD700' : '#ccc'}
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  const handleSchedule = () => {
    router.push({
      pathname: '/(tabs)/schedule',
      params: { doctorId: id },
    });
  };

  if (loading || !doctor) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: doctor.imageUrl }} style={styles.doctorImage} />
        <View style={styles.headerInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.specialty}>{doctor.specialty}</Text>
          <View style={styles.ratingRow}>
            {renderRatingStars(doctor.rating)}
            <Text style={styles.rating}>{doctor.rating.toFixed(1)}</Text>
          </View>
          <Text style={styles.experience}>{doctor.experience} experience</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionText}>{doctor.about}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {doctor.education.map((edu, index) => (
          <Text key={index} style={styles.listItem}>
            • {edu}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Languages</Text>
        <Text style={styles.sectionText}>{doctor.languages.join(', ')}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.sectionText}>{doctor.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Availability</Text>
        <Text style={styles.sectionText}>
          {doctor.availability.days.join(', ')}
        </Text>
        <Text style={styles.sectionText}>{doctor.availability.hours}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consultation Fee</Text>
        <Text style={styles.consultationFee}>{doctor.consultationFee}</Text>
      </View>

      <TouchableOpacity style={styles.scheduleButton} onPress={handleSchedule}>
        <Text style={styles.scheduleButtonText}>Schedule Appointment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  rating: {
    fontSize: 14,
    color: '#666',
  },
  experience: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    lineHeight: 24,
  },
  consultationFee: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '600',
  },
  scheduleButton: {
    backgroundColor: '#007AFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 