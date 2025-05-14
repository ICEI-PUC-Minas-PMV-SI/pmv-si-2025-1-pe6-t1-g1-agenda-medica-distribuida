import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants/theme';

// Mock data - Replace with API call
const doctorDetails = {
  id: 1,
  name: 'Dr. Sarah Johnson',
  specialty: 'Cardiology',
  rating: 4.8,
  experience: '15 years',
  patients: '1000+',
  about: 'Dr. Sarah Johnson is a board-certified cardiologist with extensive experience in treating various heart conditions. She specializes in preventive cardiology and heart disease management.',
  education: [
    {
      id: 1,
      degree: 'MD in Cardiology',
      institution: 'Harvard Medical School',
      year: '2008',
    },
    {
      id: 2,
      degree: 'Residency in Internal Medicine',
      institution: 'Massachusetts General Hospital',
      year: '2005',
    },
  ],
  availability: [
    { id: 1, day: 'Monday', time: '9:00 AM - 5:00 PM' },
    { id: 2, day: 'Wednesday', time: '9:00 AM - 5:00 PM' },
    { id: 3, day: 'Friday', time: '9:00 AM - 3:00 PM' },
  ],
  location: 'Medical Center, Building A, Floor 3',
  image: require('../../assets/images/doctor1.png'),
};

export default function DoctorDetailsScreen() {
  const [selectedTab, setSelectedTab] = useState('about');
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'about':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.aboutText}>{doctorDetails.about}</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{doctorDetails.experience}</Text>
                <Text style={styles.statLabel}>Experience</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{doctorDetails.patients}</Text>
                <Text style={styles.statLabel}>Patients</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{doctorDetails.rating}</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>
        );
      case 'education':
        return (
          <View style={styles.tabContent}>
            {doctorDetails.education.map((edu) => (
              <View key={edu.id} style={styles.educationItem}>
                <View style={styles.educationYear}>
                  <Text style={styles.yearText}>{edu.year}</Text>
                </View>
                <View style={styles.educationInfo}>
                  <Text style={styles.degreeName}>{edu.degree}</Text>
                  <Text style={styles.institutionName}>{edu.institution}</Text>
                </View>
              </View>
            ))}
          </View>
        );
      case 'schedule':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.locationText}>
              <FontAwesome name="map-marker" size={16} color={COLORS.primary} />
              {'  '}{doctorDetails.location}
            </Text>
            {doctorDetails.availability.map((slot) => (
              <View key={slot.id} style={styles.scheduleItem}>
                <Text style={styles.dayText}>{slot.day}</Text>
                <Text style={styles.timeText}>{slot.time}</Text>
              </View>
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: COLORS.background },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <FontAwesome name="arrow-left" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image source={doctorDetails.image} style={styles.doctorImage} />
          <Text style={styles.doctorName}>{doctorDetails.name}</Text>
          <Text style={styles.specialty}>{doctorDetails.specialty}</Text>
          <View style={styles.ratingContainer}>
            <FontAwesome name="star" size={16} color={COLORS.warning} />
            <Text style={styles.rating}>{doctorDetails.rating}</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'about' && styles.activeTab]}
            onPress={() => setSelectedTab('about')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'about' && styles.activeTabText,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'education' && styles.activeTab]}
            onPress={() => setSelectedTab('education')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'education' && styles.activeTabText,
              ]}
            >
              Education
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'schedule' && styles.activeTab]}
            onPress={() => setSelectedTab('schedule')}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === 'schedule' && styles.activeTabText,
              ]}
            >
              Schedule
            </Text>
          </TouchableOpacity>
        </View>

        {renderTabContent()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => router.push(`/booking?doctorId=${id}`)}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    padding: SIZES.padding.small,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SIZES.padding.large,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radius.full,
    marginBottom: SIZES.padding.medium,
  },
  doctorName: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.title,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  specialty: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 8,
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.padding.medium,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  tabContent: {
    padding: SIZES.padding.large,
  },
  aboutText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: SIZES.padding.large,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SIZES.padding.medium,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.subtitle,
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  educationItem: {
    flexDirection: 'row',
    marginBottom: SIZES.padding.medium,
  },
  educationYear: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding.small,
    borderRadius: SIZES.radius.small,
    marginRight: SIZES.padding.medium,
  },
  yearText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.caption,
    color: COLORS.primary,
  },
  educationInfo: {
    flex: 1,
  },
  degreeName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  institutionName: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  locationText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginBottom: SIZES.padding.medium,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SIZES.padding.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dayText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
  },
  timeText: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: SIZES.padding.medium,
    paddingBottom: Platform.OS === 'ios' ? 34 : SIZES.padding.medium,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.padding.medium,
    borderRadius: SIZES.radius.medium,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  bookButtonText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.body,
    color: COLORS.textLight,
  },
}); 