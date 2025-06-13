// Script para forçar limpeza completa e restart do aplicativo
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

async function forceCleanRestart() {
  console.log('🧹 LIMPEZA COMPLETA E RESTART FORÇADO');
  console.log('=====================================\n');
  
  try {
    // 1. Limpar TUDO do AsyncStorage
    console.log('🗑️ Limpando AsyncStorage...');
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage limpo completamente\n');
    
    // 2. Verificar se está realmente limpo
    console.log('🔍 Verificando se AsyncStorage está limpo...');
    const allKeys = await AsyncStorage.getAllKeys();
    console.log('📋 Chaves restantes:', allKeys);
    
    if (allKeys.length === 0) {
      console.log('✅ AsyncStorage está completamente limpo\n');
    } else {
      console.log('⚠️ Ainda há dados no AsyncStorage:', allKeys);
      
      // Forçar remoção individual
      for (const key of allKeys) {
        await AsyncStorage.removeItem(key);
        console.log(`🗑️ Removido: ${key}`);
      }
    }
    
    console.log('🎯 INSTRUÇÕES PARA APLICAR AS CORREÇÕES:');
    console.log('=====================================');
    console.log('1. ❌ FECHE COMPLETAMENTE o aplicativo (não apenas minimizar)');
    console.log('2. 🔄 MATE o processo do Metro bundler se estiver rodando');
    console.log('3. 🧹 LIMPE o cache do React Native:');
    console.log('   - npx react-native start --reset-cache');
    console.log('   - ou expo start -c');
    console.log('4. 🚀 REABRA o aplicativo do zero');
    console.log('5. 🔑 FAÇA LOGIN novamente com filo@gmail.com');
    console.log('');
    console.log('🎯 RESULTADO ESPERADO:');
    console.log('- Barra inferior deve ter APENAS 5 botões');
    console.log('- NÃO deve aparecer "Admin Médicos"');
    console.log('- Botões: Início, Consultas, Médicos, Nova Consulta, Perfil');
    console.log('');
    console.log('✅ Limpeza concluída! Siga as instruções acima.');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  forceCleanRestart();
}

module.exports = { forceCleanRestart }; 