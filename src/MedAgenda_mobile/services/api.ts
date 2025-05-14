import axios, { AxiosError } from 'axios';
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
} from '../types/api';

interface ErrorResponse {
  message: string;
  code?: string;
}

const env = getEnvVars();

const api = axios.create({
  baseURL: env.API_URL,
  timeout: env.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(handleApiError(error));
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // You might want to redirect to login screen here
    }
    return Promise.reject(handleApiError(error));
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
      message: 'No response from server',
      code: 'NETWORK_ERROR',
      status: 0,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    };
  }
};

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    await AsyncStorage.setItem('authToken', response.data.token);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
  },
  register: async (userData: RegisterData): Promise<User> => {
    const response = await api.post<User>('/auth/register', userData);
    return response.data;
  },
};

export const appointmentService = {
  getAppointments: async (status?: AppointmentStatus): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/appointments', {
      params: { status },
    });
    return response.data;
  },
  createAppointment: async (appointmentData: AppointmentData): Promise<Appointment> => {
    const response = await api.post<Appointment>('/appointments', appointmentData);
    return response.data;
  },
  updateAppointment: async (id: string, appointmentData: Partial<AppointmentData>): Promise<Appointment> => {
    const response = await api.put<Appointment>(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  cancelAppointment: async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
  getAppointmentById: async (id: string): Promise<Appointment> => {
    const response = await api.get<Appointment>(`/appointments/${id}`);
    return response.data;
  },
};

export const doctorService = {
  getDoctors: async (specialty?: string, search?: string): Promise<Doctor[]> => {
    const response = await api.get<Doctor[]>('/doctors', {
      params: { specialty, search },
    });
    return response.data;
  },
  getDoctorById: async (id: string): Promise<Doctor> => {
    const response = await api.get<Doctor>(`/doctors/${id}`);
    return response.data;
  },
  getDoctorAvailability: async (id: string, date: string): Promise<string[]> => {
    const response = await api.get<string[]>(`/doctors/${id}/availability`, {
      params: { date },
    });
    return response.data;
  },
  getDoctorSpecialties: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/doctors/specialties');
    return response.data;
  },
};

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