// Teste específico para simular o fluxo de login do app MedAgenda
const axios = require('axios');

async function testAppLoginFlow() {
  console.log('🧪 Testando fluxo de login do app MedAgenda\n');
  
  // Configuração idêntica ao app
  const api = axios.create({
    baseURL: 'https://med-agenda-backend.vercel.app/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'client': 'not-browser', // Header essencial
    },
  });

  // Suas credenciais específicas
  const email = 'jj@gmail.com';
  const password = 'Abc12345';
  
  console.log('📱 Simulando login do app...');
  console.log('📧 Email:', email);
  console.log('🔑 Senha:', password.replace(/./g, '*'));
  
  try {
    // 1. Fazer login (como o app faz)
    console.log('\n🔐 Fazendo login...');
    const loginResponse = await api.post('/auth/signin', {
      email: email,
      password: password
    });
    
    console.log('✅ Login realizado com sucesso!');
    console.log('📋 Resposta da API:');
    console.log(JSON.stringify(loginResponse.data, null, 2));
    
    const { token } = loginResponse.data;
    
    // 2. Simular armazenamento no AsyncStorage
    console.log('\n💾 Simulando armazenamento no AsyncStorage...');
    const userData = {
      email: email,
      name: email.split('@')[0],
      id: 'temp-id'
    };
    
    console.log('✅ Token armazenado:', token ? 'Sim' : 'Não');
    console.log('✅ Dados do usuário criados:', JSON.stringify(userData, null, 2));
    
    // 3. Testar endpoint autenticado (como o app faria)
    console.log('\n🧪 Testando endpoint autenticado...');
    const authenticatedApi = axios.create({
      baseURL: 'https://med-agenda-backend.vercel.app/api',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'client': 'not-browser',
        'Authorization': `Bearer ${token}`
      }
    });
    
    const doctorsResponse = await authenticatedApi.get('/doctors');
    console.log('✅ Endpoint autenticado funcionando!');
    console.log('👨‍⚕️ Médicos encontrados:', doctorsResponse.data.doctors?.length || 0);
    
    // 4. Simular navegação para tela principal
    console.log('\n🚀 Simulando navegação para tela principal...');
    console.log('✅ Usuário autenticado com sucesso!');
    console.log('✅ Redirecionamento para /(tabs) seria executado');
    
    return {
      success: true,
      token: token,
      user: userData
    };
    
  } catch (error) {
    console.log('\n❌ Erro no fluxo de login:');
    console.log('📊 Status:', error.response?.status);
    console.log('📄 Dados:', error.response?.data);
    console.log('⚠️ Mensagem:', error.message);
    
    // Diagnóstico específico
    if (error.response?.status === 401) {
      console.log('\n🔍 Diagnóstico:');
      if (error.response?.data?.message?.includes('User does not exists')) {
        console.log('❌ Usuário não existe no banco de dados');
        console.log('💡 Solução: Cadastre-se primeiro');
      } else if (error.response?.data?.message?.includes('Invalid credentials')) {
        console.log('❌ Credenciais inválidas');
        console.log('💡 Solução: Verifique email e senha');
      } else {
        console.log('❌ Erro de autenticação genérico');
        console.log('💡 Verifique se o header "client: not-browser" está presente');
      }
    }
    
    return {
      success: false,
      error: error.response?.data || error.message
    };
  }
}

// Teste adicional: verificar se o usuário existe
async function checkUserExists() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 Verificando se o usuário existe no banco...\n');
  
  const api = axios.create({
    baseURL: 'https://med-agenda-backend.vercel.app/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'client': 'not-browser',
    },
  });
  
  try {
    // Tentar fazer login para verificar se existe
    const response = await api.post('/auth/signin', {
      email: 'jj@gmail.com',
      password: 'senha-incorreta' // Senha propositalmente incorreta
    });
    
  } catch (error) {
    if (error.response?.data?.message === 'User does not exists!') {
      console.log('❌ Usuário jj@gmail.com NÃO existe no banco');
      console.log('💡 Você precisa se cadastrar primeiro');
      return false;
    } else if (error.response?.data?.message === 'Invalid credentials!') {
      console.log('✅ Usuário jj@gmail.com EXISTE no banco');
      console.log('✅ Senha Abc12345 deve funcionar');
      return true;
    } else {
      console.log('⚠️ Erro inesperado:', error.response?.data);
      return null;
    }
  }
}

async function runFullTest() {
  console.log('🚀 TESTE COMPLETO DO FLUXO DE LOGIN\n');
  console.log('📱 App: MedAgenda Mobile');
  console.log('🌐 API: https://med-agenda-backend.vercel.app');
  console.log('👤 Usuário: jj@gmail.com');
  console.log('='.repeat(60));
  
  // 1. Verificar se usuário existe
  const userExists = await checkUserExists();
  
  // 2. Testar fluxo completo de login
  const result = await testAppLoginFlow();
  
  // 3. Resumo final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMO FINAL:');
  
  if (result.success) {
    console.log('✅ LOGIN FUNCIONANDO PERFEITAMENTE!');
    console.log('✅ Token JWT obtido com sucesso');
    console.log('✅ Endpoints autenticados funcionando');
    console.log('✅ App deve funcionar normalmente');
    console.log('\n💡 Se ainda não consegue fazer login no app:');
    console.log('   1. Verifique se está usando o email: jj@gmail.com');
    console.log('   2. Verifique se está usando a senha: Abc12345');
    console.log('   3. Certifique-se de que o app está atualizado');
    console.log('   4. Tente limpar o cache do app');
  } else {
    console.log('❌ PROBLEMA IDENTIFICADO:');
    console.log('📄 Erro:', JSON.stringify(result.error, null, 2));
    console.log('\n💡 Próximos passos:');
    if (!userExists) {
      console.log('   1. Cadastre-se primeiro com jj@gmail.com');
      console.log('   2. Use uma senha que atenda aos requisitos');
    } else {
      console.log('   1. Verifique a senha (deve ser exatamente: Abc12345)');
      console.log('   2. Verifique a configuração do app');
    }
  }
}

runFullTest(); 