export interface User {
  _id: string;
  name: string;
  email: string;
  gender?: string;
  birthdate?: string;
  userImage?: string;
  isAdmin: boolean;
  verified: boolean;
}

export interface Doctor {
  _id: string;
  name: string;
  speciality: string;
  crm: string;
  pricePerAppointment: number;
  doctorImage?: string;
  about?: string;
  scheduledAppointments: {
    [date: string]: string[];
  };
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
  _id: string;
  user: string;
  doctor: string;
  amount: number;
  slotTime: string;
  slotDate: string;
  date: string;
  cancelled: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  gender?: string;
  birthdate?: string;
  userImage?: string;
}

export interface AppointmentData {
  userId: string;
  docId: string;
  slotDate: string;
  slotTime: string;
}

export interface ProfileUpdateData {
  name?: string;
  gender?: string;
  birthdate?: string;
  userImage?: string;
}

export type AppointmentStatus = 'upcoming' | 'past' | 'cancelled';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
} 