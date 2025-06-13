// Teste para verificar se as imagens dos médicos estão sendo exibidas
const { doctors } = require('./services/api.ts');

async function testDoctorImagesDisplay() {
  console.log('🧪 === TESTE DE EXIBIÇÃO DE IMAGENS DE MÉDICOS ===');
  
  try {
    // 1. Buscar todos os médicos
    console.log('1️⃣ Buscando lista de médicos...');
    const doctorsList = await doctors.getAll();
    
    console.log(`✅ ${doctorsList.length} médicos encontrados`);
    
    // 2. Verificar quais médicos têm imagens
    const doctorsWithImages = doctorsList.filter(doctor => doctor.image);
    const doctorsWithoutImages = doctorsList.filter(doctor => !doctor.image);
    
    console.log('📊 Estatísticas de imagens:');
    console.log(`✅ Médicos com imagem: ${doctorsWithImages.length}`);
    console.log(`❌ Médicos sem imagem: ${doctorsWithoutImages.length}`);
    
    // 3. Listar médicos com suas imagens
    console.log('\n👨‍⚕️ === MÉDICOS COM IMAGENS ===');
    doctorsWithImages.forEach((doctor, index) => {
      console.log(`${index + 1}. ${doctor.name}`);
      console.log(`   🔗 Imagem: ${doctor.image}`);
      console.log(`   🏥 Especialidade: ${doctor.specialty || 'Não informada'}`);
      console.log(`   💰 Valor: R$ ${doctor.fees || 'Não informado'}`);
      console.log('   ---');
    });
    
    // 4. Listar médicos sem imagens
    if (doctorsWithoutImages.length > 0) {
      console.log('\n⚠️ === MÉDICOS SEM IMAGENS ===');
      doctorsWithoutImages.forEach((doctor, index) => {
        console.log(`${index + 1}. ${doctor.name}`);
        console.log(`   🏥 Especialidade: ${doctor.specialty || 'Não informada'}`);
        console.log(`   💰 Valor: R$ ${doctor.fees || 'Não informado'}`);
        console.log('   📝 Status: Sem imagem - será exibido emoji 👨‍⚕️');
        console.log('   ---');
      });
    }
    
    // 5. Verificar URLs das imagens
    console.log('\n🔍 === VERIFICAÇÃO DE URLs ===');
    for (const doctor of doctorsWithImages) {
      if (doctor.image) {
        const isCloudinaryUrl = doctor.image.includes('cloudinary.com');
        const isValidUrl = doctor.image.startsWith('http');
        
        console.log(`📋 ${doctor.name}:`);
        console.log(`   🔗 URL: ${doctor.image.substring(0, 80)}...`);
        console.log(`   ☁️ Cloudinary: ${isCloudinaryUrl ? '✅' : '❌'}`);
        console.log(`   🌐 URL válida: ${isValidUrl ? '✅' : '❌'}`);
        console.log('   ---');
      }
    }
    
    // 6. Resumo final
    console.log('\n🎯 === RESUMO FINAL ===');
    console.log(`Total de médicos: ${doctorsList.length}`);
    console.log(`Com imagens: ${doctorsWithImages.length} (${Math.round((doctorsWithImages.length / doctorsList.length) * 100)}%)`);
    console.log(`Sem imagens: ${doctorsWithoutImages.length} (${Math.round((doctorsWithoutImages.length / doctorsList.length) * 100)}%)`);
    
    if (doctorsWithImages.length > 0) {
      console.log('✅ As imagens serão exibidas na tela de administração');
    } else {
      console.log('⚠️ Nenhum médico tem imagem - todos mostrarão emoji padrão');
    }
    
    return {
      success: true,
      total: doctorsList.length,
      withImages: doctorsWithImages.length,
      withoutImages: doctorsWithoutImages.length,
      doctors: doctorsList
    };

  } catch (error) {
    console.error('❌ Erro ao testar exibição de imagens:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Teste específico de URL de imagem
async function testImageUrl(imageUrl) {
  console.log('🔍 === TESTE ESPECÍFICO DE URL ===');
  console.log(`🔗 Testando URL: ${imageUrl}`);
  
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    console.log(`📡 Status: ${response.status}`);
    console.log(`📋 Content-Type: ${response.headers.get('content-type')}`);
    console.log(`📏 Content-Length: ${response.headers.get('content-length')}`);
    
    if (response.ok) {
      console.log('✅ URL da imagem é válida e acessível');
      return true;
    } else {
      console.log('❌ URL da imagem retornou erro');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro ao acessar URL:', error.message);
    return false;
  }
}

// Executar teste
if (require.main === module) {
  console.log('🚀 Iniciando teste de exibição de imagens...');
  
  testDoctorImagesDisplay()
    .then(result => {
      console.log('\n🏁 Resultado final:', result);
      
      if (result.success && result.withImages > 0) {
        console.log('\n🎉 SUCESSO! As imagens dos médicos serão exibidas na tela de administração.');
        console.log('📱 Para ver: Abra o app → Login como admin → Tela Médicos');
      } else if (result.success && result.withImages === 0) {
        console.log('\n⚠️ INFO: Nenhum médico tem imagem cadastrada ainda.');
        console.log('💡 Dica: Cadastre médicos com imagens pelo formulário de administração.');
      } else {
        console.log('\n💥 ERRO:', result.error);
      }
    })
    .catch(error => {
      console.error('💥 Erro fatal:', error);
    });
}

module.exports = {
  testDoctorImagesDisplay,
  testImageUrl
}; 