// Teste detalhado para identificar o problema específico do upload
console.log('🔍 Teste Detalhado do Erro de Upload\n');

// Simular a configuração atual
const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  imageQuality: 0.8,
  maxDimensions: {
    width: 800,
    height: 800,
  },
};

console.log('📋 Configuração atual:', UPLOAD_CONFIG);

// Simular diferentes cenários de ImagePicker.ImagePickerAsset
const testAssets = [
  // Cenário 1: Asset típico do Android
  {
    uri: 'content://media/external/images/media/12345',
    type: 'image/jpeg',
    fileSize: 2048000, // 2MB
    width: 1920,
    height: 1080,
    scenario: 'Android Gallery'
  },
  
  // Cenário 2: Asset típico do iOS
  {
    uri: 'ph://CC95F08C-88C3-4012-9D6D-64CFE5B90D11/L0/001',
    type: 'image/jpeg',
    fileSize: 1536000, // 1.5MB
    width: 1024,
    height: 768,
    scenario: 'iOS Photos'
  },
  
  // Cenário 3: Asset do Expo ImagePicker
  {
    uri: 'file:///var/mobile/Containers/Data/Application/ImagePicker/image.jpg',
    type: 'image/jpeg',
    fileSize: 3072000, // 3MB
    width: 800,
    height: 600,
    scenario: 'Expo ImagePicker'
  },
  
  // Cenário 4: Asset sem extensão clara
  {
    uri: 'content://com.android.providers.media.documents/document/image%3A12345',
    type: 'image/png',
    fileSize: 1024000, // 1MB
    width: 640,
    height: 480,
    scenario: 'Android Document Provider'
  },
  
  // Cenário 5: Asset com tipo undefined (problema comum)
  {
    uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20241204_123456.jpg',
    type: undefined,
    fileSize: 4096000, // 4MB
    width: 1920,
    height: 1080,
    scenario: 'Android Camera (tipo undefined)'
  }
];

// Função de detecção de tipo MIME (igual à implementada)
function getImageTypeFromUri(uri) {
  console.log('  🔍 Analisando URI:', uri);
  
  const extension = uri.split('.').pop()?.toLowerCase();
  console.log('  📄 Extensão detectada:', extension);
  
  const cleanExtension = extension?.split('?')[0]?.split('#')[0];
  console.log('  🧹 Extensão limpa:', cleanExtension);
  
  switch (cleanExtension) {
    case 'jpg':
    case 'jpeg':
      console.log('  ✅ Tipo detectado: JPEG');
      return 'image/jpeg';
    case 'png':
      console.log('  ✅ Tipo detectado: PNG');
      return 'image/png';
    case 'webp':
      console.log('  ✅ Tipo detectado: WebP');
      return 'image/webp';
    default:
      console.log('  ⚠️ Extensão não reconhecida, usando JPEG como fallback');
      return 'image/jpeg';
  }
}

// Função de validação (igual à implementada)
function validateImage(imageAsset) {
  console.log('  🔍 Validando imagem:', {
    uri: imageAsset.uri,
    fileSize: imageAsset.fileSize,
    width: imageAsset.width,
    height: imageAsset.height,
    type: imageAsset.type
  });

  try {
    // Verificar tamanho do arquivo
    if (imageAsset.fileSize && imageAsset.fileSize > UPLOAD_CONFIG.maxFileSize) {
      const maxSizeMB = Math.round(UPLOAD_CONFIG.maxFileSize / (1024 * 1024));
      const fileSizeMB = Math.round(imageAsset.fileSize / (1024 * 1024));
      const error = `Arquivo muito grande (${fileSizeMB}MB). Tamanho máximo: ${maxSizeMB}MB`;
      console.log('  ❌ Erro de tamanho:', error);
      return { valid: false, error };
    }

    // Verificar tipo de arquivo pela extensão da URI
    const mimeType = getImageTypeFromUri(imageAsset.uri);
    console.log('  🎯 Tipo MIME detectado:', mimeType);
    console.log('  📋 Tipos permitidos:', UPLOAD_CONFIG.allowedTypes);
    
    // Validação primária por extensão
    let isValidType = UPLOAD_CONFIG.allowedTypes.includes(mimeType);
    console.log('  📊 Validação por extensão:', isValidType);
    
    // Validação alternativa se o tipo do asset estiver disponível
    if (!isValidType && imageAsset.type) {
      console.log('  🔄 Tentando validação alternativa com asset.type:', imageAsset.type);
      isValidType = UPLOAD_CONFIG.allowedTypes.includes(imageAsset.type);
      console.log('  📊 Validação por asset.type:', isValidType);
    }
    
    // Validação mais permissiva para URIs do expo/react-native
    if (!isValidType && (imageAsset.uri.includes('ImagePicker') || imageAsset.uri.includes('expo') || imageAsset.uri.includes('content://') || imageAsset.uri.includes('ph://'))) {
      console.log('  🔄 URI especial detectada, assumindo tipo válido');
      isValidType = true;
    }
    
    if (!isValidType) {
      const error = 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
      console.log('  ❌ Tipo não permitido:', { mimeType, assetType: imageAsset.type });
      return { valid: false, error };
    }

    // Verificar se o tipo do asset também é válido (se disponível)
    if (imageAsset.type && !imageAsset.type.startsWith('image/') && !imageAsset.uri.includes('ImagePicker')) {
      const error = 'Arquivo selecionado não é uma imagem válida.';
      console.log('  ❌ Asset type inválido:', imageAsset.type);
      return { valid: false, error };
    }

    console.log('  ✅ Imagem validada com sucesso');
    return { valid: true, error: null };
  } catch (error) {
    console.log('  ❌ Erro na validação da imagem:', error);
    return { valid: false, error: 'Erro ao validar a imagem selecionada.' };
  }
}

// Testar todos os cenários
console.log('\n🧪 Testando diferentes cenários de assets:\n');

testAssets.forEach((asset, index) => {
  console.log(`\n--- Teste ${index + 1}: ${asset.scenario} ---`);
  const result = validateImage(asset);
  console.log(`  Resultado: ${result.valid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  if (!result.valid) {
    console.log(`  Erro: ${result.error}`);
  }
  console.log('---');
});

console.log('\n🔍 Análise dos Resultados:');
console.log('Se algum teste falhou, isso indica onde está o problema.');
console.log('Verifique especialmente:');
console.log('1. Assets sem extensão clara na URI');
console.log('2. Assets com type undefined');
console.log('3. URIs especiais do Android/iOS');

console.log('\n💡 Possíveis soluções:');
console.log('1. Melhorar detecção de tipo para URIs sem extensão');
console.log('2. Usar asset.type como fonte primária quando disponível');
console.log('3. Implementar fallback mais robusto');

console.log('\n📱 Para debug no app real:');
console.log('1. Adicione console.log no hook useImageUpload');
console.log('2. Verifique exatamente qual asset está sendo passado');
console.log('3. Compare com os cenários testados aqui'); 