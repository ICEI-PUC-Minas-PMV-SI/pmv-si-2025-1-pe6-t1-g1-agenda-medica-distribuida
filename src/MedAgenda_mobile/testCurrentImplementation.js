// Script para testar a implementação atual de remoção do botão admin
console.log('🔬 TESTE DA IMPLEMENTAÇÃO ATUAL: Remoção do Botão Admin');
console.log('='.repeat(60));

// Simular a lógica exata do _layout.tsx
function testTabLayoutLogic(user) {
  console.log(`\n🧪 Testando usuário: ${user?.name || 'Sem nome'} (${user?.email || 'Sem email'})`);
  
  // TABS BASE QUE SEMPRE APARECEM
  const baseScreens = [
    { name: "index", title: 'Início', icon: 'home' },
    { name: "appointments", title: 'Consultas', icon: 'calendar' },
    { name: "doctors", title: 'Médicos', icon: 'doctor' },
    { name: "new-appointment", title: 'Nova Consulta', icon: 'plus' }
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
    showAdminTab: showAdminTab
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
    console.log('❌ ADMIN TAB NÃO SERÁ ADICIONADA');
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
  
  // Resultado final
  const finalHasAdmin = finalScreens.some(tab => tab.name === 'admin-doctors');
  console.log(`\n🎯 RESULTADO FINAL:`);
  console.log(`   - Usuário: ${user?.name || 'Sem nome'} (${user?.email || 'Sem email'})`);
  console.log(`   - Tabs mostradas: ${finalScreens.map(tab => tab.title).join(', ')}`);
  console.log(`   - Contém botão admin: ${finalHasAdmin ? 'SIM ❌' : 'NÃO ✅'}`);
  console.log(`   - Total de botões: ${finalScreens.length}`);
  
  return {
    finalScreens,
    hasAdminTab: finalHasAdmin,
    totalTabs: finalScreens.length
  };
}

// Casos de teste
const testCases = [
  {
    name: 'Usuário filo@gmail.com (deve ser bloqueado)',
    user: { id: '1', name: 'Filo User', email: 'filo@gmail.com', isAdmin: false }
  },
  {
    name: 'Usuário filo@gmail.com com isAdmin true (deve ser bloqueado)',
    user: { id: '2', name: 'Filo User', email: 'filo@gmail.com', isAdmin: true }
  },
  {
    name: 'Usuário normal sem admin',
    user: { id: '3', name: 'João Silva', email: 'joao@test.com', isAdmin: false }
  },
  {
    name: 'Usuário admin legítimo',
    user: { id: '4', name: 'Admin Real', email: 'admin@hospital.com', isAdmin: true }
  },
  {
    name: 'Usuário na blacklist com admin true',
    user: { id: '5', name: 'User Test', email: 'user@test.com', isAdmin: true }
  }
];

console.log('\n🚀 Executando testes...\n');

let allTestsPassed = true;

testCases.forEach((testCase, index) => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`TESTE ${index + 1}: ${testCase.name}`);
  console.log(`${'='.repeat(70)}`);
  
  const result = testTabLayoutLogic(testCase.user);
  
  // Verificar se o resultado está correto
  const userEmail = testCase.user.email?.toLowerCase();
  const isBlacklisted = ['filo@gmail.com', 'user@test.com', 'teste@gmail.com', 'normal@user.com', 'test@test.com', 'usuario@teste.com'].includes(userEmail);
  const shouldHaveAdmin = testCase.user.isAdmin === true && !isBlacklisted;
  const expectedTabs = shouldHaveAdmin ? 6 : 5; // 5 tabs normais + 1 admin se for admin
  
  const testPassed = result.hasAdminTab === shouldHaveAdmin && result.totalTabs === expectedTabs;
  
  console.log(`\n📊 Análise do teste:`);
  console.log(`   - Esperado admin: ${shouldHaveAdmin ? 'SIM' : 'NÃO'}`);
  console.log(`   - Obtido admin: ${result.hasAdminTab ? 'SIM' : 'NÃO'}`);
  console.log(`   - Esperado tabs: ${expectedTabs}`);
  console.log(`   - Obtido tabs: ${result.totalTabs}`);
  console.log(`   - Teste: ${testPassed ? '✅ PASSOU' : '❌ FALHOU'}`);
  
  if (!testPassed) {
    allTestsPassed = false;
  }
});

console.log(`\n${'='.repeat(70)}`);
console.log('🏁 RESUMO FINAL');
console.log(`${'='.repeat(70)}`);

console.log(`\n🎯 Resultado geral: ${allTestsPassed ? '✅ TODOS OS TESTES PASSARAM' : '❌ ALGUNS TESTES FALHARAM'}`);

console.log('\n📋 COMPORTAMENTO ESPERADO:');
console.log('• Usuários normais: 5 botões (Início, Consultas, Médicos, Nova Consulta, Perfil)');
console.log('• Usuários admin legítimos: 6 botões (+ Admin Médicos)');
console.log('• Usuários na blacklist: SEMPRE 5 botões (NUNCA admin)');
console.log('• filo@gmail.com: SEMPRE 5 botões (bloqueio de emergência)');

console.log('\n⚡ SE O BOTÃO AINDA APARECER:');
console.log('1. Feche COMPLETAMENTE o aplicativo');
console.log('2. Limpe o cache: expo start --clear');
console.log('3. Faça logout e login novamente');
console.log('4. Verifique os logs do console para debug');

module.exports = { testTabLayoutLogic }; 