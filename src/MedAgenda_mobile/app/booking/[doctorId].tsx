import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { COLORS, FONTS, SHADOWS, SIZES } from '../../constants/theme';
import { doctorService, appointmentService } from '../../services/api';
import { Doctor, AppointmentType } from '../../types/api';
import { RootStackParamList } from '../../types/navigation';

type BookingStep = 'date' | 'time' | 'type' | 'confirmation';

export default function BookingScreen() {
  const { doctorId } = useLocalSearchParams<RootStackParamList['/booking/[doctorId]']>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<BookingStep>('date');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<AppointmentType>(AppointmentType.CONSULTATION);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDoctorDetails();
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimes();
    }
  }, [selectedDate]);

  const loadDoctorDetails = async () => {
    try {
      const doctorData = await doctorService.getDoctorById(doctorId as string);
      setDoctor(doctorData);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load doctor details');
      router.back();
    }
  };

  const loadAvailableTimes = async () => {
    try {
      const times = await doctorService.getDoctorAvailability(
        doctorId as string,
        format(selectedDate, 'yyyy-MM-dd')
      );
      setAvailableTimes(times);
    } catch (error) {
      Alert.alert('Error', 'Failed to load available times');
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTime('');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep('type');
  };

  const handleTypeSelect = (type: AppointmentType) => {
    setSelectedType(type);
    setCurrentStep('confirmation');
  };

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await appointmentService.createAppointment({
        doctorId: doctorId,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        type: selectedType,
      });
      Alert.alert(
        'Success',
        'Appointment booked successfully',
        [{
          text: 'OK',
          onPress: () => {
            router.back();
          }
        }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
  };

  const renderDateStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Date</Text>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={handleDateChange}
        minimumDate={new Date()}
      />
      {selectedDate && (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => setCurrentStep('time')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderTimeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Time</Text>
      <ScrollView style={styles.timeList}>
        {availableTimes.map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeItem,
              selectedTime === time && styles.selectedTimeItem,
            ]}
            onPress={() => handleTimeSelect(time)}
          >
            <Text
              style={[
                styles.timeText,
                selectedTime === time && styles.selectedTimeText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTypeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Appointment Type</Text>
      {Object.values(AppointmentType).map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.typeItem,
            selectedType === type && styles.selectedTypeItem,
          ]}
          onPress={() => handleTypeSelect(type)}
        >
          <Text
            style={[
              styles.typeText,
              selectedType === type && styles.selectedTypeText,
            ]}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderConfirmationStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Confirm Appointment</Text>
      <View style={styles.confirmationDetails}>
        <Text style={styles.confirmationText}>
          Doctor: {doctor?.name}
        </Text>
        <Text style={styles.confirmationText}>
          Date: {format(selectedDate, 'MMMM d, yyyy')}
        </Text>
        <Text style={styles.confirmationText}>
          Time: {selectedTime}
        </Text>
        <Text style={styles.confirmationText}>
          Type: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={COLORS.textLight} />
        ) : (
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Book Appointment',
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

      <View style={styles.progressBar}>
        {(['date', 'time', 'type', 'confirmation'] as BookingStep[]).map((step, index) => (
          <View
            key={step}
            style={[
              styles.progressStep,
              currentStep === step && styles.activeProgressStep,
              index < ['date', 'time', 'type', 'confirmation'].indexOf(currentStep) && styles.completedProgressStep,
            ]}
          />
        ))}
      </View>

      {currentStep === 'date' && renderDateStep()}
      {currentStep === 'time' && renderTimeStep()}
      {currentStep === 'type' && renderTypeStep()}
      {currentStep === 'confirmation' && renderConfirmationStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    padding: SIZES.padding.small,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SIZES.padding.large,
    backgroundColor: COLORS.background,
    ...SHADOWS.small,
  },
  progressStep: {
    width: 70,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
  },
  activeProgressStep: {
    backgroundColor: COLORS.primary,
  },
  completedProgressStep: {
    backgroundColor: COLORS.success,
  },
  stepContainer: {
    flex: 1,
    padding: SIZES.padding.large,
  },
  stepTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.subtitle,
    color: COLORS.textPrimary,
    marginBottom: SIZES.padding.large,
  },
  timeList: {
    flex: 1,
  },
  timeItem: {
    padding: SIZES.padding.medium,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    marginBottom: SIZES.padding.small,
    ...SHADOWS.small,
  },
  selectedTimeItem: {
    backgroundColor: COLORS.primary,
  },
  timeText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  selectedTimeText: {
    color: COLORS.textLight,
  },
  typeItem: {
    padding: SIZES.padding.medium,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius.medium,
    marginBottom: SIZES.padding.small,
    ...SHADOWS.small,
  },
  selectedTypeItem: {
    backgroundColor: COLORS.primary,
  },
  typeText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  selectedTypeText: {
    color: COLORS.textLight,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding.medium,
    borderRadius: SIZES.radius.medium,
    alignItems: 'center',
    marginTop: SIZES.padding.large,
    ...SHADOWS.medium,
  },
  nextButtonText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.body,
    color: COLORS.textLight,
  },
  confirmationDetails: {
    backgroundColor: COLORS.surface,
    padding: SIZES.padding.large,
    borderRadius: SIZES.radius.medium,
    marginBottom: SIZES.padding.large,
  },
  confirmationText: {
    fontFamily: FONTS.medium,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginBottom: SIZES.padding.small,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding.medium,
    borderRadius: SIZES.radius.medium,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  confirmButtonText: {
    fontFamily: FONTS.bold,
    fontSize: FONTS.body,
    color: COLORS.textLight,
  },
}); 