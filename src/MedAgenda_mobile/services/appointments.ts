import api from './api';

interface AppointmentCreate {
  userId: string;
  docId: string;
  slotDate: string; // YYYY-MM-DD
  slotTime: string; // HH:MM
}

interface AppointmentCancel {
  userId: string;
  appointmentId: string;
}

interface AppointmentFilters {
  _id?: string;
}

export const appointmentService = {
  createAppointment: async (data: AppointmentCreate) => {
    const response = await api.post('/api/appointment', data);
    return response.data;
  },

  cancelAppointment: async (data: AppointmentCancel) => {
    const response = await api.post('/api/appointment/cancel', data);
    return response.data;
  },

  getAppointments: async (filters?: AppointmentFilters) => {
    const response = await api.get('/api/appointment', { params: filters });
    return response.data;
  },
}; 