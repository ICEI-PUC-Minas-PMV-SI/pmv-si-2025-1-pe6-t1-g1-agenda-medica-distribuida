import { auth, doctors, appointments, patients, profileService } from '../services/api';
import { testApiConnection, testAvailableEndpoints } from '../services/apiTest';
import { AppointmentType } from '../types/api';

/**
 * Example usage of the MedAgenda API service
 * Connected to: https://med-agenda-backend.vercel.app/
 */

// Test API connection
export const checkConnection = async () => {
  console.log('Testing API connection...');
  const isConnected = await testApiConnection();
  
  if (isConnected) {
    console.log('✅ Successfully connected to backend!');
    await testAvailableEndpoints();
  } else {
    console.log('❌ Failed to connect to backend');
  }
};

// Authentication examples
export const authExamples = {
  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      console.log('Login successful:', response.user.name);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // Register new user
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => {
    try {
      const user = await auth.register(userData);
      console.log('Registration successful:', user.name);
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await auth.logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
};

// Doctors examples
export const doctorsExamples = {
  // Get all doctors
  getAllDoctors: async () => {
    try {
      const doctorsList = await doctors.getAll();
      console.log(`Found ${doctorsList.length} doctors`);
      return doctorsList;
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      throw error;
    }
  },

  // Search doctors by specialty
  searchBySpecialty: async (specialty: string) => {
    try {
      const doctorsList = await doctors.getAll(specialty);
      console.log(`Found ${doctorsList.length} doctors in ${specialty}`);
      return doctorsList;
    } catch (error) {
      console.error('Failed to search doctors:', error);
      throw error;
    }
  },

  // Get doctor details
  getDoctorDetails: async (doctorId: string) => {
    try {
      const doctor = await doctors.getById(doctorId);
      console.log(`Doctor details: ${doctor.name} - ${doctor.specialty}`);
      return doctor;
    } catch (error) {
      console.error('Failed to fetch doctor details:', error);
      throw error;
    }
  },

  // Get available specialties
  getSpecialties: async () => {
    try {
      const specialties = await doctors.getSpecialties();
      console.log('Available specialties:', specialties);
      return specialties;
    } catch (error) {
      console.error('Failed to fetch specialties:', error);
      throw error;
    }
  }
};

// Appointments examples
export const appointmentsExamples = {
  // Create new appointment
  createAppointment: async (appointmentData: {
    doctorId: string;
    date: string;
    time: string;
    notes?: string;
  }) => {
    try {
      const appointment = await appointments.create({
        ...appointmentData,
        type: AppointmentType.CONSULTATION
      });
      console.log('Appointment created:', appointment.id);
      return appointment;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      throw error;
    }
  },

  // Get user appointments
  getUserAppointments: async () => {
    try {
      const appointmentsList = await appointments.getAll();
      console.log(`Found ${appointmentsList.length} appointments`);
      return appointmentsList;
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      throw error;
    }
  },

  // Update appointment
  updateAppointment: async (appointmentId: string, updates: any) => {
    try {
      const updatedAppointment = await appointments.update(appointmentId, updates);
      console.log('Appointment updated:', updatedAppointment.id);
      return updatedAppointment;
    } catch (error) {
      console.error('Failed to update appointment:', error);
      throw error;
    }
  }
};

// Profile examples
export const profileExamples = {
  // Get user profile
  getProfile: async () => {
    try {
      const profile = await profileService.getProfile();
      console.log('Profile loaded:', profile.name);
      return profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  // Update profile
  updateProfile: async (updates: {
    name?: string;
    phone?: string;
    email?: string;
  }) => {
    try {
      const updatedProfile = await profileService.updateProfile(updates);
      console.log('Profile updated:', updatedProfile.name);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }
};

export default {
  checkConnection,
  authExamples,
  doctorsExamples,
  appointmentsExamples,
  profileExamples
}; 