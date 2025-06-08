import { Tabs, useRouter, useSegments } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState, useMemo } from 'react';
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

  if (loading) {
    return null;
  }

  // Usar useMemo para garantir que as tabs sejam recalculadas quando o usuário mudar
  const tabScreens = useMemo(() => {
    console.log('🔄 Recalculando tabs para usuário:', user?.name, 'isAdmin:', user?.isAdmin);
    
    // TABS BASE QUE SEMPRE APARECEM
    const screens = [
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

    // VERIFICAÇÃO ESPECÍFICA PARA ADMIN
    const userEmail = user?.email?.toLowerCase()?.trim() || '';
    
    // Email específico do administrador
    const adminEmail = 'medagendaapi@gmail.com';
    
    // Verificar se é o usuário admin específico E tem flag isAdmin
    const isSpecificAdmin = userEmail === adminEmail && user?.isAdmin === true;
    
    console.log('🔒 VERIFICAÇÃO DE ADMIN ESPECÍFICO:', {
      userEmail: userEmail,
      adminEmail: adminEmail,
      isEmailMatch: userEmail === adminEmail,
      hasAdminFlag: user?.isAdmin === true,
      isSpecificAdmin: isSpecificAdmin
    });

    // Adicionar tab admin apenas para o usuário específico
    if (isSpecificAdmin) {
      console.log('✅ ADMIN TAB SERÁ ADICIONADA para usuário admin:', user?.name);
      screens.push({
        name: "admin-doctors",
        title: 'Admin Médicos',
        icon: 'account-cog'
      });
    } else {
      console.log('❌ ADMIN TAB NÃO SERÁ ADICIONADA para usuário:', user?.name, 'email:', userEmail);
    }

    // Adicionar tab de perfil por último
    screens.push({
      name: "profile",
      title: 'Perfil',
      icon: 'account'
    });
    
    console.log('📋 Tabs finais:', screens.map(tab => tab.name));
    
    return screens;
  }, [user, forceUpdate]);

  console.log('🎬 Renderizando TabLayout com', tabScreens.length, 'tabs');
  console.log('🎬 Tabs sendo renderizadas:', tabScreens.map(tab => tab.name));

  return (
    <Tabs
      key={`tabs-${forceUpdate}-${user?.email || 'no-user'}`}
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