// Teste corrigido para verificar o cadastro de médico
import { doctors } from './services/api';
import { testAuthentication } from './testAuth';

async function testDoctorRegistrationFixed() {
  console.log('🧪 === TESTE CORRIGIDO DE CADASTRO DE MÉDICO ===');
  
  try {
    // 1. Verificar autenticação primeiro
    console.log('1️⃣ Verificando autenticação...');
    const isAuthenticated = await testAuthentication();
    
    if (!isAuthenticated) {
      throw new Error('Usuário não está autenticado ou não é administrador');
    }
    
    // 2. Dados corretos para cadastro de médico
    const doctorTestData = {
      name: 'Dr. Carlos Mendes',
      speciality: 'Neurologia',
      crm: 'CRM99999TEST',
      pricePerAppointment: 350, // Campo correto que o backend espera
      doctorImage: 'https://res.cloudinary.com/dmwhqs5ak/image/upload/v1234567890/medagenda/doctors/neurologist.jpg',
      about: 'Neurologista com 12 anos de experiência em neurologia clínica e cirúrgica. Especialista em epilepsia e transtornos do movimento.'
    };

    console.log('2️⃣ Dados do médico a ser cadastrado:', doctorTestData);
    
    // 3. Testar criação do médico
    console.log('3️⃣ Enviando dados para a API...');
    const newDoctor = await doctors.createDoctor(doctorTestData);
    
    console.log('✅ Médico cadastrado com sucesso!');
    console.log('👨‍⚕️ Dados do médico cadastrado:', {
      id: newDoctor.id,
      name: newDoctor.name,
      specialty: newDoctor.specialty,
      crm: newDoctor.crm,
      fees: newDoctor.fees,
      image: newDoctor.image,
      about: newDoctor.about
    });
    
    // 4. Verificar se a imagem foi salva corretamente
    if (newDoctor.image) {
      console.log('🖼️ URL da imagem salva:', newDoctor.image);
      console.log('✅ Imagem foi enviada e salva com sucesso no backend!');
    } else {
      console.log('⚠️ Imagem não foi salva no backend');
    }
    
    return {
      success: true,
      doctor: newDoctor
    };

  } catch (error) {
    console.error('❌ Erro no teste de cadastro:', error);
    console.error('📋 Detalhes do erro:', {
      message: error.message,
      status: error.status,
      response: error.response?.data
    });
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Teste simples de dados
async function testDataValidation() {
  console.log('🧪 === TESTE DE VALIDAÇÃO DE DADOS ===');
  
  const testData = {
    name: 'Dr. Teste',
    speciality: 'Clínico Geral',
    crm: 'CRMTEST123',
    pricePerAppointment: 200,
    doctorImage: '',
    about: 'Médico para teste'
  };
  
  console.log('📋 Estrutura dos dados:', testData);
  console.log('✅ Todos os campos obrigatórios presentes:', {
    name: !!testData.name,
    speciality: !!testData.speciality,
    crm: !!testData.crm,
    pricePerAppointment: !!testData.pricePerAppointment,
    about: !!testData.about
  });
  
  return testData;
}

// Executar teste
if (require.main === module) {
  console.log('🚀 Iniciando testes corrigidos...');
  
  testDataValidation()
    .then(() => testDoctorRegistrationFixed())
    .then(result => {
      console.log('🏁 Resultado final:', result);
      if (result.success) {
        console.log('🎉 TESTE PASSOU! Cadastro funcionando corretamente.');
      } else {
        console.log('💥 TESTE FALHOU:', result.error);
      }
    })
    .catch(error => {
      console.error('💥 Erro fatal:', error);
    });
}

export {
  testDoctorRegistrationFixed,
  testDataValidation
}; 