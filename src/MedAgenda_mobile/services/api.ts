import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:3000/api'; // Change this to your actual API URL

const api = axios.create({
  baseURL: BASE_URL,
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
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      await AsyncStorage.removeItem('authToken');
      // You might want to redirect to login screen here
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('authToken', response.data.token);
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
  },
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export const appointmentService = {
  getAppointments: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },
  createAppointment: async (appointmentData: any) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },
  updateAppointment: async (id: string, appointmentData: any) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  },
  cancelAppointment: async (id: string) => {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  },
};

export const doctorService = {
  getDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },
  getDoctorById: async (id: string) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },
  getDoctorAvailability: async (id: string, date: string) => {
    const response = await api.get(`/doctors/${id}/availability`, {
      params: { date },
    });
    return response.data;
  },
};

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  updateProfileImage: async (imageFile: any) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await api.put('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api; 