// Script para limpar AsyncStorage e debugar dados armazenados
const AsyncStorage = require('@react-native-async-storage/async-storage');

async function debugStorageData() {
  try {
    console.log('🔍 Verificando dados armazenados no AsyncStorage...\n');
    
    // Verificar dados do usuário
    const storedUser = await AsyncStorage.getItem('user');
    const storedToken = await AsyncStorage.getItem('authToken');
    
    console.log('📦 Dados do usuário armazenados:');
    console.log('Raw string:', storedUser);
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('📋 Usuário parseado:', parsedUser);
        console.log('🔒 isAdmin value:', parsedUser.isAdmin);
        console.log('🔒 isAdmin type:', typeof parsedUser.isAdmin);
        console.log('🔒 isAdmin === true:', parsedUser.isAdmin === true);
        console.log('🔒 isAdmin == true:', parsedUser.isAdmin == true);
        console.log('🔒 Boolean(isAdmin):', Boolean(parsedUser.isAdmin));
        
        // Verificar se há algum problema com o valor
        if (parsedUser.isAdmin !== true && parsedUser.isAdmin !== false && parsedUser.isAdmin !== undefined) {
          console.log('⚠️ PROBLEMA DETECTADO: isAdmin tem valor inesperado!');
          console.log('🔍 Valor inesperado:', parsedUser.isAdmin);
          console.log('🔍 Tipo inesperado:', typeof parsedUser.isAdmin);
        }
        
        // Aplicar a lógica de sanitização
        const sanitizedUser = {
          ...parsedUser,
          isAdmin: parsedUser.isAdmin === true
        };
        
        console.log('\n🧹 Usuário após sanitização:', sanitizedUser);
        console.log('🔒 isAdmin sanitizado:', sanitizedUser.isAdmin, 'Tipo:', typeof sanitizedUser.isAdmin);
        
      } catch (parseError) {
        console.error('❌ Erro ao parsear usuário:', parseError);
      }
    } else {
      console.log('❌ Nenhum usuário armazenado');
    }
    
    console.log('\n🔑 Token armazenado:', storedToken ? 'Existe' : 'Não existe');
    
    // Verificar todas as chaves do AsyncStorage
    console.log('\n📋 Todas as chaves no AsyncStorage:');
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('Chaves:', allKeys);
    
    // Verificar todos os valores
    if (allKeys.length > 0) {
      const allValues = await AsyncStorage.multiGet(allKeys);
      console.log('\n📦 Todos os valores:');
      allValues.forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar storage:', error);
  }
}

async function clearStorage() {
  try {
    console.log('\n🧹 Limpando AsyncStorage...');
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage limpo com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao limpar storage:', error);
  }
}

async function createTestUser(isAdmin = false) {
  try {
    console.log(`\n👤 Criando usuário de teste (isAdmin: ${isAdmin})...`);
    
    const testUser = {
      id: 'test-user-' + Date.now(),
      name: isAdmin ? 'Admin Test' : 'User Test',
      email: isAdmin ? 'admin@test.com' : 'user@test.com',
      isAdmin: isAdmin,
      verified: false
    };
    
    console.log('📋 Usuário de teste:', testUser);
    
    await AsyncStorage.setItem('user', JSON.stringify(testUser));
    await AsyncStorage.setItem('authToken', 'test-token-' + Date.now());
    
    console.log('✅ Usuário de teste criado e armazenado!');
    
    // Verificar se foi armazenado corretamente
    const storedUser = await AsyncStorage.getItem('user');
    const parsedUser = JSON.parse(storedUser);
    console.log('🔍 Verificação - usuário armazenado:', parsedUser);
    console.log('🔒 Verificação - isAdmin:', parsedUser.isAdmin, 'Tipo:', typeof parsedUser.isAdmin);
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error);
  }
}

async function runDebugSession() {
  console.log('🚀 Iniciando sessão de debug do AsyncStorage...\n');
  
  // 1. Verificar dados atuais
  await debugStorageData();
  
  console.log('\n' + '='.repeat(60));
  console.log('OPÇÕES:');
  console.log('1. Para limpar o storage, execute: clearStorage()');
  console.log('2. Para criar usuário normal, execute: createTestUser(false)');
  console.log('3. Para criar usuário admin, execute: createTestUser(true)');
  console.log('='.repeat(60));
}

// Executar debug
runDebugSession();

// Exportar funções para uso manual
module.exports = {
  debugStorageData,
  clearStorage,
  createTestUser
}; 