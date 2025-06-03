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
  updateUser: (userData: Partial<User>) => Promise<void>;
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
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('authToken');

      console.log('🔍 AuthContext - Loading stored data...');
      console.log('📦 Stored user string:', storedUser);
      console.log('🔑 Token exists:', !!storedToken);

      if (storedUser && storedToken) {
        const parsedUser = JSON.parse(storedUser);
        
        // Verificação rigorosa do isAdmin ao carregar dados armazenados
        const sanitizedUser: User = {
          ...parsedUser,
          isAdmin: parsedUser.isAdmin === true, // Garantir que seja boolean true
          verified: parsedUser.verified === true
        };
        
        console.log('🔍 AuthContext - Parsed user:', parsedUser);
        console.log('🔒 AuthContext - Original isAdmin:', parsedUser.isAdmin, 'Type:', typeof parsedUser.isAdmin);
        console.log('🔒 AuthContext - Sanitized isAdmin:', sanitizedUser.isAdmin, 'Type:', typeof sanitizedUser.isAdmin);
        
        setUser(sanitizedUser);
      } else {
        console.log('❌ AuthContext - No stored user or token found');
      }
    } catch (error) {
      console.error('❌ AuthContext - Error loading stored data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      console.log('🔐 AuthContext - Starting sign in for:', email);
      const response = await auth.login(email, password);
      
      if (response.token && response.user) {
        // Verificação adicional do isAdmin no contexto
        const sanitizedUser: User = {
          ...response.user,
          isAdmin: response.user.isAdmin === true, // Garantir que seja boolean true
          verified: response.user.verified === true
        };
        
        console.log('🔍 AuthContext - Login response user:', response.user);
        console.log('🔒 AuthContext - Response isAdmin:', response.user.isAdmin, 'Type:', typeof response.user.isAdmin);
        console.log('🔒 AuthContext - Sanitized isAdmin:', sanitizedUser.isAdmin, 'Type:', typeof sanitizedUser.isAdmin);
        
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(sanitizedUser));
        setUser(sanitizedUser);
        
        console.log('✅ AuthContext - User set successfully:', sanitizedUser);
      } else {
        throw new Error('Login failed: No token or user data received');
      }
    } catch (error) {
      console.error('❌ AuthContext - Sign in error:', error);
      throw error;
    }
  }

  async function signUp(userData: RegisterData) {
    try {
      console.log('📝 AuthContext - Starting sign up for:', userData.email);
      const response = await auth.register(userData);
      
      // Auto-login after successful registration
      await signIn(userData.email, userData.password);
    } catch (error) {
      console.error('❌ AuthContext - Sign up error:', error);
      throw error;
    }
  }

  async function signOut() {
    try {
      console.log('🚪 AuthContext - Starting sign out');
      // Call API logout first
      await auth.logout();
    } catch (error) {
      console.error('❌ AuthContext - Error calling API logout:', error);
      // Continue with local logout even if API call fails
      // Don't throw error here to avoid blocking the logout process
    }
    
    // Always clear local storage and set user to null
    try {
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('user');
      setUser(null);
      console.log('✅ AuthContext - Sign out completed');
    } catch (error) {
      console.error('❌ AuthContext - Error clearing local storage:', error);
      // Even if storage clearing fails, set user to null to trigger navigation
      setUser(null);
    }
  }

  async function updateUser(userData: Partial<User>) {
    try {
      if (!user) return;
      
      console.log('🔄 AuthContext - Updating user with:', userData);
      
      const updatedUser = { 
        ...user, 
        ...userData,
        // Garantir que isAdmin seja sempre boolean se fornecido
        isAdmin: userData.isAdmin !== undefined ? userData.isAdmin === true : user.isAdmin
      } as User;
      
      console.log('🔒 AuthContext - Updated user isAdmin:', updatedUser.isAdmin, 'Type:', typeof updatedUser.isAdmin);
      
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      console.log('✅ AuthContext - User updated successfully:', updatedUser);
    } catch (error) {
      console.error('❌ AuthContext - Error updating user:', error);
      throw error;
    }
  }

  // Log do usuário atual sempre que mudar
  useEffect(() => {
    if (user) {
      console.log('👤 AuthContext - Current user changed:', {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAdminType: typeof user.isAdmin,
        verified: user.verified
      });
    } else {
      console.log('👤 AuthContext - No current user');
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp, updateUser }}>
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