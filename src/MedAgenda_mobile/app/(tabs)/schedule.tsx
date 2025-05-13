import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { appointmentService, doctorService } from '../../services/api';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
};

type TimeSlot = {
  time: string;
  available: boolean;
};

export default function ScheduleScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getDoctors();
      setDoctors(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load doctors. Please try again.');
    }
  };

  const fetchAvailableTimeSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;

    try {
      setLoading(true);
      const data = await doctorService.getDoctorAvailability(
        selectedDoctor.id,
        format(selectedDate, 'yyyy-MM-dd')
      );
      setAvailableTimeSlots(data);
      setShowTimeModal(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to load available time slots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await appointmentService.createAppointment({
        doctorId: selectedDoctor.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        reason,
      });

      Alert.alert('Success', 'Appointment scheduled successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedDoctor(null);
            setSelectedDate(null);
            setSelectedTime(null);
            setReason('');
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to schedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderDoctorModal = () => (
    <Modal
      visible={showDoctorModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDoctorModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Doctor</Text>
          <ScrollView>
            {doctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={styles.doctorItem}
                onPress={() => {
                  setSelectedDoctor(doctor);
                  setShowDoctorModal(false);
                }}
              >
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowDoctorModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderTimeModal = () => (
    <Modal
      visible={showTimeModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowTimeModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Time</Text>
          <ScrollView>
            {availableTimeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeItem,
                  !slot.available && styles.timeItemDisabled,
                ]}
                onPress={() => {
                  if (slot.available) {
                    setSelectedTime(slot.time);
                    setShowTimeModal(false);
                  }
                }}
                disabled={!slot.available}
              >
                <Text
                  style={[
                    styles.timeText,
                    !slot.available && styles.timeTextDisabled,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowTimeModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Schedule Appointment</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Doctor</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDoctorModal(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedDoctor ? selectedDoctor.name : 'Choose a doctor'}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.selectButtonText}>
              {selectedDate ? format(selectedDate, 'MMMM dd, yyyy') : 'Choose a date'}
            </Text>
            <MaterialIcons name="calendar-today" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
                setSelectedTime(null);
                fetchAvailableTimeSlots();
              }
            }}
          />
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Time</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => {
              if (!selectedDate) {
                Alert.alert('Error', 'Please select a date first');
                return;
              }
              if (!selectedDoctor) {
                Alert.alert('Error', 'Please select a doctor first');
                return;
              }
              fetchAvailableTimeSlots();
            }}
          >
            <Text style={styles.selectButtonText}>
              {selectedTime || 'Choose a time'}
            </Text>
            <MaterialIcons name="access-time" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reason for Visit</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter reason for visit"
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.scheduleButton, loading && styles.scheduleButtonDisabled]}
          onPress={handleSchedule}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.scheduleButtonText}>Schedule Appointment</Text>
          )}
        </TouchableOpacity>
      </View>

      {renderDoctorModal()}
      {renderTimeModal()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#333',
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  scheduleButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  scheduleButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  doctorItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  timeItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  timeItemDisabled: {
    backgroundColor: '#f5f5f5',
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  timeTextDisabled: {
    color: '#999',
  },
  closeButton: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
}); 