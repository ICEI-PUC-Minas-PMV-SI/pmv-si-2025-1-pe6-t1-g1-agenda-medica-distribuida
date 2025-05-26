import api from './api';

interface Doctor {
  name: string;
  speciality: string;
  crm: string;
  pricePerAppointment: number;
  doctorImage?: string;
  about?: string;
  scheduledAppointments?: Record<string, string[]>;
}

interface DoctorUpdateData {
  speciality?: string;
  pricePerAppointment?: number;
  doctorImage?: string;
  about?: string;
}

interface DoctorFilters {
  speciality?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  [key: string]: any;
}

export const doctorService = {
  createDoctor: async (data: Doctor) => {
    const response = await api.post('/api/doctors', data);
    return response.data;
  },

  updateDoctor: async (crm: string, data: DoctorUpdateData) => {
    const response = await api.patch(`/api/doctors/${crm}`, data);
    return response.data;
  },

  deleteDoctor: async (crm: string) => {
    const response = await api.delete(`/api/doctors/${crm}`);
    return response.data;
  },

  getDoctors: async (filters?: DoctorFilters) => {
    const response = await api.get('/api/doctors', { params: filters });
    return response.data;
  },
}; 