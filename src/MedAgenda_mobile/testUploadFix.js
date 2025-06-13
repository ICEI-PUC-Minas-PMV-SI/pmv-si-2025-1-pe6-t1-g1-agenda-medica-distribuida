// Script de teste para verificar as correções do upload
console.log('🧪 Testando Correções do Upload de Imagem...\n');

// Simular diferentes tipos de URI para testar a validação
const testURIs = [
  'file:///path/to/image.jpg',
  'file:///path/to/image.jpeg',
  'file:///path/to/image.png',
  'file:///path/to/image.webp',
  'file:///path/to/image.gif', // Não suportado
  'content://media/external/images/media/12345', // URI do Android
  'ph://CC95F08C-88C3-4012-9D6D-64CFE5B90D11/L0/001', // URI do iOS
  'file:///var/mobile/Containers/Data/Application/ImagePicker/image.jpg', // Expo ImagePicker
];

// Função para simular a detecção de tipo MIME
function getImageTypeFromUri(uri) {
  console.log('🔍 Analisando URI:', uri);
  
  const extension = uri.split('.').pop()?.toLowerCase();
  console.log('📄 Extensão detectada:', extension);
  
  const cleanExtension = extension?.split('?')[0]?.split('#')[0];
  console.log('🧹 Extensão limpa:', cleanExtension);
  
  switch (cleanExtension) {
    case 'jpg':
    case 'jpeg':
      console.log('✅ Tipo detectado: JPEG');
      return 'image/jpeg';
    case 'png':
      console.log('✅ Tipo detectado: PNG');
      return 'image/png';
    case 'webp':
      console.log('✅ Tipo detectado: WebP');
      return 'image/webp';
    default:
      console.warn('⚠️ Extensão não reconhecida, usando JPEG como fallback');
      return 'image/jpeg';
  }
}

// Função para simular a validação
function validateImageUri(uri) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const mimeType = getImageTypeFromUri(uri);
  
  console.log('🎯 Tipo MIME detectado:', mimeType);
  console.log('📋 Tipos permitidos:', allowedTypes);
  
  // Validação primária por extensão
  let isValidType = allowedTypes.includes(mimeType);
  
  // Validação mais permissiva para URIs do expo/react-native
  if (!isValidType && (uri.includes('ImagePicker') || uri.includes('expo') || uri.includes('content://') || uri.includes('ph://'))) {
    console.log('🔄 URI especial detectada, assumindo tipo válido');
    isValidType = true;
  }
  
  if (!isValidType) {
    console.error('❌ Tipo não permitido:', mimeType);
    return false;
  }
  
  console.log('✅ URI validada com sucesso');
  return true;
}

// Testar todas as URIs
console.log('📋 Testando diferentes tipos de URI:\n');

testURIs.forEach((uri, index) => {
  console.log(`\n--- Teste ${index + 1} ---`);
  const isValid = validateImageUri(uri);
  console.log(`Resultado: ${isValid ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`);
  console.log('---');
});

console.log('\n🎯 Resumo das Correções Implementadas:');
console.log('✅ Detecção melhorada de tipo MIME');
console.log('✅ Validação mais robusta para URIs especiais');
console.log('✅ Logs detalhados para debug');
console.log('✅ Fallback para URIs do ImagePicker/Expo');
console.log('✅ Limpeza de parâmetros de query na extensão');

console.log('\n📱 Para testar no app:');
console.log('1. Selecione uma imagem da galeria');
console.log('2. Verifique os logs no console');
console.log('3. Confirme se o upload funciona sem erro');

console.log('\n📖 Consulte SOLUCAO_ERRO_UPLOAD.md para mais detalhes'); 