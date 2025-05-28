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

// Interfaces específicas do backend
interface BackendDoctor {
  _id: string;
  name: string;
  speciality: string;
  crm: string;
  pricePerAppointment: number;
  createdAt: string;
  updatedAt: string;
}

interface BackendAppointment {
  _id: string;
  user: string;
  doctor: string;
  slotDate: string;
  slotTime: string;
  cancelled: boolean;
  createdAt: string;
  updatedAt: string;
}

const env = getEnvVars();

const api = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'client': 'not-browser',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('@MedAgenda:token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(handleApiError(error as AxiosError<ErrorResponse>));
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponse>) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('@MedAgenda:token');
      await AsyncStorage.removeItem('@MedAgenda:user');
      // Redirect to login screen
    }
    return Promise.reject(error);
  }
);

const handleApiError = (error: AxiosError<ErrorResponse>): ApiError => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      message: error.response.data?.message || 'An error occurred',
      code: error.response.data?.code,
      status: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'Network error. Please check your connection.',
      code: 'NETWORK_ERROR',
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
};

// Auth endpoints
export const auth = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<{ token: string }>('/auth/signin', { email, password });
    await AsyncStorage.setItem('@MedAgenda:token', response.data.token);
    return { 
      success: true,
      message: 'Login successful',
      token: response.data.token, 
      user: { id: '', email, name: '', createdAt: '', updatedAt: '' } 
    };
  },
  logout: async (): Promise<{ success: boolean; message: string }> => {
    await AsyncStorage.removeItem('@MedAgenda:token');
    await AsyncStorage.removeItem('@MedAgenda:user');
    const response = await api.post<{ success: boolean; message: string }>('/auth/signout');
    return response.data;
  },
  register: async (userData: RegisterData): Promise<{ success: boolean; email: string }> => {
    const response = await api.post<{ success: boolean; email: string }>('/auth/signup', userData);
    return response.data;
  },
  sendVerificationCode: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>('/auth/send-verification-code', { email });
    return response.data;
  },
  verifyCode: async (email: string, code: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>('/auth/verify-code', { email, code });
    return response.data;
  },
  changePassword: async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
  sendForgotPasswordCode: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch('/auth/send-forgot-password-code', { email });
    return response.data;
  },
  resetPassword: async (email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch<{ success: boolean; message: string }>('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  },
};

// Funções de transformação de dados
function transformBackendDoctor(backendDoctor: BackendDoctor): Doctor {
  return {
    id: backendDoctor._id,
    name: backendDoctor.name,
    specialty: backendDoctor.speciality,
    email: 'N/A',
    phone: 'N/A',
    crm: backendDoctor.crm,
    pricePerAppointment: backendDoctor.pricePerAppointment,
    createdAt: backendDoctor.createdAt,
    updatedAt: backendDoctor.updatedAt,
  };
}

function transformBackendAppointment(backendAppointment: BackendAppointment): Appointment {
  return {
    id: backendAppointment._id,
    doctorId: backendAppointment.doctor,
    patientId: backendAppointment.user,
    date: backendAppointment.slotDate,
    time: backendAppointment.slotTime,
    status: backendAppointment.cancelled ? AppointmentStatus.CANCELLED : AppointmentStatus.SCHEDULED,
    notes: '',
    createdAt: backendAppointment.createdAt,
    updatedAt: backendAppointment.updatedAt,
  };
}

// Doctors endpoints (corrigidos para a estrutura real do backend)
export const doctors = {
  async getAll(): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors');
      const backendDoctors: BackendDoctor[] = response.data.doctors;
      return backendDoctors.map(transformBackendDoctor);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getById(id: string): Promise<Doctor> {
    try {
      const response = await api.get(`/doctors/${id}`);
      return transformBackendDoctor(response.data.doctor);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getBySpecialty(specialty: string): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors', {
        params: { speciality: specialty }
      });
      const backendDoctors: BackendDoctor[] = response.data.doctors;
      return backendDoctors.map(transformBackendDoctor);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getSpecialties(): Promise<string[]> {
    try {
      // Como não existe endpoint específico, vamos extrair das especialidades dos médicos
      const response = await api.get('/doctors');
      const backendDoctors: BackendDoctor[] = response.data.doctors;
      const specialties = [...new Set(backendDoctors.map(doctor => doctor.speciality))];
      return specialties;
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async search(query: string): Promise<Doctor[]> {
    try {
      const response = await api.get('/doctors', {
        params: { search: query }
      });
      const backendDoctors: BackendDoctor[] = response.data.doctors;
      return backendDoctors.map(transformBackendDoctor);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  create: async (doctorData: {
    name: string;
    speciality: string;
    crm: string;
    pricePerAppointment: number;
    doctorImage?: string;
    about: string;
  }): Promise<BackendDoctor> => {
    const response = await api.post<{ success: boolean; result: BackendDoctor }>('/doctors', doctorData);
    return response.data.result;
  },

  update: async (crm: string, updates: {
    speciality?: string;
    pricePerAppointment?: number;
    doctorImage?: string;
    about?: string;
  }): Promise<{ success: boolean; message: string }> => {
    const response = await api.patch(`/doctors/${crm}`, updates);
    return response.data;
  },

  delete: async (crm: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/doctors/${crm}`);
    return response.data;
  },
};

// Appointments endpoints (corrigidos para usar /appointment no singular)
export const appointments = {
  async getAll(userId?: string): Promise<Appointment[]> {
    try {
      const params = userId ? { _id: userId } : {};
      const response = await api.get('/appointment', { params });
      const backendAppointments: BackendAppointment[] = response.data.appointments;
      return backendAppointments.map(transformBackendAppointment);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getById(id: string): Promise<Appointment> {
    try {
      const response = await api.get(`/appointment/${id}`);
      return transformBackendAppointment(response.data.appointment);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async create(data: AppointmentData): Promise<Appointment> {
    try {
      // Transformar dados do frontend para o formato da API
      const backendData = {
        userId: data.patientId,
        docId: data.doctorId, // Assumindo que é o CRM
        slotDate: data.date,
        slotTime: data.time,
      };
      
      console.log('API: Enviando dados para criação:', backendData);
      
      const response = await api.post('/appointment', backendData, {
        timeout: 20000, // 20 segundos timeout
        headers: {
          'Authorization': `Bearer ${await AsyncStorage.getItem('@MedAgenda:token')}`,
        }
      });
      
      console.log('API: Resposta da criação:', response.data);
      return transformBackendAppointment(response.data.appointment);
    } catch (error) {
      console.error('API: Erro na criação:', error);
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async cancel(id: string): Promise<void> {
    try {
      await api.patch(`/appointment/${id}`, { cancelled: true });
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },

  async getByPatient(patientId: string): Promise<Appointment[]> {
    try {
      const response = await api.get('/appointment', {
        params: { _id: patientId }
      });
      const backendAppointments: BackendAppointment[] = response.data.appointments;
      return backendAppointments.map(transformBackendAppointment);
    } catch (error) {
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },
};

// Patients endpoints
export const patients = {
  getAll: async (): Promise<Patient[]> => {
    const response = await api.get<Patient[]>('/patients');
    return response.data;
  },
  getById: async (id: string): Promise<Patient> => {
    const response = await api.get<Patient>(`/patients/${id}`);
    return response.data;
  },
  update: async (id: string, patientData: Partial<Patient>): Promise<Patient> => {
    const response = await api.put<Patient>(`/patients/${id}`, patientData);
    return response.data;
  },
};

// Profile service
export const profileService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/profile');
    return response.data;
  },
  updateProfile: async (profileData: ProfileUpdateData): Promise<User> => {
    const response = await api.put<User>('/profile', profileData);
    return response.data;
  },
  updateProfileImage: async (imageFile: FormData): Promise<User> => {
    const response = await api.put<User>('/profile/image', imageFile, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api; 