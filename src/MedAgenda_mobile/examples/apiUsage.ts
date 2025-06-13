import { auth, doctors, appointments } from '../services/api';
import { AppointmentType } from '../types/api';

/**
 * Example usage of the MedAgenda API service
 * Connected to: https://med-agenda-backend.vercel.app/
 */

// Example usage of the API services
export const apiUsageExamples = {
  // Authentication examples
  authentication: {
    async login() {
      try {
        const result = await auth.login('user@example.com', 'password123');
        console.log('Login successful:', result.user);
        return result;
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    },

    async register() {
      try {
        const userData = {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '+1234567890',
        };
        
        const result = await auth.register(userData);
        console.log('Registration successful:', result.user);
        return result;
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    },

    async logout() {
      try {
        await auth.logout();
        console.log('Logout successful');
      } catch (error) {
        console.error('Logout failed:', error);
        throw error;
      }
    },

    async getCurrentUser() {
      try {
        const user = await auth.getCurrentUser();
        console.log('Current user:', user);
        return user;
      } catch (error) {
        console.error('Get current user failed:', error);
        throw error;
      }
    },

    async changePassword() {
      try {
        await auth.changePassword('oldPassword123', 'newPassword456');
        console.log('Password changed successfully');
      } catch (error) {
        console.error('Change password failed:', error);
        throw error;
      }
    },
  },

  // Doctors examples
  doctors: {
    async getAllDoctors() {
      try {
        const doctorsList = await doctors.getAll();
        console.log('Doctors list:', doctorsList);
        return doctorsList;
      } catch (error) {
        console.error('Get doctors failed:', error);
        throw error;
      }
    },

    async getDoctorById() {
      try {
        const doctor = await doctors.getById('doctor-id-123');
        console.log('Doctor details:', doctor);
        return doctor;
      } catch (error) {
        console.error('Get doctor by ID failed:', error);
        throw error;
      }
    },

    async getDoctorsBySpecialty() {
      try {
        const specialty = 'Cardiologia';
        const doctorsList = await doctors.getBySpecialty(specialty);
        console.log(`Doctors in ${specialty}:`, doctorsList);
        return doctorsList;
      } catch (error) {
        console.error('Get doctors by specialty failed:', error);
        throw error;
      }
    },

    async getSpecialties() {
      try {
        const specialties = await doctors.getSpecialties();
        console.log('Available specialties:', specialties);
        return specialties;
      } catch (error) {
        console.error('Get specialties failed:', error);
        throw error;
      }
    },
  },

  // Appointments examples
  appointments: {
    async createAppointment() {
      try {
        const appointmentData = {
          userId: 'user-id-123',
          doctorId: 'doctor-id-456',
          date: '2024-01-15',
          time: '14:30',
          type: 'consultation' as AppointmentType,
          notes: 'Regular checkup',
        };

        const appointment = await appointments.create(appointmentData);
        console.log('Appointment created:', appointment);
        return appointment;
      } catch (error) {
        console.error('Create appointment failed:', error);
        throw error;
      }
    },

    async getUserAppointments() {
      try {
        const userId = 'user-id-123';
        const appointmentsList = await appointments.getByUserId(userId);
        console.log('User appointments:', appointmentsList);
        return appointmentsList;
      } catch (error) {
        console.error('Get user appointments failed:', error);
        throw error;
      }
    },

    async getAppointmentById() {
      try {
        const appointmentId = 'appointment-id-789';
        const appointment = await appointments.getById(appointmentId);
        console.log('Appointment details:', appointment);
        return appointment;
      } catch (error) {
        console.error('Get appointment by ID failed:', error);
        throw error;
      }
    },

    async updateAppointmentStatus() {
      try {
        const appointmentId = 'appointment-id-789';
        const newStatus = 'completed';
        const updatedAppointment = await appointments.updateStatus(appointmentId, newStatus);
        console.log('Appointment updated:', updatedAppointment);
        return updatedAppointment;
      } catch (error) {
        console.error('Update appointment status failed:', error);
        throw error;
      }
    },

    async cancelAppointment() {
      try {
        const appointmentId = 'appointment-id-789';
        await appointments.cancel(appointmentId);
        console.log('Appointment cancelled successfully');
      } catch (error) {
        console.error('Cancel appointment failed:', error);
        throw error;
      }
    },
  },
};

export default apiUsageExamples; 