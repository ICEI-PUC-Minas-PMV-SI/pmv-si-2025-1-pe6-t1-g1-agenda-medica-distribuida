export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  patients: string;
  about: string;
  profileImage?: string;
  education: Education[];
  availability: Availability[];
  location: string;
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
  userId: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: AppointmentType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  doctor?: Doctor;
  user?: User;
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum AppointmentType {
  CONSULTATION = 'consultation',
  FOLLOWUP = 'followup',
  CHECKUP = 'checkup'
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AppointmentData {
  doctorId: string;
  date: string;
  time: string;
  type: AppointmentType;
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