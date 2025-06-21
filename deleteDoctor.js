const axios = require('axios');

// Configuração da API
const backendUrl = 'https://med-agenda-backend.vercel.app';
const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U3MmMyYjNmZmY0NzU4YzcxNDk2ZDAiLCJlbWFpbCI6Im1lZGFnZW5kYWFwaUBnbWFpbC5jb20iLCJ2ZXJpZmllZCI6dHJ1ZSwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzUwNTM2ODE2LCJleHAiOjE3NTA1NjU2MTZ9.5ToGUAf9-FgkHeO_nE3QgGbjcAwrds3gZ3FjUBhrBWY';

async function deleteDoctor() {
    try {
        console.log('🔍 Procurando médico "Dr João da Silva"...');
        
        // Primeiro, vamos buscar todos os médicos para encontrar o CRM correto
        const response = await axios.get(`${backendUrl}/api/doctors`, {
            headers: {
                "client": "not-browser",
                "Authorization": `Bearer ${adminToken}`
            }
        });
        
        if (response.data.success) {
            const doctors = response.data.doctors;
            const targetDoctor = doctors.find(doctor => 
                doctor.name && doctor.name.toLowerCase().includes('joão da silva')
            );
            
            if (targetDoctor) {
                console.log(`✅ Médico encontrado: ${targetDoctor.name} (CRM: ${targetDoctor.crm})`);
                
                // Agora vamos deletar o médico
                console.log('🗑️ Deletando médico...');
                const deleteResponse = await axios.delete(`${backendUrl}/api/doctors/${encodeURIComponent(targetDoctor.crm)}`, {
                    headers: {
                        "client": "not-browser",
                        "Authorization": `Bearer ${adminToken}`
                    }
                });
                
                if (deleteResponse.data.success) {
                    console.log('✅ Médico deletado com sucesso!');
                    console.log('Resposta:', deleteResponse.data);
                } else {
                    console.log('❌ Erro ao deletar:', deleteResponse.data.message);
                }
            } else {
                console.log('❌ Médico "Dr João da Silva" não encontrado na lista.');
                console.log('Médicos disponíveis:');
                doctors.forEach(doctor => {
                    console.log(`- ${doctor.name} (CRM: ${doctor.crm})`);
                });
            }
        } else {
            console.log('❌ Erro ao buscar médicos:', response.data.message);
        }
    } catch (error) {
        console.log('❌ Erro:', error.response ? error.response.data : error.message);
    }
}

// Executar o script
deleteDoctor(); 