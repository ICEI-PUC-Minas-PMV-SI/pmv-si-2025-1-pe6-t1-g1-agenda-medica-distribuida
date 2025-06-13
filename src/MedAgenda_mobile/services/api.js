import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@MedAgenda:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Doctor services
export const getDoctors = async (specialty = '') => {
  try {
    const response = await api.get(`/doctors${specialty ? `?specialty=${specialty}` : ''}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDoctorById = async (id) => {
  try {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSpecialties = async () => {
  try {
    const response = await api.get('/doctors/specialties');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Appointment services
export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointments = async (status = '') => {
  try {
    const response = await api.get(`/appointments${status ? `?status=${status}` : ''}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await api.delete(`/appointments/${appointmentId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Auth services
export const signIn = async (email, password) => {
  try {
    const response = await api.post('/users/signin', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (userData) => {
  try {
    const response = await api.post('/users/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api; 