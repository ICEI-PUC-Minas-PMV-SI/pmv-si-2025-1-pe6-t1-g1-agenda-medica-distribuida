// Teste específico para problema de login
const axios = require('axios');

async function testLoginIssue() {
  console.log('🔍 Investigando problema de login...\n');
  
  const api = axios.create({
    baseURL: 'https://med-agenda-backend.vercel.app/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'client': 'not-browser'
    }
  });

  // Primeiro, vamos cadastrar um usuário
  const testEmail = 'teste-login-' + Date.now() + '@example.com';
  const testPassword = 'MinhaSenh@123';
  
  try {
    console.log('📝 Cadastrando usuário:', testEmail);
    const registerResponse = await api.post('/auth/signup', {
      name: 'Teste Login',
      email: testEmail,
      password: testPassword,
      phone: '+5511999999999'
    });
    
    console.log('✅ Usuário cadastrado:', registerResponse.data.email);
    console.log('🔍 Dados completos do cadastro:');
    console.log(JSON.stringify(registerResponse.data, null, 2));
    
    // Agora tentar fazer login
    console.log('\n🔐 Tentando fazer login...');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Senha:', testPassword);
    
    const loginResponse = await api.post('/auth/signin', {
      email: testEmail,
      password: testPassword
    });
    
    console.log('✅ Login realizado com sucesso!');
    console.log('🎯 Token recebido:', loginResponse.data.token ? 'Sim' : 'Não');
    console.log('📋 Resposta completa do login:');
    console.log(JSON.stringify(loginResponse.data, null, 2));
    
    // Testar um endpoint autenticado
    console.log('\n🧪 Testando endpoint autenticado...');
    const testApi = axios.create({
      baseURL: 'https://med-agenda-backend.vercel.app/api',
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'client': 'not-browser',
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });
    
    const doctorsResponse = await testApi.get('/doctors');
    console.log('✅ Endpoint autenticado funcionando! Médicos encontrados:', doctorsResponse.data.doctors?.length || 0);
    
  } catch (error) {
    console.log('❌ Erro detalhado:');
    console.log('📊 Status:', error.response?.status);
    console.log('📄 Dados:', error.response?.data);
    console.log('🔗 Headers:', error.response?.headers);
    console.log('⚠️ Mensagem:', error.message);
    
    if (error.response?.status === 401) {
      console.log('\n🔍 Erro 401 - Possíveis causas:');
      console.log('1. Email ou senha incorretos');
      console.log('2. Usuário não existe no banco');
      console.log('3. Senha não atende aos requisitos');
      console.log('4. Problema de encoding/caracteres especiais');
    }
  }
}

// Teste adicional com credenciais que você está usando
async function testWithYourCredentials() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 Teste com suas credenciais específicas...\n');
  
  // Substitua aqui pelo email e senha que você está tentando usar
  const yourEmail = 'jj@gmail.com'; // ← COLOQUE SEU EMAIL AQUI
  const yourPassword = 'Abc12345'; // ← COLOQUE SUA SENHA AQUI
  
  const api = axios.create({
    baseURL: 'https://med-agenda-backend.vercel.app/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'client': 'not-browser'
    }
  });
  
  try {
    console.log('📧 Tentando login com:', yourEmail);
    console.log('🔑 Senha fornecida:', yourPassword.replace(/./g, '*'));
    
    const response = await api.post('/auth/signin', {
      email: yourEmail,
      password: yourPassword
    });
    
    console.log('✅ Login com suas credenciais funcionou!');
    console.log('📋 Resposta:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ Erro com suas credenciais:');
    console.log('📊 Status:', error.response?.status);
    console.log('📄 Dados:', error.response?.data);
    
    if (error.response?.data?.message === 'User does not exists!') {
      console.log('\n💡 SOLUÇÃO: O usuário não existe no banco de dados.');
      console.log('   Você precisa se cadastrar primeiro ou usar um email diferente.');
    } else if (error.response?.data?.message === 'Invalid credentials!') {
      console.log('\n💡 SOLUÇÃO: Senha incorreta.');
      console.log('   Verifique se a senha atende aos requisitos:');
      console.log('   - Mínimo 8 caracteres');
      console.log('   - Pelo menos 1 letra maiúscula');
      console.log('   - Pelo menos 1 letra minúscula');
      console.log('   - Pelo menos 1 número');
    }
  }
}

async function runTests() {
  await testLoginIssue();
  await testWithYourCredentials();
  
  console.log('\n📋 RESUMO:');
  console.log('1. Execute este teste para ver se o problema é geral ou específico');
  console.log('2. Atualize suas credenciais na função testWithYourCredentials()');
  console.log('3. Verifique se você está usando o email correto');
  console.log('4. Confirme se a senha atende aos requisitos do backend');
}

runTests(); 