// Teste mais abrangente para descobrir endpoints
const axios = require('axios');

async function testMoreEndpoints() {
  console.log('🔍 TESTE ABRANGENTE DE ENDPOINTS\n');
  
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

  // Login
  try {
    const loginResponse = await api.post('/auth/signin', {
      email: 'jj@gmail.com',
      password: 'Abc12345'
    });
    authToken = loginResponse.data.token;
    const decoded = JSON.parse(atob(authToken.split('.')[1]));
    userId = decoded.userId;
    console.log('✅ Login OK - User ID:', userId);
  } catch (error) {
    console.log('❌ Login falhou');
    return;
  }

  // Testar endpoints de agendamentos com diferentes abordagens
  console.log('\n📅 TESTANDO AGENDAMENTOS:');
  
  const appointmentEndpoints = [
    { method: 'GET', url: '/appointment', params: { userId: userId } },
    { method: 'GET', url: '/appointment', params: { _id: userId } },
    { method: 'GET', url: '/appointment', params: { user: userId } },
    { method: 'GET', url: '/appointments' },
    { method: 'GET', url: '/user/appointments' },
    { method: 'GET', url: '/my-appointments' },
    { method: 'GET', url: '/patient/appointments' },
  ];

  for (const endpoint of appointmentEndpoints) {
    try {
      const config = {
        headers: { 'Authorization': `Bearer ${authToken}` }
      };
      if (endpoint.params) {
        config.params = endpoint.params;
      }
      
      const response = await api.get(endpoint.url, config);
      console.log(`✅ ${endpoint.method} ${endpoint.url}:`, response.data);
    } catch (error) {
      console.log(`❌ ${endpoint.method} ${endpoint.url}:`, error.response?.status, error.response?.data?.message || 'erro');
    }
  }

  // Testar endpoints de usuário
  console.log('\n👤 TESTANDO USUÁRIO:');
  
  const userEndpoints = [
    '/user',
    '/user/profile',
    '/user/me',
    '/profile',
    '/me',
    '/auth/me',
    '/auth/profile'
  ];

  for (const endpoint of userEndpoints) {
    try {
      const response = await api.get(endpoint, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      console.log(`✅ GET ${endpoint}:`, response.data);
    } catch (error) {
      console.log(`❌ GET ${endpoint}:`, error.response?.status, error.response?.data?.message || 'erro');
    }
  }

  // Testar criação de agendamento com diferentes formatos
  console.log('\n📤 TESTANDO CRIAÇÃO DE AGENDAMENTOS:');
  
  // Pegar um médico primeiro
  let testDoctor = null;
  try {
    const doctorsResponse = await api.get('/doctors', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    testDoctor = doctorsResponse.data.doctors[0];
    console.log('👨‍⚕️ Médico para teste:', testDoctor.name, 'CRM:', testDoctor.crm);
  } catch (error) {
    console.log('❌ Erro ao carregar médicos');
    return;
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const createEndpoints = [
    {
      url: '/appointment',
      data: { userId: userId, docId: testDoctor.crm, slotDate: dateStr, slotTime: '10:00' }
    },
    {
      url: '/appointments',
      data: { doctorId: testDoctor._id, date: dateStr, time: '11:00' }
    },
    {
      url: '/user/appointments',
      data: { doctorId: testDoctor._id, date: dateStr, time: '12:00' }
    },
    {
      url: '/appointment/create',
      data: { doctorId: testDoctor._id, date: dateStr, time: '13:00' }
    },
    {
      url: '/appointment/book',
      data: { doctorId: testDoctor._id, date: dateStr, time: '14:00' }
    }
  ];

  for (const endpoint of createEndpoints) {
    console.log(`\n🧪 POST ${endpoint.url}`);
    console.log('📋 Dados:', endpoint.data);
    
    try {
      const response = await api.post(endpoint.url, endpoint.data, {
        headers: { 'Authorization': `Bearer ${authToken}` },
        timeout: 8000
      });
      console.log(`✅ POST ${endpoint.url} funcionou!`);
      console.log('📋 Resposta:', response.data);
      break; // Se funcionou, parar de testar
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.log(`⏰ POST ${endpoint.url}: Timeout`);
      } else {
        console.log(`❌ POST ${endpoint.url}:`, error.response?.status, error.response?.data?.message || error.message);
      }
    }
  }

  console.log('\n🎯 CONCLUSÃO:');
  console.log('Verifique os logs acima para identificar os endpoints que funcionam');
}

testMoreEndpoints(); 