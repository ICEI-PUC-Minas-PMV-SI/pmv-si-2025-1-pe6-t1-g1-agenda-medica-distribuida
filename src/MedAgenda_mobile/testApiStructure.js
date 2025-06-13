// Teste para descobrir a estrutura da API
const axios = require('axios');

const BASE_URL = 'https://med-agenda-backend.vercel.app';

async function testEndpoints() {
  console.log('🔍 Descobrindo estrutura da API...\n');
  
  const endpointsToTest = [
    '/',
    '/api',
    '/api-docs',
    '/health',
    '/api/health',
    '/auth/register',
    '/api/auth/register',
    '/docs',
    '/swagger'
  ];

  for (const endpoint of endpointsToTest) {
    try {
      console.log(`🧪 Testando: ${BASE_URL}${endpoint}`);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500; // Aceita qualquer status < 500
        }
      });
      
      console.log(`✅ Status ${response.status}: ${endpoint}`);
      
      // Se for HTML, mostra apenas o título
      if (response.headers['content-type']?.includes('text/html')) {
        const titleMatch = response.data.match(/<title>(.*?)<\/title>/i);
        if (titleMatch) {
          console.log(`   📄 Título: ${titleMatch[1]}`);
        }
      } else if (response.headers['content-type']?.includes('application/json')) {
        console.log(`   📋 JSON Response:`, response.data);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ Status ${error.response.status}: ${endpoint}`);
      } else {
        console.log(`🌐 Erro de rede: ${endpoint}`);
      }
    }
    console.log(''); // Linha em branco
  }
}

testEndpoints(); 