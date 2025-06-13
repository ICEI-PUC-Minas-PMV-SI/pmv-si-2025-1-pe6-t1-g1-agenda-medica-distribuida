// Teste para descobrir os endpoints corretos da API
const axios = require('axios');

const BASE_URL = 'https://med-agenda-backend.vercel.app';

async function testRegisterEndpoints() {
  console.log('🔍 Testando endpoints de registro...\n');
  
  const possiblePaths = [
    '/register',
    '/auth/register',
    '/api/register',
    '/api/auth/register',
    '/users/register',
    '/api/users/register',
    '/signup',
    '/api/signup',
    '/user/register',
    '/api/user/register'
  ];

  const testUser = {
    name: 'Teste User',
    email: `teste${Date.now()}@example.com`,
    password: 'senha123'
  };

  for (const path of possiblePaths) {
    try {
      console.log(`🧪 POST ${BASE_URL}${path}`);
      
      const response = await axios.post(`${BASE_URL}${path}`, testUser, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500; // Aceita qualquer status < 500
        }
      });
      
      console.log(`✅ Status ${response.status}: ${path}`);
      
      if (response.status === 200 || response.status === 201) {
        console.log('🎉 ENDPOINT ENCONTRADO!');
        console.log('📋 Resposta:', response.data);
      } else if (response.status === 400) {
        console.log('⚠️ Bad Request - endpoint existe mas dados inválidos');
        console.log('📋 Erro:', response.data);
      } else if (response.status === 422) {
        console.log('⚠️ Validation Error - endpoint existe mas validação falhou');
        console.log('📋 Erro:', response.data);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ Status ${error.response.status}: ${path}`);
        
        if (error.response.status === 400 || error.response.status === 422) {
          console.log('⚠️ Endpoint existe mas dados inválidos');
          console.log('📋 Erro:', error.response.data);
        }
      } else {
        console.log(`🌐 Erro de rede: ${path}`);
      }
    }
    console.log(''); // Linha em branco
  }
}

async function testGetEndpoints() {
  console.log('🔍 Testando endpoints GET...\n');
  
  const possiblePaths = [
    '/users',
    '/api/users',
    '/doctors',
    '/api/doctors',
    '/appointments',
    '/api/appointments',
    '/health',
    '/api/health',
    '/status',
    '/api/status'
  ];

  for (const path of possiblePaths) {
    try {
      console.log(`🧪 GET ${BASE_URL}${path}`);
      
      const response = await axios.get(`${BASE_URL}${path}`, {
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500;
        }
      });
      
      console.log(`✅ Status ${response.status}: ${path}`);
      
      if (response.status === 200) {
        console.log('🎉 ENDPOINT VÁLIDO!');
        if (typeof response.data === 'object') {
          console.log('📋 Tipo de resposta:', Array.isArray(response.data) ? 'Array' : 'Object');
        }
      } else if (response.status === 401) {
        console.log('🔒 Endpoint existe mas requer autenticação');
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ Status ${error.response.status}: ${path}`);
        
        if (error.response.status === 401) {
          console.log('🔒 Endpoint existe mas requer autenticação');
        }
      } else {
        console.log(`🌐 Erro de rede: ${path}`);
      }
    }
    console.log('');
  }
}

async function runDiscovery() {
  console.log('🚀 Descobrindo endpoints da API MedAgenda...\n');
  
  await testGetEndpoints();
  console.log('\n' + '='.repeat(60) + '\n');
  await testRegisterEndpoints();
  
  console.log('\n✨ Descoberta concluída!');
}

runDiscovery(); 