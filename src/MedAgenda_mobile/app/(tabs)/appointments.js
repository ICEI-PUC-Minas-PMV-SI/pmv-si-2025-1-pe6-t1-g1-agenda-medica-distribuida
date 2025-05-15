import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants/theme';

const appointments = [
  {
    id: 1,
    doctorName: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: '2024-03-25',
    time: '10:00 AM',
    status: 'upcoming',
    type: 'Check-up',
  },
  {
    id: 2,
    doctorName: 'Dr. Michael Chen',
    specialty: 'Pediatrics',
    date: '2024-03-20',
    time: '2:30 PM',
    status: 'completed',
    type: 'Consultation',
  },
  // Add more appointments as needed
];

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const router = useRouter();

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  const renderAppointmentCard = ({ item: appointment }) => (
    <TouchableOpacity
      style={styles.appointmentCard}
      onPress={() => router.push(`/appointment/${appointment.id}`)}
    >
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentType}>
          <FontAwesome name="stethoscope" size={16} color={COLORS.primary} />
          <Text style={styles.appointmentTypeText}>{appointment.type}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          appointment.status === 'upcoming' ? styles.upcomingBadge : styles.completedBadge
        ]}>
          <Text style={[
            styles.statusText,
            appointment.status === 'upcoming' ? styles.upcomingText : styles.completedText
          ]}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.appointmentInfo}>
        <Text style={styles.doctorName}>{appointment.doctorName}</Text>
        <Text style={styles.specialty}>{appointment.specialty}</Text>
      </View>

      <View style={styles.appointmentFooter}>
        <View style={styles.dateTimeContainer}>
          <View style={styles.iconTextContainer}>
            <FontAwesome name="calendar" size={16} color={COLORS.textSecondary} />
            <Text style={styles.dateTimeText}>{appointment.date}</Text>
          </View>
          <View style={styles.iconTextContainer}>
            <FontAwesome name="clock-o" size={16} color={COLORS.textSecondary} />
            <Text style={styles.dateTimeText}>{appointment.time}</Text>
          </View>
        </View>
        {appointment.status === 'upcoming' && (
          <TouchableOpacity
            style={styles.rescheduleButton}
            onPress={() => router.push(`/reschedule/${appointment.id}`)}
          >
            <FontAwesome name="calendar-plus-o" size={16} color={COLORS.primary} />
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAppointments}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.appointmentsList}
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
    color: COLORS.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding.large,
    marginBottom: SIZES.padding.large,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.padding.medium,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
  },
  activeTabText: {
    color: COLORS.primary,
    fontFamily: FONTS.semiBold,
  },
  appointmentsList: {
    padding: SIZES.padding.large,
  },
  appointmentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    padding: SIZES.padding.medium,
    marginBottom: SIZES.padding.medium,
    ...SHADOWS.small,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.padding.medium,
  },
  appointmentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentTypeText: {
    marginLeft: SIZES.padding.small,
    fontFamily: FONTS.medium,
    fontSize: FONTS.caption,
    color: COLORS.primary,
  },
  statusBadge: {
    paddingHorizontal: SIZES.padding.medium,
    paddingVertical: 4,
    borderRadius: SIZES.radius.full,
  },
  upcomingBadge: {
    backgroundColor: COLORS.upcomingBadge,
  },
  completedBadge: {
    backgroundColor: COLORS.completedBadge,
  },
  statusText: {
    fontSize: FONTS.small,
    fontFamily: FONTS.medium,
  },
  upcomingText: {
    color: COLORS.upcomingText,
  },
  completedText: {
    color: COLORS.completedText,
  },
  appointmentInfo: {
    marginBottom: SIZES.padding.medium,
  },
  doctorName: {
    fontFamily: FONTS.semiBold,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  specialty: {
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  appointmentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateTimeContainer: {
    flex: 1,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateTimeText: {
    marginLeft: SIZES.padding.small,
    fontFamily: FONTS.regular,
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  rescheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.padding.small,
    borderRadius: SIZES.radius.small,
    backgroundColor: COLORS.upcomingBadge,
  },
  rescheduleText: {
    marginLeft: 4,
    fontFamily: FONTS.medium,
    fontSize: FONTS.caption,
    color: COLORS.primary,
  },
}); 