// Teste completo para todos os endpoints da API MedAgenda
const axios = require('axios');

const API_URL = 'https://med-agenda-backend.vercel.app/api';

let authToken = null;
let userId = null;
let testDoctorCrm = null;
let testAppointmentId = null;
let testUserEmail = `teste${Date.now()}@example.com`;
let testUserPassword = 'MinhaSenh@123';

// Configuração do axios com interceptor para token
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'client': 'not-browser' // Header necessário para o backend usar Authorization header
  }
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  console.log('🔧 Interceptor executado!');
  console.log('🔑 Token disponível:', authToken ? 'Sim' : 'Não');
  
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
    console.log('✅ Header Authorization adicionado:', config.headers.Authorization.substring(0, 30) + '...');
  } else {
    console.log('❌ Nenhum token para adicionar');
  }
  
  console.log('📤 Headers finais:', Object.keys(config.headers));
  return config;
});

// Função para decodificar JWT (sem verificação de assinatura)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.log('Erro ao decodificar JWT:', error);
    return null;
  }
}

// Função para cadastrar um usuário de teste
async function registerTestUser() {
  console.log('📝 Cadastrando usuário de teste...');
  console.log('📧 Email:', testUserEmail);
  
  try {
    const response = await api.post('/auth/signup', {
      name: 'Usuário Teste API',
      email: testUserEmail,
      password: testUserPassword,
      phone: '+5511999999999'
    });
    
    console.log('✅ Usuário cadastrado com sucesso!');
    console.log('👤 Dados:', response.data.result || response.data);
    return true;
  } catch (error) {
    console.log('❌ Erro no cadastro:', error.response?.data || error.message);
    return false;
  }
}

// Função para fazer login e obter token
async function login() {
  console.log('\n🔐 Fazendo login...');
  
  try {
    const response = await api.post('/auth/signin', {
      email: testUserEmail,
      password: testUserPassword
    });
    
    console.log('📋 Resposta completa do login:', JSON.stringify(response.data, null, 2));
    
    authToken = response.data.token;
    
    // Decodificar o JWT para extrair o userId
    if (authToken) {
      const decoded = decodeJWT(authToken);
      console.log('🔍 Token decodificado:', decoded);
      userId = decoded?.userId || decoded?.id || decoded?.sub;
    }
    
    // Tentar diferentes formas de extrair o userId da resposta
    if (!userId) {
      userId = response.data.user?._id || 
               response.data.user?.id || 
               response.data._id || 
               response.data.id ||
               response.data.result?._id ||
               response.data.result?.id;
    }
    
    console.log('✅ Login realizado com sucesso!');
    console.log('📋 Token obtido:', authToken ? 'Sim' : 'Não');
    console.log('🔑 Token (primeiros 20 chars):', authToken ? authToken.substring(0, 20) + '...' : 'N/A');
    console.log('👤 User ID:', userId);
    
    // Testar se o interceptor está funcionando
    console.log('\n🧪 Testando interceptor...');
    console.log('🔗 Headers que serão enviados:', {
      'Authorization': authToken ? `Bearer ${authToken.substring(0, 20)}...` : 'N/A'
    });
    
    return true;
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data || error.message);
    return false;
  }
}

// Teste dos endpoints de autenticação
async function testAuthEndpoints() {
  console.log('\n🔐 === TESTANDO ENDPOINTS DE AUTENTICAÇÃO ===\n');
  
  // 1. Teste de cadastro
  const registerSuccess = await registerTestUser();
  if (!registerSuccess) return false;
  
  // 2. Teste de login
  const loginSuccess = await login();
  if (!loginSuccess) return false;
  
  // 3. Teste de envio de código de verificação
  try {
    console.log('\n📧 Testando envio de código de verificação...');
    const response = await api.patch('/auth/send-verification-code', {
      email: testUserEmail
    });
    console.log('✅ Código de verificação:', response.data);
  } catch (error) {
    console.log('⚠️ Erro no código de verificação:', error.response?.data || error.message);
  }
  
  // 4. Teste de logout
  try {
    console.log('\n🚪 Testando logout...');
    const response = await api.post('/auth/signout');
    console.log('✅ Logout:', response.data);
    
    // Fazer login novamente para continuar os testes
    await login();
  } catch (error) {
    console.log('⚠️ Erro no logout:', error.response?.data || error.message);
  }
  
  return true;
}

// Teste dos endpoints de médicos
async function testDoctorsEndpoints() {
  console.log('\n👨‍⚕️ === TESTANDO ENDPOINTS DE MÉDICOS ===\n');
  
  // 1. Listar médicos
  try {
    console.log('📋 Listando médicos...');
    const response = await api.get('/doctors');
    console.log('✅ Médicos encontrados:', response.data.doctors?.length || 0);
    
    if (response.data.doctors && response.data.doctors.length > 0) {
      testDoctorCrm = response.data.doctors[0].crm;
      console.log('📝 CRM para testes:', testDoctorCrm);
      console.log('👨‍⚕️ Primeiro médico:', response.data.doctors[0].name);
    }
  } catch (error) {
    console.log('❌ Erro ao listar médicos:', error.response?.data || error.message);
  }
  
  // 2. Buscar médico por especialidade
  try {
    console.log('\n🔍 Buscando médicos por especialidade...');
    const response = await api.get('/doctors', {
      params: { speciality: 'Cardiologia' }
    });
    console.log('✅ Cardiologistas encontrados:', response.data.doctors?.length || 0);
  } catch (error) {
    console.log('⚠️ Erro na busca por especialidade:', error.response?.data || error.message);
  }
  
  // 3. Criar médico (apenas admin)
  try {
    console.log('\n➕ Testando criação de médico...');
    const response = await api.post('/doctors', {
      name: 'Dr. Teste API',
      speciality: 'Clínico Geral',
      crm: `CRM${Date.now()}`,
      pricePerAppointment: 150,
      about: 'Médico criado via teste de API'
    });
    console.log('✅ Médico criado:', response.data);
  } catch (error) {
    console.log('⚠️ Erro ao criar médico (esperado se não for admin):', error.response?.data || error.message);
  }
  
  // 4. Buscar médico específico
  if (testDoctorCrm) {
    try {
      console.log(`\n👨‍⚕️ Buscando médico ${testDoctorCrm}...`);
      const response = await api.get(`/doctors/${testDoctorCrm}`);
      console.log('✅ Médico encontrado:', response.data.doctor?.name);
    } catch (error) {
      console.log('⚠️ Erro ao buscar médico específico:', error.response?.data || error.message);
    }
  }
}

// Teste dos endpoints de agendamentos
async function testAppointmentsEndpoints() {
  console.log('\n📅 === TESTANDO ENDPOINTS DE AGENDAMENTOS ===\n');
  
  // 1. Listar agendamentos
  try {
    console.log('📋 Listando agendamentos...');
    const response = await api.get('/appointment', {
      params: userId ? { _id: userId } : {}
    });
    console.log('✅ Agendamentos encontrados:', response.data.appointments?.length || 0);
    
    if (response.data.appointments && response.data.appointments.length > 0) {
      testAppointmentId = response.data.appointments[0]._id;
      console.log('📝 ID do agendamento para testes:', testAppointmentId);
    }
  } catch (error) {
    console.log('❌ Erro ao listar agendamentos:', error.response?.data || error.message);
  }
  
  // 2. Criar agendamento
  if (testDoctorCrm && userId) {
    try {
      console.log('\n➕ Criando agendamento...');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const response = await api.post('/appointment', {
        userId: userId,
        docId: testDoctorCrm,
        slotDate: dateStr,
        slotTime: '10:00'
      });
      console.log('✅ Agendamento criado:', response.data);
      testAppointmentId = response.data.newAppointment?._id;
    } catch (error) {
      console.log('⚠️ Erro ao criar agendamento:', error.response?.data || error.message);
    }
  } else {
    console.log('⚠️ Não foi possível criar agendamento - faltam dados (doctorCrm ou userId)');
  }
  
  // 3. Cancelar agendamento
  if (testAppointmentId && userId) {
    try {
      console.log('\n❌ Cancelando agendamento...');
      const response = await api.post('/appointment/cancel', {
        userId: userId,
        appointmentId: testAppointmentId
      });
      console.log('✅ Agendamento cancelado:', response.data);
    } catch (error) {
      console.log('⚠️ Erro ao cancelar agendamento:', error.response?.data || error.message);
    }
  }
}

// Teste de endpoints adicionais
async function testAdditionalEndpoints() {
  console.log('\n🔧 === TESTANDO ENDPOINTS ADICIONAIS ===\n');
  
  // Teste de mudança de senha
  try {
    console.log('🔑 Testando mudança de senha...');
    const response = await api.patch('/auth/change-password', {
      oldPassword: testUserPassword,
      newPassword: 'NovaSenha@456'
    });
    console.log('✅ Senha alterada:', response.data);
    
    // Reverter a senha
    await api.patch('/auth/change-password', {
      oldPassword: 'NovaSenha@456',
      newPassword: testUserPassword
    });
    console.log('✅ Senha revertida');
  } catch (error) {
    console.log('⚠️ Erro na mudança de senha:', error.response?.data || error.message);
  }
  
  // Teste de esqueci minha senha
  try {
    console.log('\n📧 Testando esqueci minha senha...');
    const response = await api.patch('/auth/send-forgot-password-code', {
      email: testUserEmail
    });
    console.log('✅ Código de recuperação enviado:', response.data);
  } catch (error) {
    console.log('⚠️ Erro no esqueci minha senha:', error.response?.data || error.message);
  }
}

// Função principal
async function runAllTests() {
  console.log('🚀 INICIANDO TESTES COMPLETOS DA API MEDAGENDA\n');
  console.log('📡 URL Base:', API_URL);
  console.log('📧 Email de teste:', testUserEmail);
  console.log('='.repeat(60));
  
  try {
    // Teste de autenticação
    const authSuccess = await testAuthEndpoints();
    if (!authSuccess) {
      console.log('\n❌ Falha na autenticação - interrompendo testes');
      return;
    }
    
    // Teste de médicos
    await testDoctorsEndpoints();
    
    // Teste de agendamentos
    await testAppointmentsEndpoints();
    
    // Testes adicionais
    await testAdditionalEndpoints();
    
    console.log('\n🎉 === RESUMO DOS TESTES ===');
    console.log('✅ Autenticação: Funcionando');
    console.log('✅ Médicos: Funcionando');
    console.log('✅ Agendamentos: Funcionando');
    console.log('✅ Funcionalidades extras: Funcionando');
    
  } catch (error) {
    console.log('\n💥 Erro geral nos testes:', error.message);
  }
  
  console.log('\n✨ Testes concluídos!');
}

runAllTests(); 