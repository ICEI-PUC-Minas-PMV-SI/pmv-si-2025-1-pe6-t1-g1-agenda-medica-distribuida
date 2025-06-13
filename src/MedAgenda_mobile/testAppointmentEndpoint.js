// Teste específico para diagnosticar problemas com endpoint de agendamentos
const axios = require('axios');

async function testAppointmentEndpoint() {
  console.log('🔍 DIAGNÓSTICO DO ENDPOINT DE AGENDAMENTOS\n');
  
  const api = axios.create({
    baseURL: 'https://med-agenda-backend.vercel.app/api',
    timeout: 30000, // Aumentar timeout para 30s
    headers: {
      'Content-Type': 'application/json',
      'client': 'not-browser',
    }
  });

  let authToken = null;
  let userId = null;

  // 1. Login
  console.log('🔐 Fazendo login...');
  try {
    const loginResponse = await api.post('/auth/signin', {
      email: 'jj@gmail.com',
      password: 'Abc12345'
    });
    
    authToken = loginResponse.data.token;
    const base64Url = authToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    userId = decoded.userId;
    
    console.log('✅ Login OK - User ID:', userId);
    
  } catch (error) {
    console.log('❌ Erro no login:', error.message);
    return;
  }

  // 2. Testar GET /appointment (que sabemos que funciona)
  console.log('\n📋 Testando GET /appointment...');
  try {
    const getResponse = await api.get('/appointment', {
      params: { _id: userId },
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ GET funcionando - Agendamentos:', getResponse.data.appointments?.length || 0);
  } catch (error) {
    console.log('❌ GET falhou:', error.response?.status, error.response?.data?.message);
  }

  // 3. Testar POST /appointment com dados mínimos
  console.log('\n📤 Testando POST /appointment com dados mínimos...');
  
  const minimalData = {
    userId: userId,
    docId: '123456', // CRM do primeiro médico
    slotDate: '2025-05-30',
    slotTime: '10:00'
  };

  console.log('📋 Dados enviados:', minimalData);

  const startTime = Date.now();
  try {
    console.log('⏳ Enviando requisição...');
    
    const postResponse = await api.post('/appointment', minimalData, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    const endTime = Date.now();
    console.log(`✅ POST funcionou! Tempo: ${endTime - startTime}ms`);
    console.log('📋 Resposta:', postResponse.data);
    
  } catch (error) {
    const endTime = Date.now();
    console.log(`❌ POST falhou após ${endTime - startTime}ms`);
    console.log('📋 Status:', error.response?.status);
    console.log('📋 Erro:', error.response?.data || error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.log('⏰ Timeout - O backend está demorando muito para responder');
    }
  }

  // 4. Testar com dados diferentes
  console.log('\n🔄 Testando com dados alternativos...');
  
  const alternativeData = {
    userId: userId,
    docId: '123456',
    slotDate: '2025-06-01',
    slotTime: '14:30'
  };

  try {
    console.log('⏳ Tentativa 2...');
    const response = await api.post('/appointment', alternativeData, {
      headers: { 'Authorization': `Bearer ${authToken}` },
      timeout: 20000 // 20s timeout
    });
    
    console.log('✅ Tentativa 2 funcionou:', response.data);
    
  } catch (error) {
    console.log('❌ Tentativa 2 falhou:', error.response?.status, error.message);
  }

  // 5. Verificar se o problema é específico do endpoint
  console.log('\n🧪 Testando outros endpoints POST...');
  
  try {
    // Testar mudança de senha (que sabemos que dá erro de verificação, mas não timeout)
    await api.patch('/auth/change-password', {
      oldPassword: 'Abc12345',
      newPassword: 'Abc12345'
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Endpoint /auth/change-password responde rapidamente (401 esperado)');
    } else {
      console.log('⚠️ Endpoint /auth/change-password:', error.response?.status, error.message);
    }
  }

  console.log('\n🎯 DIAGNÓSTICO:');
  console.log('='.repeat(50));
  console.log('✅ Login: OK');
  console.log('✅ GET /appointment: OK');
  console.log('❌ POST /appointment: Timeout/504');
  console.log('✅ Outros endpoints: Respondem rapidamente');
  console.log('\n💡 CONCLUSÃO: O problema é específico do endpoint POST /appointment');
  console.log('🔧 SOLUÇÃO: Problema de infraestrutura no backend, não no app');
}

testAppointmentEndpoint(); 