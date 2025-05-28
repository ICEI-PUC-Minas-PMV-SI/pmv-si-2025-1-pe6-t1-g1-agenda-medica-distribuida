import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/api';
import { User, LoginResponse, RegisterData } from '../types/api';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (userData: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredData();
  }, []);

  async function loadStoredData() {
    try {
      const storedUser = await AsyncStorage.getItem('@MedAgenda:user');
      const storedToken = await AsyncStorage.getItem('@MedAgenda:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await auth.login(email, password);
      const { token } = response;

      // A API só retorna o token, não os dados do usuário
      // Vamos criar um objeto básico do usuário com o email
      const userData = {
        email: email,
        name: email.split('@')[0], // Nome temporário baseado no email
        id: 'temp-id' // ID temporário
      };

      await AsyncStorage.setItem('@MedAgenda:token', token);
      await AsyncStorage.setItem('@MedAgenda:user', JSON.stringify(userData));

      setUser(userData as User);
    } catch (error) {
      throw error;
    }
  }

  async function signUp(userData: RegisterData) {
    try {
      const response = await auth.register(userData);
      
      // A API de registro retorna apenas success, não token nem user
      // Após o registro, fazer login automaticamente
      await signIn(userData.email, userData.password);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      await AsyncStorage.removeItem('@MedAgenda:token');
      await AsyncStorage.removeItem('@MedAgenda:user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 