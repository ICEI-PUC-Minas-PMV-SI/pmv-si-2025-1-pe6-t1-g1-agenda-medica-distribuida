import { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants/theme';

const specialties = [
  'All',
  'Cardiology',
  'Pediatrics',
  'Dermatology',
  'Neurology',
  'Orthopedics',
];

const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.8,
    experience: '15 years',
    image: require('../../assets/images/doctor1.png'),
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Pediatrics',
    rating: 4.9,
    experience: '12 years',
    image: require('../../assets/images/doctor2.png'),
  },
  // Add more doctors as needed
];

export default function DoctorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const router = useRouter();

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const renderDoctorCard = ({ item: doctor }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => router.push(`/doctor/${doctor.id}`)}
    >
      <Image source={doctor.image} style={styles.doctorImage} />
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor.name}</Text>
        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
        <Text style={styles.experience}>{doctor.experience}</Text>
        <View style={styles.ratingContainer}>
          <FontAwesome name="star" size={16} color={COLORS.warning} />
          <Text style={styles.rating}>{doctor.rating}</Text>
        </View>
      </View>
      <FontAwesome name="angle-right" size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Doctors</Text>
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.specialtiesContainer}>
        <FlatList
          data={specialties}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.specialtyChip,
                selectedSpecialty === item && styles.selectedSpecialtyChip,
              ]}
              onPress={() => setSelectedSpecialty(item)}
            >
              <Text
                style={[
                  styles.specialtyChipText,
                  selectedSpecialty === item && styles.selectedSpecialtyChipText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        renderItem={renderDoctorCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.doctorsList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.padding.large,
    paddingTop: 60,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.largeTitle,
    marginBottom: SIZES.padding.large,
    color: COLORS.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: SIZES.padding.medium,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
  },
  specialtiesContainer: {
    paddingVertical: SIZES.padding.medium,
  },
  specialtyChip: {
    paddingHorizontal: SIZES.padding.large,
    paddingVertical: SIZES.padding.medium,
    borderRadius: SIZES.radius.full,
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.padding.small,
    ...SHADOWS.small,
  },
  selectedSpecialtyChip: {
    backgroundColor: COLORS.primary,
  },
  specialtyChipText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  selectedSpecialtyChipText: {
    color: COLORS.textLight,
  },
  doctorsList: {
    padding: SIZES.padding.large,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    marginBottom: SIZES.padding.medium,
    ...SHADOWS.small,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: SIZES.radius.full,
    marginRight: SIZES.padding.medium,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  experience: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: SIZES.padding.small,
    fontFamily: FONTS.medium,
    fontSize: FONTS.caption,
    color: COLORS.textPrimary,
  },
}); 