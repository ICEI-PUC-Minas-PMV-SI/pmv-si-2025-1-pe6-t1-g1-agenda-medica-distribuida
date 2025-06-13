// Teste simples para verificar se o registro está funcionando
// Execute este arquivo com: node testRegister.js

const axios = require('axios');

const API_URL = 'https://med-agenda-backend.vercel.app/api';

async function testRegister() {
  console.log('🧪 Testando cadastro de usuário...');
  console.log('📡 URL da API:', API_URL);
  
  const testUser = {
    name: 'Usuário Teste',
    email: `teste${Date.now()}@example.com`, // Email único
    password: 'MinhaSenh@123', // Senha que atende aos requisitos: 8+ chars, maiúscula, minúscula, número
    phone: '+5511999999999'
  };

  try {
    console.log('📤 Enviando dados:', { ...testUser, password: '[HIDDEN]' });
    
    const response = await axios.post(`${API_URL}/auth/signup`, testUser, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    console.log('✅ Cadastro realizado com sucesso!');
    console.log('📋 Resposta:', {
      status: response.status,
      data: response.data
    });

  } catch (error) {
    console.log('❌ Erro no cadastro:');
    
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📄 Dados:', error.response.data);
      console.log('🔗 Headers:', error.response.headers);
    } else if (error.request) {
      console.log('🌐 Erro de rede - sem resposta do servidor');
      console.log('📡 Request:', error.request);
    } else {
      console.log('⚠️ Erro:', error.message);
    }
  }
}

async function testConnection() {
  console.log('🔗 Testando conexão com o backend...');
  
  try {
    const response = await axios.get(`${API_URL}/doctors`, {
      timeout: 10000,
      validateStatus: function (status) {
        return status < 500; // Aceita qualquer status < 500
      }
    });
    
    console.log('✅ Conexão OK!');
    console.log('📊 Status:', response.status);
    
    if (response.status === 401) {
      console.log('🔒 API funcionando - requer autenticação');
    }
    
  } catch (error) {
    console.log('❌ Erro de conexão:');
    
    if (error.response) {
      console.log('📊 Status:', error.response.status);
      console.log('📄 Dados:', error.response.data);
    } else if (error.request) {
      console.log('🌐 Sem resposta do servidor');
    } else {
      console.log('⚠️ Erro:', error.message);
    }
  }
}

async function runTests() {
  console.log('🚀 Iniciando testes da API MedAgenda...\n');
  
  await testConnection();
  console.log('\n' + '='.repeat(50) + '\n');
  await testRegister();
  
  console.log('\n✨ Testes concluídos!');
}

runTests(); 