// Teste específico para identificar o problema na validação
console.log('🔍 Teste Específico - Identificando Problema na Validação\n');

// Simular exatamente o que acontece no app móvel
const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  imageQuality: 0.8,
  maxDimensions: {
    width: 800,
    height: 800,
  },
};

// Cenários REAIS que podem estar causando o problema
const realWorldScenarios = [
  // Cenário 1: Asset típico do Android com type undefined
  {
    uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20241205_143022.jpg',
    type: undefined,
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'Android Camera - CENÁRIO MAIS PROVÁVEL'
  },
  
  // Cenário 2: Asset do Android Gallery com type null
  {
    uri: 'content://media/external/images/media/12345',
    type: null,
    fileSize: 1536000,
    width: 1024,
    height: 768,
    scenario: 'Android Gallery - type null'
  },
  
  // Cenário 3: Asset com type incorreto
  {
    uri: 'content://com.android.providers.media.documents/document/image%3A12345',
    type: 'application/octet-stream',
    fileSize: 1024000,
    width: 640,
    height: 480,
    scenario: 'Android Document Provider - type incorreto'
  },
  
  // Cenário 4: URI sem extensão
  {
    uri: 'content://com.google.android.apps.photos.contentprovider/image',
    type: undefined,
    fileSize: 2560000,
    width: 1280,
    height: 960,
    scenario: 'Google Photos - URI sem extensão'
  }
];

// Função de validação ATUAL (a que está falhando)
function validateImageCurrent(imageAsset) {
  console.log('🔍 [ATUAL] Validando:', {
    uri: imageAsset.uri,
    type: imageAsset.type,
    scenario: imageAsset.scenario
  });

  try {
    // Verificar tamanho
    if (imageAsset.fileSize && imageAsset.fileSize > UPLOAD_CONFIG.maxFileSize) {
      const error = 'Arquivo muito grande';
      console.log('❌ [ATUAL] Erro de tamanho:', error);
      return { valid: false, error };
    }

    // Detecção de tipo MIME por URI (método atual)
    const extension = imageAsset.uri.split('.').pop()?.toLowerCase();
    const cleanExtension = extension?.split('?')[0]?.split('#')[0];
    
    let mimeType;
    switch (cleanExtension) {
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'webp':
        mimeType = 'image/webp';
        break;
      default:
        mimeType = 'image/jpeg'; // fallback
    }

    console.log('🎯 [ATUAL] Tipo detectado por URI:', mimeType);
    console.log('📋 [ATUAL] Tipos permitidos:', UPLOAD_CONFIG.allowedTypes);
    
    // Validação primária
    let isValidType = UPLOAD_CONFIG.allowedTypes.includes(mimeType);
    console.log('📊 [ATUAL] Validação por URI:', isValidType);
    
    // Validação alternativa com asset.type
    if (!isValidType && imageAsset.type) {
      console.log('🔄 [ATUAL] Tentando com asset.type:', imageAsset.type);
      isValidType = UPLOAD_CONFIG.allowedTypes.includes(imageAsset.type);
      console.log('📊 [ATUAL] Validação por asset.type:', isValidType);
    }
    
    // Fallback para URIs especiais
    if (!isValidType && (imageAsset.uri.includes('content://') || imageAsset.uri.includes('ph://'))) {
      console.log('🔄 [ATUAL] URI especial detectada');
      isValidType = true;
    }
    
    if (!isValidType) {
      const error = 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
      console.log('❌ [ATUAL] ERRO ENCONTRADO:', error);
      return { valid: false, error };
    }

    console.log('✅ [ATUAL] Validação passou');
    return { valid: true, error: null };
  } catch (error) {
    console.log('❌ [ATUAL] Erro na validação:', error);
    return { valid: false, error: 'Erro ao validar imagem' };
  }
}

// Função de validação MELHORADA
function validateImageImproved(imageAsset) {
  console.log('🔍 [MELHORADA] Validando:', {
    uri: imageAsset.uri,
    type: imageAsset.type,
    scenario: imageAsset.scenario
  });

  try {
    // Verificar tamanho
    if (imageAsset.fileSize && imageAsset.fileSize > UPLOAD_CONFIG.maxFileSize) {
      const error = 'Arquivo muito grande';
      console.log('❌ [MELHORADA] Erro de tamanho:', error);
      return { valid: false, error };
    }

    // NOVA LÓGICA: Priorizar asset.type quando válido
    let detectedMimeType;
    let validationSource;

    if (imageAsset.type && imageAsset.type.startsWith('image/')) {
      detectedMimeType = imageAsset.type;
      validationSource = 'asset.type';
      console.log('🎯 [MELHORADA] Usando asset.type:', detectedMimeType);
    } else {
      // Fallback para URI
      const extension = imageAsset.uri.split('.').pop()?.toLowerCase();
      const cleanExtension = extension?.split('?')[0]?.split('#')[0];
      
      switch (cleanExtension) {
        case 'jpg':
        case 'jpeg':
          detectedMimeType = 'image/jpeg';
          break;
        case 'png':
          detectedMimeType = 'image/png';
          break;
        case 'webp':
          detectedMimeType = 'image/webp';
          break;
        default:
          detectedMimeType = 'image/jpeg';
      }
      validationSource = 'URI extension';
      console.log('🎯 [MELHORADA] Usando detecção por URI:', detectedMimeType);
    }

    // Verificar se é válido
    let isValidType = UPLOAD_CONFIG.allowedTypes.includes(detectedMimeType);
    console.log('📊 [MELHORADA] Validação inicial:', isValidType);
    
    // Estratégias de fallback
    if (!isValidType) {
      console.log('🔄 [MELHORADA] Aplicando fallbacks...');
      
      // Fallback 1: URIs especiais
      const specialPatterns = ['content://', 'ph://', 'ImagePicker', '/DCIM/', '/Camera/'];
      const isSpecialUri = specialPatterns.some(pattern => imageAsset.uri.includes(pattern));
      
      if (isSpecialUri) {
        console.log('✅ [MELHORADA] URI especial aceita automaticamente');
        isValidType = true;
      }
      
      // Fallback 2: asset.type como última tentativa
      if (!isValidType && imageAsset.type && validationSource !== 'asset.type') {
        isValidType = UPLOAD_CONFIG.allowedTypes.includes(imageAsset.type);
        if (isValidType) {
          console.log('✅ [MELHORADA] asset.type aceito como fallback');
        }
      }
      
      // Fallback 3: Assumir JPEG para URIs sem extensão
      if (!isValidType && !imageAsset.uri.includes('.')) {
        console.log('✅ [MELHORADA] URI sem extensão, assumindo JPEG');
        isValidType = true;
      }
    }
    
    if (!isValidType) {
      const error = 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
      console.log('❌ [MELHORADA] ERRO (não deveria acontecer):', error);
      return { valid: false, error };
    }

    console.log('✅ [MELHORADA] Validação passou');
    return { valid: true, error: null };
  } catch (error) {
    console.log('❌ [MELHORADA] Erro na validação:', error);
    return { valid: false, error: 'Erro ao validar imagem' };
  }
}

// Executar testes comparativos
console.log('🧪 Executando testes comparativos...\n');

realWorldScenarios.forEach((scenario, index) => {
  console.log(`\n--- TESTE ${index + 1}: ${scenario.scenario} ---`);
  
  console.log('\n🔴 VALIDAÇÃO ATUAL:');
  const currentResult = validateImageCurrent(scenario);
  console.log(`Resultado: ${currentResult.valid ? '✅ PASSOU' : '❌ FALHOU'}`);
  if (!currentResult.valid) {
    console.log(`Erro: ${currentResult.error}`);
  }
  
  console.log('\n🟢 VALIDAÇÃO MELHORADA:');
  const improvedResult = validateImageImproved(scenario);
  console.log(`Resultado: ${improvedResult.valid ? '✅ PASSOU' : '❌ FALHOU'}`);
  if (!improvedResult.valid) {
    console.log(`Erro: ${improvedResult.error}`);
  }
  
  console.log('\n📊 COMPARAÇÃO:');
  if (!currentResult.valid && improvedResult.valid) {
    console.log('🎯 PROBLEMA IDENTIFICADO: A validação atual falha, mas a melhorada resolve!');
  } else if (currentResult.valid && improvedResult.valid) {
    console.log('✅ Ambas passam - não é este o cenário problemático');
  } else {
    console.log('⚠️ Ambas falharam - cenário muito específico');
  }
  
  console.log('---');
});

console.log('\n🎯 CONCLUSÃO:');
console.log('Se algum teste mostrou "PROBLEMA IDENTIFICADO", esse é o cenário que está causando o erro.');
console.log('A validação melhorada deve resolver todos os casos problemáticos.');
console.log('\n📱 PRÓXIMO PASSO: Aplicar a validação melhorada no hook useImageUpload.ts'); 