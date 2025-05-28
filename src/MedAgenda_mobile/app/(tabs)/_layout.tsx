import { Tabs, useRouter, useSegments } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

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

  if (loading) {
    return null;
  }

  // Definir as tabs dinamicamente baseado no usuário
  const tabScreens = [
    {
      name: "index",
      title: 'Início',
      icon: 'home'
    },
    {
      name: "appointments",
      title: 'Consultas',
      icon: 'calendar'
    },
    {
      name: "doctors",
      title: 'Médicos',
      icon: 'doctor'
    },
    {
      name: "new-appointment",
      title: 'Nova Consulta',
      icon: 'plus'
    }
  ];

  // Adicionar tab de admin apenas se o usuário for admin
  if (user?.isAdmin) {
    tabScreens.push({
      name: "admin-doctors",
      title: 'Admin Médicos',
      icon: 'account-cog'
    });
  }

  // Adicionar tab de perfil por último
  tabScreens.push({
    name: "profile",
    title: 'Perfil',
    icon: 'account'
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        headerShown: false,
      }}
    >
      {tabScreens.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name={tab.icon as any} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
} 