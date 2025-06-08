// Teste de cenários extremos que podem estar causando o erro
console.log('🔍 Teste de Cenários Extremos - Identificando o Problema Real\n');

const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  imageQuality: 0.8,
  maxDimensions: {
    width: 800,
    height: 800,
  },
};

// Cenários EXTREMOS que podem estar causando o problema
const extremeScenarios = [
  // Cenário 1: Asset com propriedades vazias/undefined
  {
    uri: '',
    type: undefined,
    fileSize: undefined,
    width: undefined,
    height: undefined,
    scenario: 'Asset vazio/corrompido'
  },
  
  // Cenário 2: URI com caracteres especiais
  {
    uri: 'content://com.android.providers.media.documents/document/image%3A12345%2Ftest%20image.jpg',
    type: undefined,
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'URI com caracteres especiais'
  },
  
  // Cenário 3: Asset com type que não é string
  {
    uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20241205_143022.jpg',
    type: null,
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'Type null (não undefined)'
  },
  
  // Cenário 4: URI muito longa sem extensão
  {
    uri: 'content://com.google.android.apps.photos.contentprovider/0/1/content%3A//media/external/images/media/12345/ORIGINAL/NONE/image_picker_1234567890',
    type: undefined,
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'URI muito longa sem extensão'
  },
  
  // Cenário 5: Type com valor inesperado
  {
    uri: 'file:///storage/emulated/0/DCIM/Camera/IMG_20241205_143022.jpg',
    type: '',
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'Type string vazia'
  },
  
  // Cenário 6: URI com múltiplos pontos
  {
    uri: 'file:///storage/emulated/0/DCIM/Camera/IMG.20241205.143022.backup.jpg',
    type: undefined,
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'URI com múltiplos pontos'
  },
  
  // Cenário 7: Type com valor inválido mas que começa com 'image/'
  {
    uri: 'content://media/external/images/media/12345',
    type: 'image/',
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'Type "image/" incompleto'
  },
  
  // Cenário 8: URI que pode confundir a detecção
  {
    uri: 'content://com.android.providers.media.documents/document/image%3A12345.png.jpg',
    type: undefined,
    fileSize: 2048000,
    width: 1920,
    height: 1080,
    scenario: 'URI com múltiplas extensões'
  }
];

// Função que simula exatamente o código atual do hook
function validateImageExact(imageAsset) {
  console.log('🔍 [EXATO] Validando:', {
    uri: imageAsset.uri,
    type: imageAsset.type,
    scenario: imageAsset.scenario
  });

  try {
    // Verificar tamanho do arquivo
    if (imageAsset.fileSize && imageAsset.fileSize > UPLOAD_CONFIG.maxFileSize) {
      const maxSizeMB = Math.round(UPLOAD_CONFIG.maxFileSize / (1024 * 1024));
      const fileSizeMB = Math.round(imageAsset.fileSize / (1024 * 1024));
      const error = `Arquivo muito grande (${fileSizeMB}MB). Tamanho máximo: ${maxSizeMB}MB`;
      console.log('❌ [EXATO] Erro de tamanho:', error);
      return { valid: false, error };
    }

    // NOVA LÓGICA: Priorizar asset.type quando disponível e válido
    let detectedMimeType;
    let validationSource;

    if (imageAsset.type && imageAsset.type.startsWith('image/')) {
      // Usar asset.type se disponível e válido
      detectedMimeType = imageAsset.type;
      validationSource = 'asset.type';
      console.log('🎯 [EXATO] Usando asset.type:', detectedMimeType);
    } else {
      // Fallback para detecção por URI
      console.log('🔍 [EXATO] Analisando URI:', imageAsset.uri);
      
      const extension = imageAsset.uri.split('.').pop()?.toLowerCase();
      console.log('📄 [EXATO] Extensão detectada:', extension);
      
      const cleanExtension = extension?.split('?')[0]?.split('#')[0];
      console.log('🧹 [EXATO] Extensão limpa:', cleanExtension);
      
      switch (cleanExtension) {
        case 'jpg':
        case 'jpeg':
          console.log('✅ [EXATO] Tipo detectado: JPEG');
          detectedMimeType = 'image/jpeg';
          break;
        case 'png':
          console.log('✅ [EXATO] Tipo detectado: PNG');
          detectedMimeType = 'image/png';
          break;
        case 'webp':
          console.log('✅ [EXATO] Tipo detectado: WebP');
          detectedMimeType = 'image/webp';
          break;
        default:
          console.log('⚠️ [EXATO] Extensão não reconhecida, usando JPEG como fallback');
          detectedMimeType = 'image/jpeg';
      }
      validationSource = 'URI extension';
      console.log('🎯 [EXATO] Usando detecção por URI:', detectedMimeType);
    }

    console.log('📋 [EXATO] Tipos permitidos:', UPLOAD_CONFIG.allowedTypes);
    console.log('🔍 [EXATO] Fonte da validação:', validationSource);
    
    // Verificar se o tipo detectado é permitido
    let isValidType = UPLOAD_CONFIG.allowedTypes.includes(detectedMimeType);
    console.log('📊 [EXATO] Validação inicial:', isValidType);
    
    // Se não passou na validação inicial, tentar estratégias alternativas
    if (!isValidType) {
      console.log('🔄 [EXATO] Tentando estratégias alternativas...');
      
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
        console.log('✅ [EXATO] URI especial detectada, assumindo tipo válido');
        isValidType = true;
      }
      
      // Estratégia 2: Se asset.type não foi usado, tentar usá-lo agora
      if (!isValidType && imageAsset.type && validationSource !== 'asset.type') {
        console.log('🔄 [EXATO] Tentando com asset.type como fallback:', imageAsset.type);
        isValidType = UPLOAD_CONFIG.allowedTypes.includes(imageAsset.type);
        if (isValidType) {
          detectedMimeType = imageAsset.type;
          console.log('✅ [EXATO] Validação bem-sucedida com asset.type');
        }
      }
      
      // Estratégia 3: Para URIs sem extensão clara, assumir JPEG se vier de fonte confiável
      if (!isValidType && !imageAsset.uri.includes('.')) {
        console.log('🔄 [EXATO] URI sem extensão detectada, assumindo JPEG');
        detectedMimeType = 'image/jpeg';
        isValidType = true;
      }
    }
    
    if (!isValidType) {
      const error = 'Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.';
      console.log('❌ [EXATO] Tipo não permitido após todas as tentativas:', { 
        detectedMimeType, 
        assetType: imageAsset.type,
        uri: imageAsset.uri 
      });
      return { valid: false, error };
    }

    console.log('✅ [EXATO] Imagem validada com sucesso');
    console.log('📊 [EXATO] Tipo final aceito:', detectedMimeType);
    return { valid: true, error: null };
  } catch (error) {
    console.log('❌ [EXATO] Erro na validação da imagem:', error);
    return { valid: false, error: 'Erro ao validar a imagem selecionada.' };
  }
}

// Executar testes com cenários extremos
console.log('🧪 Testando cenários extremos...\n');

let problemsFound = 0;

extremeScenarios.forEach((scenario, index) => {
  console.log(`\n--- TESTE ${index + 1}: ${scenario.scenario} ---`);
  
  const result = validateImageExact(scenario);
  console.log(`Resultado: ${result.valid ? '✅ PASSOU' : '❌ FALHOU'}`);
  
  if (!result.valid) {
    console.log(`❌ ERRO: ${result.error}`);
    console.log('🎯 PROBLEMA IDENTIFICADO NESTE CENÁRIO!');
    problemsFound++;
  }
  
  console.log('---');
});

console.log(`\n📊 RESUMO DOS TESTES:`);
console.log(`Total de cenários testados: ${extremeScenarios.length}`);
console.log(`Problemas encontrados: ${problemsFound}`);

if (problemsFound > 0) {
  console.log('\n🎯 PROBLEMAS IDENTIFICADOS!');
  console.log('Os cenários que falharam são provavelmente a causa do erro no app.');
  console.log('Verifique os logs acima para ver exatamente onde a validação está falhando.');
} else {
  console.log('\n✅ TODOS OS CENÁRIOS PASSARAM');
  console.log('O problema pode estar em outro lugar:');
  console.log('1. Erro na chamada da função de validação');
  console.log('2. Problema no upload para o Cloudinary');
  console.log('3. Erro de rede ou configuração');
  console.log('4. Problema específico do dispositivo/plataforma');
}

console.log('\n🔍 PRÓXIMOS PASSOS:');
console.log('1. Se problemas foram encontrados: Corrigir a validação para esses cenários');
console.log('2. Se nenhum problema: Adicionar logs mais detalhados no app real');
console.log('3. Verificar se o erro está acontecendo na validação ou no upload');
console.log('4. Testar com uma imagem real no dispositivo'); 