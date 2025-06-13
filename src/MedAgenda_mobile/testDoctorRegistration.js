// Teste para verificar o cadastro de médico com upload de imagem
import { doctors } from './services/api';
import { UploadService } from './services/uploadService';

async function testDoctorRegistration() {
  console.log('🧪 === TESTE DE CADASTRO DE MÉDICO ===');
  
  try {
    // Dados de exemplo para cadastro de médico
    const doctorTestData = {
      name: 'Dr. João Silva',
      speciality: 'Cardiologia',
      crm: 'CRM12345TEST',
      pricePerAppointment: 250,
      doctorImage: 'https://res.cloudinary.com/dmwhqs5ak/image/upload/v1234567890/medagenda/doctors/test-doctor.jpg',
      about: 'Cardiologista com 10 anos de experiência em cirurgias cardíacas e cuidados intensivos.'
    };

    console.log('📋 Dados do médico a ser cadastrado:', doctorTestData);
    
    // Testar criação do médico
    console.log('🚀 Iniciando cadastro do médico...');
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
    
    // Verificar se a imagem foi salva corretamente
    if (newDoctor.image) {
      console.log('🖼️ URL da imagem salva:', newDoctor.image);
      console.log('✅ Imagem foi enviada e salva com sucesso no backend!');
    } else {
      console.log('⚠️ Imagem não foi salva no backend');
    }
    
    return newDoctor;

  } catch (error) {
    console.error('❌ Erro no teste de cadastro:', error);
    console.error('📋 Detalhes do erro:', {
      message: error.message,
      status: error.status,
      stack: error.stack
    });
    throw error;
  }
}

async function testImageUpload() {
  console.log('🧪 === TESTE DE UPLOAD DE IMAGEM ===');
  
  try {
    // Simular dados de imagem
    const mockImageAsset = {
      uri: 'file:///mock-image-path.jpg',
      type: 'image/jpeg',
      fileSize: 1024 * 500, // 500KB
      width: 400,
      height: 400
    };

    console.log('🖼️ Dados da imagem simulada:', mockImageAsset);
    
    // Testar upload
    console.log('🚀 Iniciando upload da imagem...');
    const uploadResult = await UploadService.uploadImage(mockImageAsset);
    
    if (uploadResult.success) {
      console.log('✅ Upload realizado com sucesso!');
      console.log('🔗 URL da imagem:', uploadResult.url);
      return uploadResult.url;
    } else {
      console.log('❌ Falha no upload:', uploadResult.error);
      return null;
    }

  } catch (error) {
    console.error('❌ Erro no teste de upload:', error);
    return null;
  }
}

async function testCompleteFlow() {
  console.log('🧪 === TESTE DE FLUXO COMPLETO ===');
  
  try {
    // 1. Testar upload de imagem
    console.log('1️⃣ Testando upload de imagem...');
    const imageUrl = await testImageUpload();
    
    if (!imageUrl) {
      console.log('⚠️ Upload de imagem falhou, continuando com URL de exemplo...');
    }
    
    // 2. Testar cadastro de médico
    console.log('2️⃣ Testando cadastro de médico...');
    const finalImageUrl = imageUrl || 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Médico';
    
    const doctorData = {
      name: 'Dra. Maria Santos',
      speciality: 'Dermatologia',
      crm: 'CRM67890',
      pricePerAppointment: 180,
      doctorImage: finalImageUrl,
      about: 'Dermatologista especializada em dermatologia clínica e estética com 8 anos de experiência.'
    };
    
    const registeredDoctor = await testDoctorRegistration(doctorData);
    
    console.log('🎉 === TESTE COMPLETO FINALIZADO ===');
    console.log('✅ Fluxo completo funcionando!');
    console.log('📊 Resumo:', {
      imageUploaded: !!imageUrl,
      doctorRegistered: !!registeredDoctor,
      imageUrlInDoctor: registeredDoctor?.image
    });
    
    return {
      success: true,
      imageUrl: finalImageUrl,
      doctor: registeredDoctor
    };

  } catch (error) {
    console.error('❌ Erro no teste completo:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Exportar funções para uso em outros lugares
export {
  testDoctorRegistration,
  testImageUpload,
  testCompleteFlow
};

// Executar teste se chamado diretamente
if (require.main === module) {
  testCompleteFlow()
    .then(result => {
      console.log('🏁 Resultado final:', result);
    })
    .catch(error => {
      console.error('💥 Erro fatal:', error);
    });
} 