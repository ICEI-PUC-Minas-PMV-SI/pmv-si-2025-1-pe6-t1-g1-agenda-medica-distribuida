import { Tabs, useRouter, useSegments } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

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
    const baseScreens = [
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

    // LISTA EXPANDIDA DE EMAILS QUE NUNCA DEVEM TER ACESSO ADMIN (BLACKLIST ABSOLUTA)
    const nonAdminEmails = [
      'filo@gmail.com',
      'user@test.com',
      'teste@gmail.com',
      'normal@user.com',
      'test@test.com',
      'usuario@teste.com'
    ];

    // VERIFICAÇÃO ULTRA RIGOROSA PARA ADMIN
    const userEmail = user?.email?.toLowerCase()?.trim() || '';
    const isBlacklistedUser = nonAdminEmails.includes(userEmail);
    const hasValidAdminFlag = user && user.isAdmin === true && typeof user.isAdmin === 'boolean';
    
    // REGRA ABSOLUTA: NUNCA mostrar admin para usuários blacklistados
    // APENAS usuários com isAdmin === true E que NÃO estão na blacklist podem ser admin
    const finalAdminCheck = hasValidAdminFlag && !isBlacklistedUser;
    
    // VERIFICAÇÃO DE EMERGÊNCIA: Se for filo@gmail.com, FORÇAR bloqueio
    const isFiloEmergency = userEmail === 'filo@gmail.com';
    const emergencyBlock = isFiloEmergency;
    
    // DECISÃO FINAL: Admin tab só aparece se passar em TODAS as verificações E não for emergência
    const showAdminTab = finalAdminCheck && !emergencyBlock;
    
    console.log('🔒 VERIFICAÇÃO ULTRA RIGOROSA DE ADMIN:', {
      userExists: !!user,
      userEmail: userEmail,
      isAdminValue: user?.isAdmin,
      isAdminType: typeof user?.isAdmin,
      isAdminStrictCheck: user?.isAdmin === true,
      isAdminTypeCheck: typeof user?.isAdmin === 'boolean',
      isBlacklistedUser: isBlacklistedUser,
      hasValidAdminFlag: hasValidAdminFlag,
      isFiloEmergency: isFiloEmergency,
      emergencyBlock: emergencyBlock,
      finalCheck: finalAdminCheck,
      showAdminTab: showAdminTab,
      blacklistEmails: nonAdminEmails
    });

    // LOGS DE BLOQUEIO
    if (isBlacklistedUser) {
      console.log('🚫 USUÁRIO NA BLACKLIST - ADMIN TAB BLOQUEADA PERMANENTEMENTE');
      console.log('🚫 Email bloqueado:', userEmail);
    }
    
    if (isFiloEmergency) {
      console.log('🚨 BLOQUEIO DE EMERGÊNCIA ATIVADO PARA FILO@GMAIL.COM');
      console.log('🚨 Admin tab será FORÇADAMENTE removida');
    }

    // DECISÃO FINAL: Adicionar tab de admin APENAS se passar em TODAS as verificações
    if (showAdminTab) {
      console.log('✅ ADMIN TAB SERÁ ADICIONADA para usuário:', user?.name);
      baseScreens.push({
        name: "admin-doctors",
        title: 'Admin Médicos',
        icon: 'account-cog'
      });
    } else {
      console.log('❌ ADMIN TAB NÃO SERÁ ADICIONADA. Motivos:');
      console.log('   - Usuário existe?', !!user);
      console.log('   - Email do usuário:', userEmail);
      console.log('   - Está na blacklist?', isBlacklistedUser);
      console.log('   - É filo@gmail.com (emergência)?', isFiloEmergency);
      console.log('   - isAdmin value:', user?.isAdmin);
      console.log('   - isAdmin === true?', user?.isAdmin === true);
      console.log('   - isAdmin é boolean?', typeof user?.isAdmin === 'boolean');
      console.log('   - Tem flag admin válido?', hasValidAdminFlag);
      console.log('   - Verificação final passou?', finalAdminCheck);
      console.log('   - Bloqueio de emergência?', emergencyBlock);
      console.log('   - Decisão final (mostrar admin)?', showAdminTab);
    }

    // Adicionar tab de perfil por último
    baseScreens.push({
      name: "profile",
      title: 'Perfil',
      icon: 'account'
    });

    console.log('📋 Tabs finais calculadas:', baseScreens.map(tab => tab.name));
    console.log('🎯 Total de tabs:', baseScreens.length);
    
    // VERIFICAÇÃO FINAL DE SEGURANÇA
    const hasAdminTab = baseScreens.some(tab => tab.name === 'admin-doctors');
    console.log('🔍 VERIFICAÇÃO FINAL DE SEGURANÇA:');
    console.log('   - Contém admin-doctors?', hasAdminTab ? 'SIM ❌' : 'NÃO ✅');
    
    // Log específico para filo@gmail.com
    if (userEmail === 'filo@gmail.com') {
      console.log('🎯 VERIFICAÇÃO ESPECÍFICA PARA FILO@GMAIL.COM:');
      console.log('   - Tabs que serão mostradas:', baseScreens.map(tab => tab.title));
      console.log('   - Admin tab incluída?', hasAdminTab ? 'SIM ❌ ERRO!' : 'NÃO ✅ CORRETO!');
      
      if (hasAdminTab) {
        console.error('🚨 ERRO CRÍTICO: Admin tab ainda está presente para filo@gmail.com!');
      }
    }
    
    // FILTRO DE EMERGÊNCIA: Remover qualquer tab admin que possa ter passado
    const finalScreens = baseScreens.filter(tab => {
      if (tab.name === 'admin-doctors' && (isBlacklistedUser || isFiloEmergency)) {
        console.log('🚨 FILTRO DE EMERGÊNCIA: Removendo admin tab que passou incorretamente');
        return false;
      }
      return true;
    });
    
    console.log('🛡️ TABS APÓS FILTRO DE EMERGÊNCIA:', finalScreens.map(tab => tab.name));
    console.log('🛡️ Total final:', finalScreens.length);
    
    return finalScreens;
  }, [user, forceUpdate]); // Dependências incluem forceUpdate para garantir recálculo

  console.log('🎬 Renderizando TabLayout com', tabScreens.length, 'tabs');
  console.log('🎬 Tabs sendo renderizadas:', tabScreens.map(tab => tab.name));

  return (
    <Tabs
      key={`tabs-${forceUpdate}-${user?.email || 'no-user'}`} // Força re-renderização completa incluindo email
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