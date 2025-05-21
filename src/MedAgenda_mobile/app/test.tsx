import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button } from 'react-native';
import { authService, doctorService, appointmentService, profileService } from '../services/api';

export default function TestScreen() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const testApi = async () => {
    setLoading(true);
    clearResults();
    try {
      // 1. Test Registration
      addResult('📝 Testing Registration...');
      const registerData = {
        name: 'Test User',
        email: 'test@medagenda.com',
        password: 'Test123',
        gender: 'male',
        birthdate: '1990-01-01'
      };
      const registeredUser = await authService.register(registerData);
      addResult('✅ Registration successful: ' + JSON.stringify(registeredUser, null, 2));

      // 2. Test Login
      addResult('\n🔑 Testing Login...');
      const loginResponse = await authService.login('test@medagenda.com', 'Test123');
      addResult('✅ Login successful: ' + JSON.stringify(loginResponse, null, 2));

      // 3. Test Profile Access
      addResult('\n👤 Testing Profile Access...');
      const profile = await profileService.getProfile();
      addResult('✅ Profile retrieved: ' + JSON.stringify(profile, null, 2));

      // 4. Test Doctor Listing
      addResult('\n👨‍⚕️ Testing Doctor Listing...');
      const doctors = await doctorService.getDoctors();
      addResult('✅ Doctors retrieved: ' + JSON.stringify(doctors, null, 2));

      // 5. Test Doctor Specialties
      addResult('\n🏥 Testing Doctor Specialties...');
      const specialties = await doctorService.getDoctorSpecialties();
      addResult('✅ Specialties retrieved: ' + JSON.stringify(specialties, null, 2));

      // 6. Test Appointment Creation (if we have a doctor)
      if (doctors.length > 0) {
        addResult('\n📅 Testing Appointment Creation...');
        const appointmentData = {
          userId: profile._id,
          docId: doctors[0]._id,
          slotDate: '2024-03-20',
          slotTime: '10:00'
        };
        const appointment = await appointmentService.createAppointment(appointmentData);
        addResult('✅ Appointment created: ' + JSON.stringify(appointment, null, 2));

        // 7. Test Appointment Listing
        addResult('\n📋 Testing Appointment Listing...');
        const appointments = await appointmentService.getAppointments();
        addResult('✅ Appointments retrieved: ' + JSON.stringify(appointments, null, 2));
      }

      addResult('\n✨ All tests completed successfully!');
    } catch (error: any) {
      addResult('\n❌ Test failed: ' + error.message);
      if (error.response?.data) {
        addResult('Response data: ' + JSON.stringify(error.response.data, null, 2));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>API Test Screen</Text>
      <Button
        title={loading ? "Testing..." : "Run Tests"}
        onPress={testApi}
        disabled={loading}
      />
      <ScrollView style={styles.results}>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>{result}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  results: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'monospace',
  },
}); 