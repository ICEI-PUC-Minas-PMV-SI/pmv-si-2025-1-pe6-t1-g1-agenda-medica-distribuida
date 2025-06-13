export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
  image?: string;
  gender?: string;
  birthdate?: string;
  isAdmin?: boolean;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty?: string;
  email?: string;
  phone?: string;
  crm?: string;
  image?: string;
  degree?: string;
  pricePerAppointment?: number;
  fees?: number;
  experience?: string;
  rating?: number;
  patients?: string;
  about?: string;
  profileImage?: string;
  education?: Education[];
  availability?: Availability[];
  address?: {
    line1: string;
    line2: string;
  };
  location?: string;
  available?: boolean;
  slotsBooked?: Record<string, string[]>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface Availability {
  id: string;
  day: string;
  time: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId?: string;
  userId?: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type?: AppointmentType;
  notes?: string;
  amount?: number;
  payment?: boolean;
  createdAt?: string;
  updatedAt?: string;
  doctor?: Doctor;
  user?: User;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'scheduled' | 'completed' | 'cancelled';

export type AppointmentType = 'consultation' | 'followup' | 'checkup';

export interface LoginResponse {
  success?: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  gender?: string;
  birthdate?: string;
}

export interface AppointmentData {
  doctorId: string;
  patientId?: string;
  userId?: string;
  date: string;
  time: string;
  type?: AppointmentType;
  notes?: string;
}

export interface ProfileUpdateData {
  name?: string;
  phone?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
} 