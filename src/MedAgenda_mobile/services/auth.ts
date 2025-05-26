import api from './api';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  gender?: string;
  birthdate?: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface VerificationData {
  email: string;
  providedCode?: string;
}

interface ChangePasswordData {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const authService = {
  signUp: async (data: SignUpData) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInData) => {
    const response = await api.post('/api/auth/signin', data);
    return response.data;
  },

  signOut: async () => {
    const response = await api.post('/api/auth/signout');
    return response.data;
  },

  sendVerificationCode: async (data: VerificationData) => {
    const response = await api.patch('/api/auth/send-verification-code', data);
    return response.data;
  },

  verifyVerificationCode: async (data: VerificationData) => {
    const response = await api.patch('/api/auth/verify-verification-code', data);
    return response.data;
  },

  changePassword: async (data: ChangePasswordData) => {
    const response = await api.patch('/api/auth/change-password', data);
    return response.data;
  },
}; 