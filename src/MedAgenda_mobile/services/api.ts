import axios, { AxiosRequestConfig, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEnvVars from '../config/env';
import {
  User,
  Doctor,
  Appointment,
  LoginResponse,
  RegisterData,
  AppointmentData,
  ProfileUpdateData,
  ApiError,
  AppointmentStatus,
  AppointmentType,
} from '../types/api';

// Export types for use in other files
export type { 
  User, 
  Doctor, 
  Appointment, 
  AppointmentStatus, 
  AppointmentType, 
  LoginResponse, 
  RegisterData, 
  AppointmentData, 
  ProfileUpdateData, 
  ApiError 
};

interface ErrorResponse {
  message: string;
  code?: string;
}

interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Backend data structures based on actual API responses
interface BackendUser {
  _id: string;
  name: string;
  email: string;
  gender?: string;
  birthdate?: string;
  userImage?: string;
  isAdmin?: boolean;
  verified?: boolean;
}

interface BackendDoctor {
  _id: string;
  name: string;
  email: string;
  password: string;
  image: string;
  speciality: string; // Note: backend uses 'speciality' not 'specialty'
  degree: string;
  experience: string;
  about: string;
  fees: number;
  address: {
    line1: string;
    line2: string;
  };
  date: number;
  slots_booked: Record<string, string[]>;
  available: boolean;
  crm: string;
}

interface BackendAppointment {
  _id: string;
  user: BackendUser[];
  doctor: BackendDoctor[];
  slotDate: string;
  slotTime: string;
  amount?: number;
  date?: number;
  cancelled?: boolean;
  payment?: boolean;
  isCompleted?: boolean;
  __v?: number;
}

const { API_URL, API_TIMEOUT } = getEnvVars();

const api = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Header necessário para o middleware de identificação do backend
    config.headers.client = 'not-browser';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      AsyncStorage.removeItem('authToken');
      AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Error handler
const handleApiError = (error: AxiosError<ErrorResponse>): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || 'An error occurred',
      status: error.response.status,
    };
  } else if (error.request) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  } else {
    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };
  }
};

// Transform backend user to frontend user
const transformUser = (backendUser: BackendUser): User => ({
  id: backendUser._id,
  name: backendUser.name,
  email: backendUser.email,
  gender: backendUser.gender,
  birthdate: backendUser.birthdate,
  image: backendUser.userImage,
  isAdmin: backendUser.isAdmin || false,
  verified: backendUser.verified || false,
});

// Transform backend doctor to frontend doctor
const transformDoctor = (backendDoctor: BackendDoctor): Doctor => ({
  id: backendDoctor._id,
  name: backendDoctor.name,
  email: backendDoctor.email,
  image: backendDoctor.image,
  specialty: backendDoctor.speciality, // Map speciality to specialty
  degree: backendDoctor.degree,
  experience: backendDoctor.experience,
  about: backendDoctor.about,
  fees: backendDoctor.fees,
  address: backendDoctor.address,
  available: backendDoctor.available,
  crm: backendDoctor.crm,
  education: [], // Backend doesn't have education array, so provide empty array
  slotsBooked: backendDoctor.slots_booked || {},
});

// Transform backend appointment to frontend appointment
const transformAppointment = (backendAppointment: BackendAppointment): Appointment => ({
  id: backendAppointment._id,
  userId: backendAppointment.user[0]._id,
  doctorId: backendAppointment.doctor[0]._id,
  date: backendAppointment.slotDate,
  time: backendAppointment.slotTime,
  status: backendAppointment.cancelled ? 'cancelled' : 
          backendAppointment.isCompleted ? 'completed' : 'scheduled',
  type: 'consultation' as AppointmentType,
  notes: '',
  doctor: backendAppointment.doctor.length > 0 ? transformDoctor(backendAppointment.doctor[0]) : undefined,
  user: backendAppointment.user.length > 0 ? transformUser(backendAppointment.user[0]) : undefined,
  amount: backendAppointment.amount,
  payment: backendAppointment.payment || false,
});

// Authentication API
export const auth = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/signin', { email, password });
      const { token, message } = response.data;
      
      if (token) {
        await AsyncStorage.setItem('authToken', token);
        
        // Decode token to get user info
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          const decoded = JSON.parse(jsonPayload);
          
          const user: User = {
            id: decoded.userId,
            name: decoded.name || 'User',
            email: decoded.email,
            isAdmin: decoded.isAdmin || false,
            verified: decoded.verified || false,
          };
          
          await AsyncStorage.setItem('user', JSON.stringify(user));
          
          return {
            token,
            user,
            message: message || 'Login successful',
          };
        } catch (decodeError) {
          // If token decode fails, still return success but with minimal user info
          const user: User = {
            id: 'unknown',
            name: 'User',
            email: email,
            isAdmin: false,
            verified: false,
          };
          
          await AsyncStorage.setItem('user', JSON.stringify(user));
          
          return {
            token,
            user,
            message: message || 'Login successful',
          };
        }
      }
      
      throw new Error('No token received');
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const response = await api.post('/auth/signup', data);
      
      // After successful registration, automatically login
      return await this.login(data.email, data.password);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/signout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/change-password', { 
        oldPassword, 
        newPassword 
      });
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },
};

// Doctors API
export const doctors = {
  async getAll(): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors');
      const doctorsData = response.data.doctors || response.data;
      return doctorsData.map(transformDoctor);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getById(id: string): Promise<Doctor> {
    try {
      const response = await api.get(`/doctors/${id}`);
      const doctorData = response.data.doctor || response.data;
      return transformDoctor(doctorData);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getBySpecialty(specialty: string): Promise<Doctor[]> {
    try {
      const allDoctors = await this.getAll();
      return allDoctors.filter(doctor => 
        doctor.specialty?.toLowerCase().includes(specialty.toLowerCase())
      );
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getSpecialties(): Promise<string[]> {
    try {
      const allDoctors = await this.getAll();
      const specialties = allDoctors
        .map(doctor => doctor.specialty)
        .filter((specialty): specialty is string => !!specialty)
        .filter((specialty, index, array) => array.indexOf(specialty) === index) // Remove duplicates
        .sort();
      return specialties;
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  // Admin methods - require admin privileges
  async createDoctor(doctorData: {
    name: string;
    speciality: string;
    crm: string;
    pricePerAppointment: number;
    doctorImage?: string;
    about: string;
  }): Promise<Doctor> {
    try {
      const response = await api.post('/doctors', doctorData);
      const newDoctor = response.data.result || response.data.doctor || response.data;
      return transformDoctor(newDoctor);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async updateDoctor(crm: string, doctorData: {
    name?: string;
    speciality?: string;
    pricePerAppointment?: number;
    doctorImage?: string;
    about?: string;
  }): Promise<Doctor> {
    try {
      const response = await api.patch(`/doctors/${crm}`, doctorData);
      const updatedDoctor = response.data.doctor || response.data;
      return transformDoctor(updatedDoctor);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async deleteDoctor(crm: string): Promise<void> {
    try {
      await api.delete(`/doctors/${crm}`);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },
};

// Appointments API
export const appointments = {
  async create(data: AppointmentData): Promise<Appointment> {
    try {
      const appointmentData = {
        userId: data.userId,
        docId: data.doctorId,
        slotDate: data.date,
        slotTime: data.time,
      };

      const response = await api.post('/appointment', appointmentData);
      const appointmentResult = response.data.newAppointment || response.data.appointment || response.data;
      return transformAppointment(appointmentResult);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getByUserId(userId: string): Promise<Appointment[]> {
    try {
      // Use the correct endpoint discovered: /appointment with ?_id= parameter
      const response = await api.get(`/appointment?_id=${userId}`);
      const appointmentsData = response.data.appointments || response.data;
      return appointmentsData.map(transformAppointment);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getById(id: string): Promise<Appointment> {
    try {
      const response = await api.get(`/appointment/${id}`);
      const appointmentData = response.data.appointment || response.data;
      return transformAppointment(appointmentData);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async cancel(id: string): Promise<void> {
    try {
      // Get current user to include userId in the request
      const user = await auth.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      await api.post('/appointment/cancel', { 
        appointmentId: id,
        userId: user.id 
      });
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    try {
      const response = await api.put(`/appointment/${id}`, { status });
      const appointmentData = response.data.appointment || response.data;
      return transformAppointment(appointmentData);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },
};

// Users API
export const users = {
  async updateProfile(data: ProfileUpdateData): Promise<User> {
    try {
      const response = await api.put('/users/profile', data);
      const userData = response.data.user || response.data;
      const updatedUser = transformUser(userData);
      
      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/users/profile');
      const userData = response.data.user || response.data;
      return transformUser(userData);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },
};

export default api; 