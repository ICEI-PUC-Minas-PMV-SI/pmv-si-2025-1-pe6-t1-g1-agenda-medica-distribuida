// Script para testar a verificação de admin
const AsyncStorage = require('@react-native-async-storage/async-storage');

// Simular diferentes cenários de usuário
const testCases = [
  {
    name: 'Usuário normal',
    user: {
      id: '1',
      name: 'João Silva',
      email: 'joao@test.com',
      isAdmin: false
    }
  },
  {
    name: 'Usuário admin explícito',
    user: {
      id: '2',
      name: 'Admin User',
      email: 'admin@test.com',
      isAdmin: true
    }
  },
  {
    name: 'Usuário sem isAdmin definido',
    user: {
      id: '3',
      name: 'User Sem Admin',
      email: 'user@test.com'
    }
  },
  {
    name: 'Usuário com isAdmin string "true"',
    user: {
      id: '4',
      name: 'User String True',
      email: 'string@test.com',
      isAdmin: "true"
    }
  },
  {
    name: 'Usuário com isAdmin string "false"',
    user: {
      id: '5',
      name: 'User String False',
      email: 'stringfalse@test.com',
      isAdmin: "false"
    }
  },
  {
    name: 'Usuário com isAdmin null',
    user: {
      id: '6',
      name: 'User Null',
      email: 'null@test.com',
      isAdmin: null
    }
  },
  {
    name: 'Usuário com isAdmin undefined',
    user: {
      id: '7',
      name: 'User Undefined',
      email: 'undefined@test.com',
      isAdmin: undefined
    }
  }
];

function testAdminVerification(user) {
  console.log(`\n🧪 Testando: ${user.name || 'Usuário sem nome'}`);
  console.log('📋 Dados originais:', user);
  console.log('🔍 isAdmin original:', user.isAdmin, 'Tipo:', typeof user.isAdmin);
  
  // Aplicar a lógica rigorosa
  const isUserAdmin = user && user.isAdmin === true;
  const sanitizedUser = {
    ...user,
    isAdmin: user.isAdmin === true
  };
  
  console.log('🔒 Verificação rigorosa (user && user.isAdmin === true):', isUserAdmin);
  console.log('🧹 Usuário sanitizado:', sanitizedUser);
  console.log('✅ isAdmin final:', sanitizedUser.isAdmin, 'Tipo:', typeof sanitizedUser.isAdmin);
  console.log('🎯 Mostrará tab admin?', isUserAdmin ? 'SIM' : 'NÃO');
  
  return { isUserAdmin, sanitizedUser };
}

function runTests() {
  console.log('🚀 Iniciando testes de verificação de admin...\n');
  
  testCases.forEach((testCase, index) => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Teste ${index + 1}: ${testCase.name}`);
    console.log(`${'='.repeat(50)}`);
    
    const result = testAdminVerification(testCase.user);
    
    // Verificar se o resultado está correto
    const shouldBeAdmin = testCase.user.isAdmin === true;
    const isCorrect = result.isUserAdmin === shouldBeAdmin;
    
    console.log(`\n📊 Resultado esperado: ${shouldBeAdmin ? 'ADMIN' : 'NÃO ADMIN'}`);
    console.log(`📊 Resultado obtido: ${result.isUserAdmin ? 'ADMIN' : 'NÃO ADMIN'}`);
    console.log(`${isCorrect ? '✅' : '❌'} Teste ${isCorrect ? 'PASSOU' : 'FALHOU'}`);
  });
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('🏁 Testes concluídos!');
  console.log(`${'='.repeat(50)}`);
}

// Executar os testes
runTests();

// Testar também a lógica de transformação do backend
console.log('\n\n🔄 Testando transformação de dados do backend...\n');

const backendUserExamples = [
  {
    _id: 'backend1',
    name: 'User Backend Normal',
    email: 'backend@test.com',
    isAdmin: false
  },
  {
    _id: 'backend2',
    name: 'Admin Backend',
    email: 'adminbackend@test.com',
    isAdmin: true
  },
  {
    _id: 'backend3',
    name: 'User Backend Sem Admin',
    email: 'nonadmin@test.com'
  }
];

function transformUser(backendUser) {
  return {
    id: backendUser._id,
    name: backendUser.name,
    email: backendUser.email,
    isAdmin: backendUser.isAdmin === true,
    verified: backendUser.verified === true
  };
}

backendUserExamples.forEach((backendUser, index) => {
  console.log(`\n🔄 Transformação ${index + 1}:`);
  console.log('📥 Backend user:', backendUser);
  const transformed = transformUser(backendUser);
  console.log('📤 Transformed user:', transformed);
  console.log('🔒 isAdmin final:', transformed.isAdmin, 'Tipo:', typeof transformed.isAdmin);
});

module.exports = { testAdminVerification, transformUser }; 