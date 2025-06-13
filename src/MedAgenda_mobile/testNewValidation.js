// Teste da nova lógica de validação que prioriza asset.type
console.log('🧪 Testando Nova Lógica de Validação\n');

const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  imageQuality: 0.8,
  maxDimensions: {
    width: 800,
    height: 800,
  },
};

// Função de detecção de tipo MIME por URI
function getImageTypeFromUri(uri) {
  const extension = uri.split('.').pop()?.toLowerCase();
  const cleanExtension = extension?.split('?')[0]?.split('#')[0];
  
  switch (cleanExtension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/jpeg'; // fallback
  }
}

// Nova função de validação melhorada
function validateImageNew(imageAsset) {
  console.log('🔍 Validando imagem:', {
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
      console.log('❌ Erro de tamanho:', error);
      return { valid: false, error };
    }

    // NOVA LÓGICA: Priorizar asset.type quando disponível e válido
    let detectedMimeType;
    let validationSource;

    if (imageAsset.type && imageAsset.type.startsWith('image/')) {
      // Usar asset.type se disponível e válido
      detectedMimeType = imageAsset.type;
      validationSource = 'asset.type';
      console.log('🎯 Usando asset.type:', detectedMimeType);
    } else {
      // Fallback para detecção por URI
      detectedMimeType = getImageTypeFromUri(imageAsset.uri);
      validationSource = 'URI extension';
      console.log('🎯 Usando detecção por URI:', detectedMimeType);
    }

    console.log('📋 Tipos permitidos:', UPLOAD_CONFIG.allowedTypes);
    console.log('🔍 Fonte da validação:', validationSource);
    
    // Verificar se o tipo detectado é permitido
    let isValidType = UPLOAD_CONFIG.allowedTypes.includes(detectedMimeType);
    console.log('📊 Validação inicial:', isValidType);
    
    // Se não passou na validação inicial, tentar estratégias alternativas
    if (!isValidType) {
      console.log('🔄 Tentando estratégias alternativas...');
      
      // Estratégia 1: URIs especiais sempre aceitas
      const specialUriPatterns = [
        'ImagePicker',
        'expo',
        'content://',
        'ph://',
        '/DCIM/',
        '/Camera/',
        'media/external'
      ];
      
      const isSpecialUri = specialUriPatterns.some(pattern => 
        imageAsset.uri.includes(pattern)
      );
      
      if (isSpecialUri) {
        console.log('✅ URI especial detectada, assumindo tipo válido');
        isValidType = true;
      }
      
      // Estratégia 2: Se asset.type não foi usado, tentar usá-lo agora
      if (!isValidType && imageAsset.type && validationSource !== 'asset.type') {
        console.log('🔄 Tentando com asset.type como fallback:', imageAsset.type);
        isValidType = UPLOAD_CONFIG.allowedTypes.includes(imageAsset.type);
        if (isValidType) {
          detectedMimeType = imageAsset.type;
          console.log('✅ Validação bem-sucedida com asset.type');
        }
      }
      
      // Estratégia 3: Para URIs sem extensão clara, assumir JPEG
      if (!isValidType && !imageAsset.uri.includes('.')) {
        console.log('🔄 URI sem extensão detectada, assumindo JPEG');
        detectedMimeType = 'image/jpeg';
        isValidType = true;
      }
    }
    
    if (!isValidType) {
      const error = 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
      console.log('❌ Tipo não permitido após todas as tentativas:', { 
        detectedMimeType, 
        assetType: imageAsset.type,
        uri: imageAsset.uri 
      });
      return { valid: false, error };
    }

    console.log('✅ Imagem validada com sucesso');
    console.log('📊 Tipo final aceito:', detectedMimeType);
    return { valid: true, error: null, detectedMimeType, validationSource };
  } catch (error) {
    console.log('❌ Erro na validação da imagem:', error);
    return { valid: false, error: 'Erro ao validar a imagem selecionada.' };
  }
}

// Cenários de teste mais específicos para o problema relatado
const problematicAssets = [
  // Cenário problemático 1: Asset com type undefined
  {
    uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20241204_123456.jpg',
    type: undefined,
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'Android Camera - type undefined (PROBLEMA COMUM)'
  },
  
  // Cenário problemático 2: Asset com type null
  {
    uri: 'content://media/external/images/media/12345',
    type: null,
    fileSize: 1536000,
    width: 1024,
    height: 768,
    scenario: 'Android Gallery - type null'
  },
  
  // Cenário problemático 3: Asset com type inválido
  {
    uri: 'ph://CC95F08C-88C3-4012-9D6D-64CFE5B90D11/L0/001',
    type: 'application/octet-stream',
    fileSize: 3072000,
    width: 800,
    height: 600,
    scenario: 'iOS Photos - type inválido'
  },
  
  // Cenário problemático 4: URI sem extensão
  {
    uri: 'content://com.android.providers.media.documents/document/image%3A12345',
    type: 'image/png',
    fileSize: 1024000,
    width: 640,
    height: 480,
    scenario: 'Android Document Provider - URI sem extensão'
  },
  
  // Cenário problemático 5: URI sem extensão E type undefined
  {
    uri: 'content://com.google.android.apps.photos.contentprovider/0/1/content%3A//media/external/images/media/12345',
    type: undefined,
    fileSize: 2560000,
    width: 1280,
    height: 960,
    scenario: 'Google Photos - URI complexa sem extensão e type undefined (PIOR CASO)'
  },
  
  // Cenário de controle: Asset normal que deveria funcionar
  {
    uri: 'file:///var/mobile/Containers/Data/Application/ImagePicker/image.jpg',
    type: 'image/jpeg',
    fileSize: 1024000,
    width: 800,
    height: 600,
    scenario: 'Expo ImagePicker - Normal (CONTROLE)'
  }
];

console.log('🧪 Testando cenários problemáticos específicos:\n');

problematicAssets.forEach((asset, index) => {
  console.log(`\n--- Teste ${index + 1}: ${asset.scenario} ---`);
  const result = validateImageNew(asset);
  console.log(`Resultado: ${result.valid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  if (result.valid) {
    console.log(`Tipo detectado: ${result.detectedMimeType}`);
    console.log(`Fonte: ${result.validationSource}`);
  } else {
    console.log(`Erro: ${result.error}`);
  }
  console.log('---');
});

console.log('\n📊 Análise dos Resultados:');
console.log('A nova lógica deve resolver os problemas:');
console.log('1. ✅ Prioriza asset.type quando disponível e válido');
console.log('2. ✅ Fallback robusto para detecção por URI');
console.log('3. ✅ Estratégias alternativas para casos especiais');
console.log('4. ✅ Aceita URIs especiais automaticamente');
console.log('5. ✅ Assume JPEG para URIs sem extensão');

console.log('\n🎯 Principais Melhorias:');
console.log('• asset.type tem prioridade sobre detecção por URI');
console.log('• Múltiplas estratégias de fallback');
console.log('• Logs detalhados para debug');
console.log('• Validação mais permissiva para fontes confiáveis');

console.log('\n📱 Para testar no app:');
console.log('1. Selecione imagens de diferentes fontes');
console.log('2. Verifique os logs detalhados no console');
console.log('3. O erro "Tipo de arquivo não suportado" deve desaparecer'); 