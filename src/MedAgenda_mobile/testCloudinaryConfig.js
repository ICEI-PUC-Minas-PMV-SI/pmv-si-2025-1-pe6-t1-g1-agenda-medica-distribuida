// Script de teste para verificar configuração do Cloudinary
const { UPLOAD_CONFIG } = require('./config/upload.ts');

console.log('🔧 Testando Configuração do Cloudinary...\n');

// Verificar configurações básicas
console.log('📋 Configurações atuais:');
console.log('- Cloud Name:', UPLOAD_CONFIG.cloudinary.cloudName);
console.log('- Upload Preset:', UPLOAD_CONFIG.cloudinary.uploadPreset);
console.log('- API Key:', UPLOAD_CONFIG.cloudinary.apiKey ? '✅ Configurado' : '❌ Não configurado');
console.log('- API Secret:', UPLOAD_CONFIG.cloudinary.apiSecret ? '✅ Configurado' : '❌ Não configurado');

// Verificar se todas as configurações necessárias estão presentes
const isConfigComplete = 
  UPLOAD_CONFIG.cloudinary.cloudName && 
  UPLOAD_CONFIG.cloudinary.cloudName !== 'SEU_CLOUD_NAME' &&
  UPLOAD_CONFIG.cloudinary.uploadPreset && 
  UPLOAD_CONFIG.cloudinary.uploadPreset !== 'SEU_UPLOAD_PRESET';

console.log('\n🎯 Status da Configuração:');
if (isConfigComplete) {
  console.log('✅ Configuração básica completa!');
  console.log('📝 Próximos passos:');
  console.log('   1. Criar Upload Preset no Cloudinary Console');
  console.log('   2. Testar upload de uma imagem');
} else {
  console.log('❌ Configuração incompleta!');
  console.log('📝 Ações necessárias:');
  
  if (!UPLOAD_CONFIG.cloudinary.cloudName || UPLOAD_CONFIG.cloudinary.cloudName === 'SEU_CLOUD_NAME') {
    console.log('   - Configurar cloudName');
  }
  
  if (!UPLOAD_CONFIG.cloudinary.uploadPreset || UPLOAD_CONFIG.cloudinary.uploadPreset === 'SEU_UPLOAD_PRESET') {
    console.log('   - Criar e configurar uploadPreset no Cloudinary');
  }
}

// Verificar configurações de upload
console.log('\n📊 Configurações de Upload:');
console.log('- Tamanho máximo:', Math.round(UPLOAD_CONFIG.maxFileSize / (1024 * 1024)) + 'MB');
console.log('- Tipos permitidos:', UPLOAD_CONFIG.allowedTypes.join(', '));
console.log('- Qualidade:', Math.round(UPLOAD_CONFIG.imageQuality * 100) + '%');
console.log('- Dimensões máximas:', `${UPLOAD_CONFIG.maxDimensions.width}x${UPLOAD_CONFIG.maxDimensions.height}px`);

// Teste de URL do Cloudinary
const testUrl = `https://api.cloudinary.com/v1_1/${UPLOAD_CONFIG.cloudinary.cloudName}/image/upload`;
console.log('\n🌐 URL de Upload:', testUrl);

console.log('\n📖 Para mais informações, consulte: README_CLOUDINARY.md'); 