const axios = require('axios');

const backendUrl = 'https://med-agenda-backend.vercel.app';

// Função para testar o cancelamento de agendamentos
async function testCancelAppointment() {
  console.log('🧪 === TESTE DE CANCELAMENTO DE AGENDAMENTOS ===\n');

  try {
    // 1. Primeiro, vamos listar os agendamentos para ver o status atual
    console.log('📋 1. Listando agendamentos...');
    const listResponse = await axios.get(`${backendUrl}/api/appointment`, {
      headers: {
        "client": "not-browser",
        "Authorization": "Bearer SEU_TOKEN_AQUI" // Substitua pelo token real
      },
      params: { _id: "SEU_USER_ID_AQUI" } // Substitua pelo ID do usuário real
    });

    if (listResponse.data.success) {
      console.log('✅ Agendamentos encontrados:', listResponse.data.appointments.length);
      
      // Mostrar status dos agendamentos
      listResponse.data.appointments.forEach((appointment, index) => {
        console.log(`   Agendamento ${index + 1}:`);
        console.log(`   - ID: ${appointment._id}`);
        console.log(`   - Data: ${appointment.slotDate} às ${appointment.slotTime}`);
        console.log(`   - Cancelado: ${appointment.cancelled}`);
        console.log(`   - Concluído: ${appointment.isCompleted}`);
        console.log('');
      });

      // 2. Tentar cancelar um agendamento que não está cancelado
      const pendingAppointment = listResponse.data.appointments.find(app => !app.cancelled);
      
      if (pendingAppointment) {
        console.log('❌ 2. Testando cancelamento de agendamento...');
        console.log(`   Tentando cancelar agendamento ID: ${pendingAppointment._id}`);
        
        const cancelResponse = await axios.post(`${backendUrl}/api/appointment/cancel`, {
          userId: "SEU_USER_ID_AQUI", // Substitua pelo ID do usuário real
          appointmentId: pendingAppointment._id
        }, {
          headers: {
            "client": "not-browser",
            "Authorization": "Bearer SEU_TOKEN_AQUI" // Substitua pelo token real
          }
        });

        if (cancelResponse.data.success) {
          console.log('✅ Agendamento cancelado com sucesso!');
          console.log('   Mensagem:', cancelResponse.data.message);
          
          // 3. Verificar se o status foi atualizado
          console.log('\n🔄 3. Verificando status atualizado...');
          const updatedResponse = await axios.get(`${backendUrl}/api/appointment`, {
            headers: {
              "client": "not-browser",
              "Authorization": "Bearer SEU_TOKEN_AQUI" // Substitua pelo token real
            },
            params: { _id: "SEU_USER_ID_AQUI" } // Substitua pelo ID do usuário real
          });

          if (updatedResponse.data.success) {
            const updatedAppointment = updatedResponse.data.appointments.find(
              app => app._id === pendingAppointment._id
            );
            
            if (updatedAppointment) {
              console.log('✅ Status atualizado:');
              console.log(`   - Cancelado: ${updatedAppointment.cancelled}`);
              console.log(`   - Concluído: ${updatedAppointment.isCompleted}`);
              
              if (updatedAppointment.cancelled) {
                console.log('🎉 SUCESSO: O agendamento foi marcado como cancelado!');
              } else {
                console.log('❌ ERRO: O agendamento não foi marcado como cancelado!');
              }
            }
          }
        } else {
          console.log('❌ Erro ao cancelar agendamento:', cancelResponse.data.message);
        }
      } else {
        console.log('⚠️ Nenhum agendamento pendente encontrado para cancelar');
      }
    } else {
      console.log('❌ Erro ao listar agendamentos:', listResponse.data.message);
    }

  } catch (error) {
    console.log('❌ Erro durante o teste:', error.response?.data || error.message);
  }
}

// Instruções para usar o teste
console.log('📝 INSTRUÇÕES PARA USAR ESTE TESTE:');
console.log('1. Substitua "SEU_TOKEN_AQUI" pelo token JWT real do usuário');
console.log('2. Substitua "SEU_USER_ID_AQUI" pelo ID real do usuário');
console.log('3. Execute: node testCancelAppointment.js');
console.log('');

// Executar o teste se este arquivo for executado diretamente
if (require.main === module) {
  testCancelAppointment();
}

module.exports = { testCancelAppointment }; 