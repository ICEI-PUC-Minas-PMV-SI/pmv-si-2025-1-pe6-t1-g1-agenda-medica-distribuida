// Teste para verificar autenticação
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from './services/api';

async function testAuthentication() {
  console.log('🔐 === TESTE DE AUTENTICAÇÃO ===');
  
  try {
    // Verificar se há token salvo
    const token = await AsyncStorage.getItem('authToken');
    console.log('🔑 Token atual:', token ? 'Existe' : 'Não encontrado');
    
    if (token) {
      console.log('🔍 Primeiros caracteres do token:', token.substring(0, 20) + '...');
    }
    
    // Verificar usuário atual
    const currentUser = await auth.getCurrentUser();
    console.log('👤 Usuário atual:', currentUser);
    
    if (currentUser) {
      console.log('👨‍💼 Detalhes do usuário:', {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        isAdmin: currentUser.isAdmin
      });
      
      if (currentUser.isAdmin) {
        console.log('✅ Usuário é administrador - pode cadastrar médicos');
        return true;
      } else {
        console.log('❌ Usuário NÃO é administrador - não pode cadastrar médicos');
        return false;
      }
    } else {
      console.log('❌ Nenhum usuário logado');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Erro na verificação de autenticação:', error);
    return false;
  }
}

export { testAuthentication }; 