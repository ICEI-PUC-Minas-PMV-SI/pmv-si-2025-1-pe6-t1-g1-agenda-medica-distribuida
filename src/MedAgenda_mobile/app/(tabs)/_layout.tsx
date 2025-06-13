import { Tabs, useRouter, useSegments } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === '(auth)';
      if (!user && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }
  }, [user, loading, segments]);

  // Debug log mais detalhado
  useEffect(() => {
    if (user) {
      console.log('🔍 TabLayout - User Debug Info:', {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isAdminType: typeof user.isAdmin,
        isAdminStrictCheck: user.isAdmin === true,
        userObject: user
      });
      
      // Forçar re-renderização quando usuário mudar
      setForceUpdate(prev => prev + 1);
    } else {
      console.log('🔍 TabLayout - No user found');
    }
  }, [user]);

  // Forçar re-renderização quando loading mudar
  useEffect(() => {
    if (!loading) {
      setForceUpdate(prev => prev + 1);
    }
  }, [loading]);

  // Adicionar um delay para garantir que o contexto seja totalmente carregado
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceUpdate(prev => prev + 1);
    }, 100);
    return () => clearTimeout(timer);
  }, [user?.isAdmin]);

  if (loading) {
    console.log('🔄 TabLayout - Still loading...');
    return null;
  }

  // Debug logs simplificados
  console.log('🔒 VERIFICAÇÃO DE ADMIN:', {
    userName: user?.name,
    userEmail: user?.email,
    isAdminRaw: user?.isAdmin,
    isAdminType: typeof user?.isAdmin,
    isAdminStrictCheck: user?.isAdmin === true,
  });

  const isAdmin = user?.isAdmin === true;
  
  if (isAdmin) {
    console.log('✅ TAB ADMIN será exibida para usuário admin:', user?.name);
  } else {
    console.log('❌ TAB ADMIN será OCULTADA para usuário comum:', user?.name);
  }

  return (
    <Tabs
      key={`tabs-${forceUpdate}-${user?.id || 'no-user'}-${user?.isAdmin || 'no-admin'}`}
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
        },
        headerShown: false,
      }}
    >
      {/* Tabs que sempre aparecem */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: 'Consultas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          title: 'Médicos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="doctor" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="new-appointment"
        options={{
          title: 'Nova Consulta',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" size={size} color={color} />
          ),
        }}
      />
      
      {/* Tab Admin - só aparece para administradores */}
      {user?.isAdmin === true && (
        <Tabs.Screen
          name="admin-doctors"
          options={{
            title: 'Admin Médicos',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-cog" size={size} color={color} />
            ),
          }}
        />
      )}
      
      {/* Tab Admin - OCULTAR explicitamente se não for admin */}
      {user?.isAdmin !== true && (
        <Tabs.Screen
          name="admin-doctors"
          options={{
            href: null, // Isso remove o tab da navegação
            title: 'Admin Médicos',
          }}
        />
      )}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 