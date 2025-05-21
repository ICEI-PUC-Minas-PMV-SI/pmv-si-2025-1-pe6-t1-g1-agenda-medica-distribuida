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
    const response = await api.post<LoginResponse>('/api/auth/signin', { email, password });
    await AsyncStorage.setItem('authToken', response.data.token);
    return response.data;
  },
  logout: async (): Promise<void> => {
    await api.post('/api/auth/signout');
    await AsyncStorage.removeItem('authToken');
  },
  register: async (userData: RegisterData): Promise<User> => {
    const response = await api.post<User>('/api/auth/signup', userData);
    return response.data;
  },
  sendVerificationCode: async (email: string): Promise<void> => {
    await api.patch('/api/auth/send-verification-code', { email });
  },
  verifyEmail: async (email: string, providedCode: string): Promise<void> => {
    await api.patch('/api/auth/verify-verification-code', { email, providedCode });
  },
  resetPassword: async (email: string): Promise<void> => {
    await api.patch('/api/auth/reset-password', { email });
  },
  updatePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await api.patch('/api/auth/change-password', { oldPassword, newPassword });
  },
};

export const appointmentService = {
  getAppointments: async (status?: AppointmentStatus): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/api/appointment', {
      params: { status },
    });
    return response.data;
  },
  createAppointment: async (appointmentData: AppointmentData): Promise<Appointment> => {
    const response = await api.post<Appointment>('/api/appointment', appointmentData);
    return response.data;
  },
  cancelAppointment: async (userId: string, appointmentId: string): Promise<void> => {
    await api.post('/api/appointment/cancel', { userId, appointmentId });
  },
};

export const doctorService = {
  getDoctors: async (specialty?: string, search?: string): Promise<Doctor[]> => {
    const response = await api.get<Doctor[]>('/api/doctors', {
      params: { specialty, search },
    });
    return response.data;
  },
  getDoctorById: async (crm: string): Promise<Doctor> => {
    const response = await api.get<Doctor>(`/api/doctors/${crm}`);
    return response.data;
  },
  // Admin-only routes
  createDoctor: async (doctorData: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.post<Doctor>('/api/doctors', doctorData);
    return response.data;
  },
  updateDoctor: async (crm: string, doctorData: Partial<Doctor>): Promise<Doctor> => {
    const response = await api.patch<Doctor>(`/api/doctors/${crm}`, doctorData);
    return response.data;
  },
  deleteDoctor: async (crm: string): Promise<void> => {
    await api.delete(`/api/doctors/${crm}`);
  },
};

// Note: Profile routes are not shown in the backend documentation
// You may want to confirm with the backend team if these endpoints exist
export const profileService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/api/profile');
    return response.data;
  },
  updateProfile: async (profileData: ProfileUpdateData): Promise<User> => {
    const response = await api.put<User>('/api/profile', profileData);
    return response.data;
  },
  updateProfileImage: async (imageFile: FormData): Promise<User> => {
    const response = await api.put<User>('/api/profile/image', imageFile, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api; 