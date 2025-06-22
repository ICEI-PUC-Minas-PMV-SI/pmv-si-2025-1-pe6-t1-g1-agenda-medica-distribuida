const axios = require('axios');

const backendUrl = 'https://med-agenda-backend.vercel.app';

// Função para testar o fluxo completo de agendamento
async function testAppointmentFlow() {
    console.log('🧪 Testando fluxo completo de agendamento...\n');

    try {
        // 1. Fazer login para obter token
        console.log('1️⃣ Fazendo login...');
        const loginResponse = await axios.post(backendUrl + '/api/auth/login', {
            email: 'teste@teste.com',
            password: '123456'
        });

        if (!loginResponse.data.success) {
            throw new Error('Falha no login: ' + loginResponse.data.message);
        }

        const token = loginResponse.data.token;
        const userId = loginResponse.data.userId;
        console.log('✅ Login realizado com sucesso');
        console.log('👤 User ID:', userId);
        console.log('🔑 Token obtido\n');

        // 2. Buscar médicos disponíveis
        console.log('2️⃣ Buscando médicos disponíveis...');
        const doctorsResponse = await axios.get(backendUrl + '/api/doctors', {
            headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
        });

        if (!doctorsResponse.data.success) {
            throw new Error('Falha ao buscar médicos: ' + doctorsResponse.data.message);
        }

        const doctors = doctorsResponse.data.doctors;
        console.log(`✅ ${doctors.length} médicos encontrados`);
        
        if (doctors.length === 0) {
            throw new Error('Nenhum médico disponível para teste');
        }

        const testDoctor = doctors[0];
        console.log('👨‍⚕️ Médico selecionado para teste:', testDoctor.name);
        console.log('🆔 Doctor ID:', testDoctor._id, '\n');

        // 3. Buscar agendamentos existentes
        console.log('3️⃣ Buscando agendamentos existentes...');
        const appointmentsResponse = await axios.get(backendUrl + '/api/appointment', {
            headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
        });

        if (appointmentsResponse.data.success) {
            console.log(`✅ ${appointmentsResponse.data.appointments.length} agendamentos encontrados`);
        } else {
            console.log('⚠️ Erro ao buscar agendamentos:', appointmentsResponse.data.message);
        }
        console.log('');

        // 4. Criar novo agendamento
        console.log('4️⃣ Criando novo agendamento...');
        const appointmentData = {
            userId: userId,
            docId: testDoctor._id,
            slotDate: '15/01/2025',
            slotTime: '14:30'
        };

        console.log('📅 Dados do agendamento:', appointmentData);

        const createResponse = await axios.post(backendUrl + '/api/appointment', appointmentData, {
            headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
        });

        if (!createResponse.data.success) {
            throw new Error('Falha ao criar agendamento: ' + createResponse.data.message);
        }

        const newAppointment = createResponse.data.appointment;
        console.log('✅ Agendamento criado com sucesso!');
        console.log('🆔 Appointment ID:', newAppointment._id);
        console.log('📅 Data:', newAppointment.slotDate);
        console.log('⏰ Horário:', newAppointment.slotTime);
        console.log('👨‍⚕️ Médico:', newAppointment.docId);
        console.log('👤 Usuário:', newAppointment.userId, '\n');

        // 5. Verificar se o agendamento aparece na lista
        console.log('5️⃣ Verificando se o agendamento aparece na lista...');
        const updatedAppointmentsResponse = await axios.get(backendUrl + '/api/appointment', {
            headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
        });

        if (updatedAppointmentsResponse.data.success) {
            const updatedAppointments = updatedAppointmentsResponse.data.appointments;
            const createdAppointment = updatedAppointments.find(apt => apt._id === newAppointment._id);
            
            if (createdAppointment) {
                console.log('✅ Agendamento encontrado na lista!');
                console.log('📊 Total de agendamentos:', updatedAppointments.length);
            } else {
                console.log('❌ Agendamento não encontrado na lista');
            }
        }
        console.log('');

        // 6. Cancelar o agendamento
        console.log('6️⃣ Cancelando o agendamento...');
        const cancelData = {
            userId: userId,
            appointmentId: newAppointment._id
        };

        const cancelResponse = await axios.post(backendUrl + '/api/appointment/cancel', cancelData, {
            headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
        });

        if (!cancelResponse.data.success) {
            throw new Error('Falha ao cancelar agendamento: ' + cancelResponse.data.message);
        }

        console.log('✅ Agendamento cancelado com sucesso!');
        console.log('📝 Mensagem:', cancelResponse.data.message, '\n');

        // 7. Verificar se o agendamento foi removido/cancelado
        console.log('7️⃣ Verificando status do agendamento cancelado...');
        const finalAppointmentsResponse = await axios.get(backendUrl + '/api/appointment', {
            headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
        });

        if (finalAppointmentsResponse.data.success) {
            const finalAppointments = finalAppointmentsResponse.data.appointments;
            const cancelledAppointment = finalAppointments.find(apt => apt._id === newAppointment._id);
            
            if (cancelledAppointment) {
                console.log('✅ Agendamento ainda na lista (possivelmente marcado como cancelado)');
                console.log('📊 Status:', cancelledAppointment.status || 'N/A');
            } else {
                console.log('✅ Agendamento removido da lista');
            }
        }

        console.log('\n🎉 Teste do fluxo de agendamento concluído com sucesso!');

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        if (error.response) {
            console.error('📡 Resposta da API:', error.response.data);
        }
    }
}

// Executar o teste
testAppointmentFlow(); 