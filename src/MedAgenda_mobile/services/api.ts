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
  fullName?: string;
  firstName?: string;
  username?: string;
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
  user: BackendUser[] | string;
  doctor: BackendDoctor[] | string;
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
  isAdmin: backendUser.isAdmin === true, // VERIFICAÇÃO RIGOROSA: apenas true explícito
  verified: backendUser.verified === true, // Mesma lógica rigorosa para verified
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
const transformAppointment = (backendAppointment: BackendAppointment): Appointment => {
  console.log('Transforming appointment:', backendAppointment);
  
  const status: AppointmentStatus = backendAppointment.cancelled ? 'cancelled' : 
          backendAppointment.isCompleted ? 'completed' : 'scheduled';
  
  // Handle user data - can be array or string
  let userId = '';
  let user: User | undefined;
  if (Array.isArray(backendAppointment.user) && backendAppointment.user.length > 0) {
    userId = backendAppointment.user[0]._id;
    user = transformUser(backendAppointment.user[0]);
  } else if (typeof backendAppointment.user === 'string') {
    userId = backendAppointment.user;
  }
  
  // Handle doctor data - can be array or string
  let doctorId = '';
  let doctor: Doctor | undefined;
  if (Array.isArray(backendAppointment.doctor) && backendAppointment.doctor.length > 0) {
    doctorId = backendAppointment.doctor[0]._id;
    doctor = transformDoctor(backendAppointment.doctor[0]);
  } else if (typeof backendAppointment.doctor === 'string') {
    doctorId = backendAppointment.doctor;
  }
  
  const result: Appointment = {
    id: backendAppointment._id,
    userId: userId,
    doctorId: doctorId,
    date: backendAppointment.slotDate,
    time: backendAppointment.slotTime,
    status: status,
    type: 'consultation' as AppointmentType,
    notes: '',
    doctor: doctor,
    user: user,
    amount: backendAppointment.amount,
    payment: backendAppointment.payment || false,
  };
  
  console.log('Transformed appointment:', result);
  return result;
};

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
          
          console.log('🔍 Decoded token:', decoded); // Debug log
          
          // Try to get user data from the response or make additional call
          let userData = response.data.user;
          console.log('📋 User data from response:', userData);
          
          // Enhanced name extraction - try multiple sources
          let extractedName = 'Usuário';
          
          // First, try from response data
          if (userData) {
            extractedName = userData.name || 
                          userData.fullName || 
                          userData.firstName || 
                          userData.username || 
                          extractedName;
            console.log('📝 Name from response data:', extractedName);
          }
          
          // If no name from response, try from decoded token
          if (extractedName === 'Usuário' && decoded) {
            extractedName = decoded.name || 
                          decoded.fullName ||
                          decoded.firstName ||
                          decoded.username || 
                          decoded.sub ||
                          extractedName;
            console.log('📝 Name from token:', extractedName);
          }
          
          // If still no name, try to extract from email (fallback)
          if (extractedName === 'Usuário') {
            const emailName = email.split('@')[0];
            if (emailName && emailName.length > 0) {
              // Capitalize first letter and replace dots/underscores with spaces
              extractedName = emailName
                .replace(/[._]/g, ' ')
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
              console.log('📝 Name from email:', extractedName);
            }
          }
          
          console.log('🎯 Final extracted name:', extractedName);
          
          // VERIFICAÇÃO RIGOROSA DO isAdmin - APENAS true explícito é considerado admin
          const isAdminFromResponse = userData?.isAdmin === true;
          const isAdminFromToken = decoded.isAdmin === true;
          
          // VERIFICAÇÃO ESPECÍFICA PARA O EMAIL ADMIN
          const isSpecificAdminEmail = email.toLowerCase().trim() === 'medagendaapi@gmail.com';
          
          // Se for o email específico do admin, forçar isAdmin = true
          const finalIsAdmin = isAdminFromResponse || isAdminFromToken || isSpecificAdminEmail;
          
          console.log('🔒 Admin verification:', {
            userDataIsAdmin: userData?.isAdmin,
            userDataIsAdminType: typeof userData?.isAdmin,
            tokenIsAdmin: decoded.isAdmin,
            tokenIsAdminType: typeof decoded.isAdmin,
            isAdminFromResponse,
            isAdminFromToken,
            isSpecificAdminEmail,
            finalIsAdmin
          });
          
          const user: User = {
            id: decoded.userId || decoded.id || decoded.sub || 'unknown',
            name: extractedName,
            email: userData?.email || decoded.email || email,
            isAdmin: finalIsAdmin, // Garantir que seja boolean e apenas true se explicitamente definido
            verified: userData?.verified === true || decoded.verified === true, // Mesma lógica rigorosa
          };
          
          console.log('✅ Final user object for storage:', user);
          console.log('🔒 User isAdmin final value:', user.isAdmin, 'Type:', typeof user.isAdmin);
          
          await AsyncStorage.setItem('user', JSON.stringify(user));
          
          return {
            token,
            user,
            message: message || 'Login successful',
          };
        } catch (decodeError) {
          console.error('❌ Token decode error:', decodeError);
          // If token decode fails, create user with email-based name
          const emailName = email.split('@')[0]
            .replace(/[._]/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          
          const user: User = {
            id: 'unknown',
            name: emailName || 'Usuário',
            email: email,
            isAdmin: false, // Sempre false em caso de erro
            verified: false,
          };
          
          console.log('🔄 Fallback user object:', user);
          console.log('🔒 Fallback user isAdmin:', user.isAdmin, 'Type:', typeof user.isAdmin);
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
    }
    // Note: Storage cleanup is handled by AuthContext
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
      console.log('🔍 Fetching doctor by ID:', id);
      console.log('🌐 API URL:', `${API_URL}/doctors/${id}`);
      
      const response = await api.get(`/doctors/${id}`);
      console.log('📋 Raw doctor response:', response.data);
      
      const doctorData = response.data.doctor || response.data;
      console.log('👨‍⚕️ Doctor data extracted:', doctorData);
      
      const transformedDoctor = transformDoctor(doctorData);
      console.log('✅ Transformed doctor:', transformedDoctor);
      
      return transformedDoctor;
    } catch (error) {
      console.error('❌ Error fetching doctor by ID:', error);
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
      console.log('🚀 [API] Iniciando criação de médico:', doctorData);
      
      // Mapear campos conforme esperado pelo backend
      const backendData = {
        name: doctorData.name,
        speciality: doctorData.speciality,
        crm: doctorData.crm,
        pricePerAppointment: doctorData.pricePerAppointment,
        doctorImage: doctorData.doctorImage || '',
        about: doctorData.about,
        // Campos opcionais com valores padrão
        email: `${doctorData.crm}@medagenda.com`,
        password: 'temp123',
        degree: 'Medicina',
        experience: '5 anos',
        address: {
          line1: 'Endereço não informado',
          line2: ''
        },
        available: true,
        date: Date.now(),
        slots_booked: {}
      };

      console.log('📤 [API] Dados a serem enviados:', backendData);
      
      const response = await api.post('/doctors', backendData);
      console.log('✅ [API] Resposta do backend:', response.data);
      
      const newDoctor = response.data.result || response.data.doctor || response.data;
      const transformedDoctor = transformDoctor(newDoctor);
      
      console.log('🎯 [API] Médico transformado:', transformedDoctor);
      return transformedDoctor;
    } catch (error: any) {
      console.error('❌ [API] Erro ao criar médico:', error);
      console.error('📋 [API] Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
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
      // Mapear campos para o formato que o backend espera
      const backendData: any = {};
      
      if (doctorData.name !== undefined) backendData.name = doctorData.name;
      if (doctorData.speciality !== undefined) backendData.speciality = doctorData.speciality;
      if (doctorData.pricePerAppointment !== undefined) backendData.pricePerAppointment = doctorData.pricePerAppointment;
      if (doctorData.doctorImage !== undefined) backendData.doctorImage = doctorData.doctorImage;
      if (doctorData.about !== undefined) backendData.about = doctorData.about;

      const response = await api.patch(`/doctors/${crm}`, backendData);
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
      console.log('🔍 Fetching appointments for user:', userId);
      
      // First, get all doctors to have a reference
      console.log('👨‍⚕️ Fetching all doctors for reference...');
      const allDoctorsResponse = await api.get('/doctors');
      const allDoctors = allDoctorsResponse.data.doctors || allDoctorsResponse.data || [];
      console.log('👨‍⚕️ Found doctors:', allDoctors.length);
      
      // Create a map of doctor ID to doctor data for quick lookup
      const doctorMap = new Map();
      allDoctors.forEach((doctor: any) => {
        const doctorId = doctor._id || doctor.id;
        if (doctorId) {
          doctorMap.set(doctorId, doctor);
          console.log(`👨‍⚕️ Mapped doctor: ${doctorId} -> ${doctor.name} (${doctor.speciality || doctor.specialty})`);
        }
      });
      
      // Use the correct endpoint discovered: /appointment with ?_id= parameter
      const response = await api.get(`/appointment?_id=${userId}`);
      const appointmentsData = response.data.appointments || response.data;
      
      console.log('📋 Raw appointments data:', appointmentsData);
      console.log('📊 Number of appointments:', appointmentsData.length);
      
      // Log the structure of the first appointment to understand the data format
      if (appointmentsData.length > 0) {
        console.log('🔍 First appointment structure:', JSON.stringify(appointmentsData[0], null, 2));
      }
      
      // Transform appointments and match with doctor data
      const transformedAppointments = await Promise.all(
        appointmentsData.map(async (appointment: any, index: number) => {
          console.log(`\n🔄 Processing appointment ${index + 1}:`, appointment);
          
          // Log all possible fields that might contain doctor ID
          console.log(`🔍 Appointment ${index + 1} - All fields:`, {
            doctor: appointment.doctor,
            docId: appointment.docId,
            doctorId: appointment.doctorId,
            doc: appointment.doc,
            physician: appointment.physician,
            medico: appointment.medico,
            _id: appointment._id,
            id: appointment.id
          });
          
          // Try to find doctor ID in various fields
          let doctorId: string | undefined;
          let foundDoctorData: any = null;
          
          // Check all possible fields where doctor ID might be stored
          const possibleDoctorFields = [
            appointment.doctor,
            appointment.docId,
            appointment.doctorId,
            appointment.doc,
            appointment.physician,
            appointment.medico
          ];
          
          for (const field of possibleDoctorFields) {
            if (field) {
              if (typeof field === 'string') {
                doctorId = field;
                foundDoctorData = doctorMap.get(doctorId);
                if (foundDoctorData) {
                  console.log(`✅ Appointment ${index + 1}: Found doctor by ID ${doctorId}:`, foundDoctorData.name);
                  break;
                }
              } else if (Array.isArray(field) && field.length > 0) {
                const firstItem = field[0];
                if (typeof firstItem === 'string') {
                  doctorId = firstItem;
                  foundDoctorData = doctorMap.get(doctorId);
                  if (foundDoctorData) {
                    console.log(`✅ Appointment ${index + 1}: Found doctor by array ID ${doctorId}:`, foundDoctorData.name);
                    break;
                  }
                } else if (firstItem && firstItem._id) {
                  doctorId = firstItem._id;
                  foundDoctorData = doctorMap.get(doctorId);
                  if (foundDoctorData) {
                    console.log(`✅ Appointment ${index + 1}: Found doctor by object ID ${doctorId}:`, foundDoctorData.name);
                    break;
                  }
                }
              } else if (field._id) {
                doctorId = field._id;
                foundDoctorData = doctorMap.get(doctorId);
                if (foundDoctorData) {
                  console.log(`✅ Appointment ${index + 1}: Found doctor by object._id ${doctorId}:`, foundDoctorData.name);
                  break;
                }
              }
            }
          }
          
          if (!foundDoctorData) {
            console.log(`❌ Appointment ${index + 1}: Could not find doctor data for any field`);
          }
          
          // Create appointment with found doctor data
          let appointmentWithDoctor: BackendAppointment;
          if (foundDoctorData) {
            appointmentWithDoctor = {
              ...appointment,
              doctor: [foundDoctorData]
            };
            console.log(`🔧 Appointment ${index + 1}: Created appointment with found doctor data`);
          } else {
            appointmentWithDoctor = appointment;
            console.log(`⚠️ Appointment ${index + 1}: Using original appointment (no doctor data found)`);
          }
          
          const transformed = transformAppointment(appointmentWithDoctor);
          console.log(`🎯 Appointment ${index + 1}: Final transformed appointment:`, {
            id: transformed.id,
            doctorId: transformed.doctorId,
            doctorName: transformed.doctor?.name,
            doctorSpecialty: transformed.doctor?.specialty,
            date: transformed.date,
            time: transformed.time,
            status: transformed.status
          });
          
          return transformed;
        })
      );
      
      console.log('\n📊 Final Results:');
      console.log('✅ Total appointments:', transformedAppointments.length);
      console.log('✅ Appointments with doctor data:', transformedAppointments.filter(a => a.doctor?.name).length);
      console.log('❌ Appointments without doctor data:', transformedAppointments.filter(a => !a.doctor?.name).length);
      
      // Log each final appointment for verification
      transformedAppointments.forEach((appointment, index) => {
        console.log(`📋 Final Appointment ${index + 1}:`, {
          doctorName: appointment.doctor?.name || 'NOT FOUND',
          doctorSpecialty: appointment.doctor?.specialty || 'NOT FOUND',
          date: appointment.date,
          time: appointment.time
        });
      });
      
      return transformedAppointments;
    } catch (error) {
      console.error('❌ Error in getByUserId:', error);
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
      // Try multiple possible endpoints for user profile
      const endpoints = ['/users/profile', '/user/profile', '/auth/profile', '/profile'];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying user profile endpoint: ${endpoint}`);
          const response = await api.get(endpoint);
          const userData = response.data.user || response.data;
          console.log(`✅ Successfully fetched user from ${endpoint}:`, userData);
          return transformUser(userData);
        } catch (endpointError: any) {
          console.log(`❌ Failed to fetch from ${endpoint}:`, endpointError.response?.status || endpointError.message);
          continue;
        }
      }
      
      // If all endpoints fail, throw error
      throw new Error('No user profile endpoint available');
    } catch (error) {
      console.warn('❌ All user profile endpoints failed:', error);
      throw handleApiError(error as AxiosError<ErrorResponse>);
    }
  },
};

// Helper function to fetch doctor data with multiple endpoint attempts
const fetchDoctorData = async (doctorId: string): Promise<BackendDoctor | null> => {
  const endpoints = [
    `/doctors/${doctorId}`,
    `/doctor/${doctorId}`,
    `/doctors?id=${doctorId}`,
    `/doctor?id=${doctorId}`
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Trying endpoint: ${endpoint}`);
      const response = await api.get(endpoint);
      const doctorData = response.data.doctor || response.data.result || response.data;
      
      if (doctorData && (doctorData._id || doctorData.id)) {
        console.log(`✅ Successfully fetched doctor from ${endpoint}:`, {
          id: doctorData._id || doctorData.id,
          name: doctorData.name,
          speciality: doctorData.speciality || doctorData.specialty
        });
        
        // Normalize the data structure
        return {
          _id: doctorData._id || doctorData.id,
          name: doctorData.name,
          email: doctorData.email,
          password: doctorData.password || '',
          image: doctorData.image || doctorData.doctorImage || '',
          speciality: doctorData.speciality || doctorData.specialty,
          degree: doctorData.degree || '',
          experience: doctorData.experience || '',
          about: doctorData.about || '',
          fees: doctorData.fees || doctorData.pricePerAppointment || 0,
          address: doctorData.address || { line1: '', line2: '' },
          date: doctorData.date || Date.now(),
          slots_booked: doctorData.slots_booked || doctorData.slotsBooked || {},
          available: doctorData.available !== false,
          crm: doctorData.crm || ''
        };
      }
    } catch (error: any) {
      console.log(`❌ Failed to fetch from ${endpoint}:`, error.response?.status || error.message);
    }
  }
  
  console.error(`❌ Failed to fetch doctor data from all endpoints for ID: ${doctorId}`);
  return null;
};

export default api; 