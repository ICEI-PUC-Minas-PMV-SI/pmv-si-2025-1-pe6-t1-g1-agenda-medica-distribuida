// Teste direto de upload para Cloudinary
console.log('🧪 Teste Direto de Upload para Cloudinary\n');

// Configuração do Cloudinary
const CLOUDINARY_CONFIG = {
  cloudName: 'dmwhqs5ak',
  uploadPreset: 'medagenda_doctors',
  apiKey: '194188398449739',
  apiSecret: 'QLywGbHzrRSGUNx0848PnaABRgc'
};

// Simular uma imagem base64 pequena (1x1 pixel PNG)
const TEST_IMAGE_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testCloudinaryUpload() {
  try {
    console.log('🚀 Iniciando teste de upload...');
    console.log('📊 Configuração:', {
      cloudName: CLOUDINARY_CONFIG.cloudName,
      uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
      hasApiKey: !!CLOUDINARY_CONFIG.apiKey
    });

    // Criar FormData
    const formData = new FormData();
    
    // Converter base64 para blob
    const response = await fetch(TEST_IMAGE_BASE64);
    const blob = await response.blob();
    
    console.log('📄 Dados da imagem de teste:', {
      size: blob.size,
      type: blob.type
    });

    // Adicionar dados ao FormData
    formData.append('file', blob, 'test-image.png');
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);
    formData.append('folder', 'doctors');

    console.log('🌐 Enviando para Cloudinary...');
    
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    console.log('📡 Status da resposta:', uploadResponse.status);
    console.log('📡 Headers da resposta:', Object.fromEntries(uploadResponse.headers.entries()));

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('❌ Erro na resposta:', errorData);
      throw new Error(`Upload failed: ${uploadResponse.status} - ${errorData}`);
    }

    const result = await uploadResponse.json();
    console.log('✅ Upload bem-sucedido!');
    console.log('🔗 URL da imagem:', result.secure_url);
    console.log('📊 Dados completos:', result);

    return result;
  } catch (error) {
    console.error('❌ Erro no teste de upload:', error);
    throw error;
  }
}

// Teste alternativo com upload preset público
async function testWithPublicPreset() {
  try {
    console.log('\n🔄 Tentando com upload preset público...');
    
    const formData = new FormData();
    
    // Converter base64 para blob
    const response = await fetch(TEST_IMAGE_BASE64);
    const blob = await response.blob();
    
    // Usar preset público padrão
    formData.append('file', blob, 'test-image.png');
    formData.append('upload_preset', 'ml_default'); // Preset público padrão
    formData.append('cloud_name', CLOUDINARY_CONFIG.cloudName);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    console.log('📡 Status (preset público):', uploadResponse.status);

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error('❌ Erro com preset público:', errorData);
      return null;
    }

    const result = await uploadResponse.json();
    console.log('✅ Upload com preset público bem-sucedido!');
    console.log('🔗 URL:', result.secure_url);
    return result;
  } catch (error) {
    console.error('❌ Erro no teste com preset público:', error);
    return null;
  }
}

// Executar testes
async function runTests() {
  console.log('🧪 Executando testes de upload para Cloudinary...\n');
  
  try {
    // Teste 1: Com o preset configurado
    await testCloudinaryUpload();
  } catch (error) {
    console.log('\n⚠️ Teste principal falhou, tentando alternativas...');
    
    // Teste 2: Com preset público
    await testWithPublicPreset();
  }
  
  console.log('\n📋 Análise dos resultados:');
  console.log('1. Se o upload funcionou: O problema está na validação do app');
  console.log('2. Se falhou com "Invalid upload preset": Precisa criar o preset no Cloudinary');
  console.log('3. Se falhou com erro de autenticação: Verificar credenciais');
  console.log('4. Se funcionou com preset público: Usar esse como fallback');
}

// Executar os testes
runTests().catch(console.error); 