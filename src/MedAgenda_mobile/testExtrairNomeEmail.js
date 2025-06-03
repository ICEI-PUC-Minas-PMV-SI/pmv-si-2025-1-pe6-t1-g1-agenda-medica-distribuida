// Script para testar extração de nome do email
const testExtrairNomeEmail = () => {
  console.log('🧪 Testando Extração de Nome do Email...\n');

  const emails = [
    'joao.silva@gmail.com',
    'maria_santos@hotmail.com',
    'pedro.oliveira@yahoo.com',
    'ana.costa@outlook.com',
    'carlos123@gmail.com',
    'user@domain.com'
  ];

  emails.forEach(email => {
    const emailName = email.split('@')[0];
    const extractedName = emailName
      .replace(/[._]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Nome extraído: ${extractedName}\n`);
  });

  console.log('✅ Teste de extração de nome concluído!');
  console.log('Esta estratégia será usada como fallback quando:');
  console.log('- O token não contém nome do usuário');
  console.log('- A resposta da API não tem dados do usuário');
  console.log('- Todos os outros métodos falharem\n');

  console.log('🎯 Agora o nome do usuário deve aparecer mesmo que seja extraído do email!');
};

// Executar teste
testExtrairNomeEmail(); 