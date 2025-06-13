// Teste específico para criação de agendamentos
const axios = require('axios');

async function testNewAppointment() {
  console.log('🧪 TESTE DE CRIAÇÃO DE AGENDAMENTOS\n');
  
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
    
    // Extrair userId do token
    const base64Url = authToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const decoded = JSON.parse(jsonPayload);
    userId = decoded.userId;
    
    console.log('✅ Login realizado com sucesso!');
    console.log('👤 User ID:', userId);
    
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data || error.message);
    return;
  }

  // 2. Carregar médicos disponíveis
  console.log('\n👨‍⚕️ Carregando médicos...');
  let doctors = [];
  try {
    const doctorsResponse = await api.get('/doctors', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    doctors = doctorsResponse.data.doctors;
    console.log('✅ Médicos carregados:', doctors.length);
    
    if (doctors.length > 0) {
      console.log('📋 Primeiro médico:', {
        name: doctors[0].name,
        specialty: doctors[0].speciality,
        crm: doctors[0].crm
      });
    }
    
  } catch (error) {
    console.log('❌ Erro ao carregar médicos:', error.response?.data || error.message);
    return;
  }

  // 3. Testar criação de agendamento
  console.log('\n📅 Testando criação de agendamento...');
  
  if (doctors.length === 0) {
    console.log('❌ Nenhum médico disponível para teste');
    return;
  }

  const testDoctor = doctors[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];
  const timeStr = '14:00';

  console.log('📋 Dados do agendamento:');
  console.log('  👤 User ID:', userId);
  console.log('  👨‍⚕️ Médico:', testDoctor.name);
  console.log('  🆔 CRM:', testDoctor.crm);
  console.log('  📅 Data:', dateStr);
  console.log('  🕐 Horário:', timeStr);

  try {
    // Formato correto para a API
    const appointmentData = {
      userId: userId,
      docId: testDoctor.crm,
      slotDate: dateStr,
      slotTime: timeStr
    };

    console.log('\n📤 Enviando dados para API:', appointmentData);

    const appointmentResponse = await api.post('/appointment', appointmentData, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Agendamento criado com sucesso!');
    console.log('📋 Resposta da API:', appointmentResponse.data);
    
    // Verificar se aparece na lista
    console.log('\n🔄 Verificando se aparece na lista...');
    const updatedAppointments = await api.get('/appointment', {
      params: { _id: userId }
    });
    
    console.log('📊 Total de agendamentos:', updatedAppointments.data.appointments?.length || 0);
    
    if (updatedAppointments.data.appointments?.length > 0) {
      const lastAppointment = updatedAppointments.data.appointments[updatedAppointments.data.appointments.length - 1];
      console.log('📝 Último agendamento:', lastAppointment);
    }
    
  } catch (error) {
    console.log('❌ Erro ao criar agendamento:', error.response?.status, error.response?.data || error.message);
    
    if (error.response?.data) {
      console.log('📋 Detalhes do erro:', JSON.stringify(error.response.data, null, 2));
    }
  }

  // 4. Testar diferentes formatos de data/hora
  console.log('\n🧪 Testando diferentes formatos...');
  
  const testFormats = [
    {
      name: 'ISO Date + Time',
      data: {
        userId: userId,
        docId: testDoctor.crm,
        slotDate: tomorrow.toISOString(),
        slotTime: '15:00'
      }
    },
    {
      name: 'Date Object',
      data: {
        userId: userId,
        docId: testDoctor.crm,
        slotDate: tomorrow,
        slotTime: '16:00'
      }
    }
  ];

  for (const test of testFormats) {
    console.log(`\n🔬 Testando formato: ${test.name}`);
    try {
      const response = await api.post('/appointment', test.data, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log(`✅ ${test.name} funcionou:`, response.data);
    } catch (error) {
      console.log(`❌ ${test.name} falhou:`, error.response?.data?.message || error.message);
    }
  }

  console.log('\n🎯 RESUMO DO TESTE:');
  console.log('='.repeat(50));
  console.log('✅ Login: Funcionando');
  console.log('✅ Carregamento de médicos: Funcionando');
  console.log('⚠️ Criação de agendamentos: Verificar logs acima');
  console.log('\n📱 Se a criação funcionou, o app deve funcionar corretamente!');
}

testNewAppointment(); 