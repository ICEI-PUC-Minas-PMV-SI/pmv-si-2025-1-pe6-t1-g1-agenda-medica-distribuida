import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants/theme';

const specialties = [
  { id: 1, name: 'Cardiology', icon: 'heartbeat' },
  { id: 2, name: 'Pediatrics', icon: 'child' },
  { id: 3, name: 'Dermatology', icon: 'user-md' },
  { id: 4, name: 'Neurology', icon: 'brain' },
  { id: 5, name: 'Orthopedics', icon: 'bone' },
];

const topDoctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.8,
    image: require('../../assets/images/doctor1.png'),
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Pediatrics',
    rating: 4.9,
    image: require('../../assets/images/doctor2.png'),
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>John Doe</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <FontAwesome name="bell" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.bookingCard} onPress={() => router.push('/booking')}>
        <View style={styles.bookingCardContent}>
          <Text style={styles.bookingTitle}>Need a doctor?</Text>
          <Text style={styles.bookingSubtitle}>Book an appointment now</Text>
        </View>
        <FontAwesome name="arrow-right" size={24} color={COLORS.textLight} />
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specialties</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialtiesContainer}>
          {specialties.map((specialty) => (
            <TouchableOpacity key={specialty.id} style={styles.specialtyCard}>
              <FontAwesome name={specialty.icon} size={24} color={COLORS.primary} />
              <Text style={styles.specialtyName}>{specialty.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Doctors</Text>
        {topDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={styles.doctorCard}
            onPress={() => router.push(`/doctor/${doctor.id}`)}
          >
            <Image source={doctor.image} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.name}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={16} color={COLORS.warning} />
                <Text style={styles.rating}>{doctor.rating}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding.large,
    paddingTop: 60,
  },
  greeting: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
  userName: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.title,
    color: COLORS.textPrimary,
  },
  notificationButton: {
    padding: SIZES.padding.small,
  },
  bookingCard: {
    backgroundColor: COLORS.primary,
    margin: SIZES.padding.large,
    padding: SIZES.padding.large,
    borderRadius: SIZES.radius.large,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  bookingCardContent: {
    flex: 1,
  },
  bookingTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.subtitle,
    color: COLORS.textLight,
    marginBottom: 5,
  },
  bookingSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body,
    color: COLORS.textLight,
  },
  section: {
    padding: SIZES.padding.large,
  },
  sectionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.subtitle,
    marginBottom: 15,
    color: COLORS.textPrimary,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },
  specialtyCard: {
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    marginHorizontal: 5,
    width: 100,
    ...SHADOWS.small,
  },
  specialtyName: {
    marginTop: 8,
    fontFamily: FONTS.medium,
    fontSize: FONTS.caption,
    textAlign: 'center',
    color: COLORS.textPrimary,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    marginBottom: SIZES.padding.small,
    ...SHADOWS.small,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  doctorInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginBottom: 5,
  },
  doctorSpecialty: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 5,
    fontFamily: FONTS.medium,
    fontSize: FONTS.caption,
    color: COLORS.textPrimary,
  },
}); 