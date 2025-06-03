// Script de teste para verificar o nome do usuário
const testUserName = async () => {
  console.log('🧪 Testando nome do usuário...\n');

  console.log('🔍 Logs para verificar:');
  console.log('1. Durante o login:');
  console.log('   - "Decoded token:" - Dados do token JWT');
  console.log('   - "User data from response:" - Dados do usuário na resposta');
  console.log('   - "User data from additional fetch:" - Dados buscados adicionalmente');
  console.log('   - "Name sources:" - Todas as fontes possíveis do nome');
  console.log('   - "Final user object:" - Objeto final do usuário\n');

  console.log('2. Na tela inicial:');
  console.log('   - "Home Screen - User object:" - Objeto do usuário no contexto');
  console.log('   - "Home Screen - User name:" - Nome específico do usuário\n');

  console.log('🎯 O que verificar:');
  console.log('- Se o token contém o nome do usuário');
  console.log('- Se a resposta da API contém dados do usuário');
  console.log('- Se o nome está sendo extraído corretamente');
  console.log('- Se o contexto está recebendo o nome correto\n');

  console.log('🔧 Possíveis problemas:');
  console.log('- Token não contém nome do usuário');
  console.log('- API não retorna dados do usuário no login');
  console.log('- Nome está em campo diferente (ex: fullName, firstName)');
  console.log('- Problema na decodificação do token\n');

  console.log('🚀 Teste de nome do usuário configurado!');
  console.log('Faça login e verifique os logs no console.');
};

// Executar teste
testUserName().catch(console.error); 