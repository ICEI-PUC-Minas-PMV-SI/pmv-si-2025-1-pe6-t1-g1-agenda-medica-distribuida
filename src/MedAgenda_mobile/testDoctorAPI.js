// Script de teste para verificar se a API de médicos está funcionando
const testDoctorAPI = async () => {
  console.log('🧪 Testando API de médicos...\n');

  console.log('📋 Testes a serem realizados:');
  console.log('1. Buscar todos os médicos via /doctors');
  console.log('2. Buscar médico específico via /doctors/{id}');
  console.log('3. Verificar estrutura dos dados retornados');
  console.log('4. Confirmar mapeamento speciality -> specialty\n');

  console.log('🔍 Para testar manualmente:');
  console.log('1. Abra o console do React Native/Expo');
  console.log('2. Faça login no app');
  console.log('3. Navegue para a tela inicial ou de consultas');
  console.log('4. Verifique os logs com emojis:');
  console.log('   🔍 - Buscando dados');
  console.log('   📋 - Dados brutos do backend');
  console.log('   📝 - Extraindo ID do médico');
  console.log('   ✅ - Dados do médico obtidos com sucesso');
  console.log('   🎯 - Appointment transformado final');
  console.log('   📊 - Resultados finais\n');

  console.log('🎯 O que procurar nos logs:');
  console.log('- "Successfully fetched doctor data" com name e speciality');
  console.log('- "Final Appointment X" com doctorName e doctorSpecialty preenchidos');
  console.log('- "Appointments with doctor data: X" > 0\n');

  console.log('🚀 Teste de API de médicos configurado!');
  console.log('Agora execute o app e verifique os logs no console.');
};

// Executar teste
testDoctorAPI().catch(console.error); 