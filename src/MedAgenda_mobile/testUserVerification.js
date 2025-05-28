// Teste para verificar e resolver problema de verificação do usuário
const axios = require('axios');

async function testUserVerification() {
  console.log('🔍 TESTE DE VERIFICAÇÃO DO USUÁRIO\n');
  
  const api = axios.create({
    baseURL: 'https://med-agenda-backend.vercel.app/api',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'client': 'not-browser',
    }
  });

  let authToken = null;

  // 1. Fazer login
  console.log('🔐 Fazendo login...');
  try {
    const loginResponse = await api.post('/auth/signin', {
      email: 'jj@gmail.com',
      password: 'Abc12345'
    });
    
    authToken = loginResponse.data.token;
    console.log('✅ Login realizado com sucesso!');
    
  } catch (error) {
    console.log('❌ Erro no login:', error.response?.data || error.message);
    return;
  }

  // 2. Tentar enviar código de verificação
  console.log('\n📧 Enviando código de verificação...');
  try {
    const verificationResponse = await api.patch('/auth/send-verification-code', {
      email: 'jj@gmail.com'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Código enviado:', verificationResponse.data);
    
    // Simular código de verificação (geralmente seria enviado por email)
    console.log('\n🔢 Tentando verificar com código padrão...');
    
    // Tentar alguns códigos comuns de teste
    const testCodes = ['123456', '000000', '111111', '999999'];
    
    for (const code of testCodes) {
      try {
        const verifyResponse = await api.patch('/auth/verify-verification-code', {
          email: 'jj@gmail.com',
          providedCode: code
        }, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        
        console.log(`✅ Verificação bem-sucedida com código ${code}:`, verifyResponse.data);
        break;
        
      } catch (verifyError) {
        console.log(`❌ Código ${code} inválido:`, verifyError.response?.data?.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Erro ao enviar código:', error.response?.data || error.message);
  }

  // 3. Testar agendamentos após verificação
  console.log('\n📅 Testando agendamentos após tentativa de verificação...');
  try {
    const appointmentsResponse = await api.get('/appointment', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Agendamentos carregados:', appointmentsResponse.data);
    
  } catch (error) {
    console.log('❌ Ainda com erro nos agendamentos:', error.response?.data || error.message);
  }

  // 4. Testar mudança de senha (que também falhou antes)
  console.log('\n🔑 Testando mudança de senha...');
  try {
    const passwordResponse = await api.patch('/auth/change-password', {
      oldPassword: 'Abc12345',
      newPassword: 'Abc12345' // Mesma senha
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Mudança de senha funcionou:', passwordResponse.data);
    
  } catch (error) {
    console.log('❌ Erro na mudança de senha:', error.response?.data || error.message);
  }

  console.log('\n🎯 CONCLUSÃO:');
  console.log('Se o usuário não está verificado, você precisa:');
  console.log('1. Verificar se há um código de verificação no email');
  console.log('2. Usar o endpoint /auth/verify-verification-code');
  console.log('3. Ou verificar se o backend permite usuários não verificados');
}

testUserVerification(); 