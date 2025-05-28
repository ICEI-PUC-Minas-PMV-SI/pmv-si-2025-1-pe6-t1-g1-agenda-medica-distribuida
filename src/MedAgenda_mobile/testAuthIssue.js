// Teste específico para diagnosticar problema de autorização
const axios = require('axios');

async function testAuthIssue() {
  console.log('🔍 DIAGNÓSTICO DO PROBLEMA DE AUTORIZAÇÃO\n');
  
  const api = axios.create({
    baseURL: 'https://med-agenda-backend.vercel.app/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'client': 'not-browser',
    }
  });

  let authToken = null;
  let userId = null;

  // 1. Fazer login
  console.log('🔐 Fazendo login...');
  try {
    const loginResponse = await api.post('/auth/signin', {
      email: 'jj@gmail.com',
      password: 'Abc12345'
    });
    
    authToken = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso!');
    console.log('🔑 Token obtido:', authToken ? 'Sim' : 'Não');
    
    // Decodificar JWT para extrair userId
    if (authToken) {
      const base64Url = authToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      userId = decoded.userId;
      console.log('👤 User ID extraído:', userId);
    }
    
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data || error.message);
    return;
  }

  // 2. Testar chamadas com diferentes configurações
  console.log('\n📋 TESTANDO DIFERENTES CONFIGURAÇÕES DE CHAMADA:\n');

  // Teste 1: Sem token
  console.log('1️⃣ Teste sem token:');
  try {
    const response = await api.get('/appointment');
    console.log('✅ Sucesso (inesperado):', response.data);
  } catch (error) {
    console.log('❌ Erro esperado:', error.response?.status, error.response?.data?.message);
  }

  // Teste 2: Com token no header Authorization
  console.log('\n2️⃣ Teste com token no header Authorization:');
  try {
    const response = await api.get('/appointment', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Sucesso:', response.data);
  } catch (error) {
    console.log('❌ Erro:', error.response?.status, error.response?.data?.message);
  }

  // Teste 3: Com token e parâmetro userId
  console.log('\n3️⃣ Teste com token e parâmetro userId:');
  try {
    const response = await api.get('/appointment', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      params: {
        _id: userId
      }
    });
    console.log('✅ Sucesso:', response.data);
  } catch (error) {
    console.log('❌ Erro:', error.response?.status, error.response?.data?.message);
  }

  // Teste 4: Verificar se o token está válido testando outro endpoint
  console.log('\n4️⃣ Teste de validade do token (mudança de senha):');
  try {
    const response = await api.patch('/auth/change-password', {
      oldPassword: 'Abc12345',
      newPassword: 'Abc12345' // Mesma senha para não alterar
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('✅ Token válido:', response.data);
  } catch (error) {
    console.log('❌ Token inválido ou outro erro:', error.response?.status, error.response?.data?.message);
  }

  // Teste 5: Verificar interceptor automático
  console.log('\n5️⃣ Teste com interceptor automático:');
  
  // Configurar interceptor
  api.interceptors.request.use((config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
      console.log('🔧 Interceptor adicionou token');
    }
    return config;
  });

  try {
    const response = await api.get('/appointment');
    console.log('✅ Sucesso com interceptor:', response.data);
  } catch (error) {
    console.log('❌ Erro com interceptor:', error.response?.status, error.response?.data?.message);
  }

  // Teste 6: Verificar headers enviados
  console.log('\n6️⃣ Verificando headers enviados:');
  
  api.interceptors.request.use((config) => {
    console.log('📤 Headers enviados:', {
      'Content-Type': config.headers['Content-Type'],
      'client': config.headers['client'],
      'Authorization': config.headers['Authorization'] ? 'Bearer [TOKEN]' : 'Não enviado'
    });
    return config;
  });

  try {
    const response = await api.get('/appointment');
    console.log('✅ Sucesso:', response.data);
  } catch (error) {
    console.log('❌ Erro:', error.response?.status, error.response?.data?.message);
  }

  console.log('\n🎯 DIAGNÓSTICO COMPLETO');
  console.log('='.repeat(50));
  console.log('Se todos os testes falharam com 401, o problema pode ser:');
  console.log('1. Token expirado');
  console.log('2. Usuário não verificado');
  console.log('3. Problema no middleware de autenticação do backend');
  console.log('4. Header client: not-browser não está sendo enviado corretamente');
}

testAuthIssue(); 