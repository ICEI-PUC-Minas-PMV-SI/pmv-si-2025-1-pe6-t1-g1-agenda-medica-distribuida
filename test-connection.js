const axios = require('axios');

async function testBackendConnection() {
  console.log('🔍 Testando conexão com o backend...\n');
  
  const backendUrl = 'https://med-agenda-backend.vercel.app';
  
  try {
    // Teste 1: Verificar se o servidor está respondendo
    console.log('1. Testando se o servidor está online...');
    const healthResponse = await axios.get(`${backendUrl}/api-docs`, {
      timeout: 10000
    });
    console.log('✅ Servidor está online');
    
    // Teste 2: Verificar se as rotas de auth estão funcionando
    console.log('\n2. Testando rota de signup...');
    const signupData = {
      name: 'Teste Conexão',
      email: 'teste.conexao@test.com',
      password: 'Teste123',
      gender: 'Male',
      birthdate: '1990-01-01'
    };
    
    const signupResponse = await axios.post(`${backendUrl}/api/auth/signup`, signupData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Signup funcionando:', signupResponse.data.message);
    
    // Teste 3: Verificar se o signin está funcionando
    console.log('\n3. Testando rota de signin...');
    const signinData = {
      email: 'teste.conexao@test.com',
      password: 'Teste123'
    };
    
    const signinResponse = await axios.post(`${backendUrl}/api/auth/signin`, signinData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Signin funcionando:', signinResponse.data.message);
    console.log('✅ Token recebido:', !!signinResponse.data.token);
    
    console.log('\n🎉 Todos os testes passaram! O backend está funcionando corretamente.');
    
  } catch (error) {
    console.log('❌ Erro na conexão:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 O servidor pode estar offline ou a URL está incorreta');
    } else if (error.code === 'ENOTFOUND') {
      console.log('💡 Não foi possível resolver o domínio. Verifique a URL');
    } else if (error.response) {
      console.log('💡 Servidor respondeu com erro:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('💡 Nenhuma resposta recebida do servidor');
    }
  }
}

testBackendConnection(); 