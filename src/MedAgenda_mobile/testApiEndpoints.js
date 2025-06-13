// Teste para verificar endpoints da API
const axios = require('axios');

async function testApiEndpoints() {
  console.log('🔍 VERIFICANDO ENDPOINTS DA API\n');
  
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

  // 1. Login
  console.log('🔐 1. Fazendo login...');
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
    console.log('❌ Login falhou:', error.message);
    return;
  }

  // 2. Testar endpoints de agendamentos
  console.log('\n📅 2. Testando endpoints de agendamentos...');
  
  // GET /appointment (atual)
  try {
    const response = await api.get('/appointment', {
      params: { _id: userId }
    });
    console.log('✅ GET /appointment (com userId):', response.data.appointments?.length || 0, 'agendamentos');
  } catch (error) {
    console.log('❌ GET /appointment falhou:', error.response?.status, error.response?.data?.message);
  }

  // GET /appointment sem parâmetros
  try {
    const response = await api.get('/appointment', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ GET /appointment (com token):', response.data.appointments?.length || 0, 'agendamentos');
  } catch (error) {
    console.log('❌ GET /appointment (com token) falhou:', error.response?.status, error.response?.data?.message);
  }

  // GET /appointments (plural)
  try {
    const response = await api.get('/appointments', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ GET /appointments (plural):', response.data);
  } catch (error) {
    console.log('❌ GET /appointments falhou:', error.response?.status, error.response?.data?.message);
  }

  // GET /user/appointments
  try {
    const response = await api.get('/user/appointments', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ GET /user/appointments:', response.data);
  } catch (error) {
    console.log('❌ GET /user/appointments falhou:', error.response?.status, error.response?.data?.message);
  }

  // 3. Testar criação de agendamento
  console.log('\n📤 3. Testando criação de agendamento...');
  
  // Primeiro, pegar médicos
  let doctors = [];
  try {
    const doctorsResponse = await api.get('/doctors', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    doctors = doctorsResponse.data.doctors;
    console.log('✅ Médicos disponíveis:', doctors.length);
  } catch (error) {
    console.log('❌ Erro ao carregar médicos:', error.response?.data);
    return;
  }

  if (doctors.length > 0) {
    const testDoctor = doctors[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Testar diferentes formatos de criação
    const testCases = [
      {
        name: 'POST /appointment (formato atual)',
        endpoint: '/appointment',
        data: {
          userId: userId,
          docId: testDoctor.crm,
          slotDate: tomorrow.toISOString().split('T')[0],
          slotTime: '14:00'
        }
      },
      {
        name: 'POST /appointments (plural)',
        endpoint: '/appointments',
        data: {
          userId: userId,
          doctorId: testDoctor._id,
          date: tomorrow.toISOString().split('T')[0],
          time: '15:00'
        }
      },
      {
        name: 'POST /user/appointments',
        endpoint: '/user/appointments',
        data: {
          doctorId: testDoctor._id,
          date: tomorrow.toISOString().split('T')[0],
          time: '16:00'
        }
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🧪 Testando: ${testCase.name}`);
      console.log('📋 Dados:', testCase.data);
      
      try {
        const response = await api.post(testCase.endpoint, testCase.data, {
          headers: { 'Authorization': `Bearer ${authToken}` },
          timeout: 10000
        });
        console.log(`✅ ${testCase.name} funcionou!`);
        console.log('📋 Resposta:', response.data);
      } catch (error) {
        console.log(`❌ ${testCase.name} falhou:`, error.response?.status, error.response?.data?.message || error.message);
      }
    }
  }

  // 4. Testar endpoints de usuário
  console.log('\n👤 4. Testando endpoints de usuário...');
  
  // GET /user/profile
  try {
    const response = await api.get('/user/profile', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ GET /user/profile:', response.data);
  } catch (error) {
    console.log('❌ GET /user/profile falhou:', error.response?.status, error.response?.data?.message);
  }

  // GET /user/me
  try {
    const response = await api.get('/user/me', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ GET /user/me:', response.data);
  } catch (error) {
    console.log('❌ GET /user/me falhou:', error.response?.status, error.response?.data?.message);
  }

  console.log('\n🎯 RESUMO DOS ENDPOINTS:');
  console.log('='.repeat(50));
  console.log('Verifique os logs acima para identificar:');
  console.log('1. Qual endpoint funciona para listar agendamentos do usuário');
  console.log('2. Qual endpoint funciona para criar agendamentos');
  console.log('3. Qual endpoint retorna dados do usuário logado');
}

testApiEndpoints(); 