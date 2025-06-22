const axios = require('axios');

const backendUrl = 'https://med-agenda-backend.vercel.app';

async function testAppointmentDebug() {
    console.log('🔍 Debug da API de Agendamentos...\n');

    try {
        // 1. Fazer login para obter token
        console.log('1️⃣ Fazendo login...');
        const loginResponse = await axios.post(backendUrl + '/api/auth/signin', {
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
        console.log('2️⃣ Buscando médicos...');
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
        console.log('👨‍⚕️ Médico para teste:', testDoctor.name);
        console.log('🆔 Doctor ID:', testDoctor._id, '\n');

        // 3. Buscar agendamentos existentes
        console.log('3️⃣ Buscando agendamentos existentes...');
        try {
            const appointmentsResponse = await axios.get(backendUrl + '/api/appointment', {
                headers: {"client": "not-browser", "Authorization": `Bearer ${token}`},
                params: { _id: userId }
            });
            
            if (appointmentsResponse.data.success) {
                console.log('✅ Agendamentos encontrados:', appointmentsResponse.data.appointments.length);
                console.log('📊 Dados dos agendamentos:');
                appointmentsResponse.data.appointments.forEach((apt, index) => {
                    console.log(`  ${index + 1}. ID: ${apt._id}`);
                    console.log(`     User: ${apt.user}`);
                    console.log(`     Doctor: ${apt.doctor}`);
                    console.log(`     Date: ${apt.slotDate}`);
                    console.log(`     Time: ${apt.slotTime}`);
                    console.log(`     Cancelled: ${apt.cancelled}`);
                    console.log('');
                });
            } else {
                console.log('❌ Erro ao buscar agendamentos:', appointmentsResponse.data.message);
            }
        } catch (error) {
            console.log('❌ Erro ao buscar agendamentos:', error.response?.data || error.message);
        }
        console.log('');

        // 4. Criar novo agendamento
        console.log('4️⃣ Criando novo agendamento...');
        const appointmentData = {
            userId: userId,
            docId: testDoctor._id,
            slotDate: '25/01/2025',
            slotTime: '16:00'
        };

        console.log('📅 Dados do agendamento:', appointmentData);

        const createResponse = await axios.post(backendUrl + '/api/appointment', appointmentData, {
            headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
        });

        if (!createResponse.data.success) {
            throw new Error('Falha ao criar agendamento: ' + createResponse.data.message);
        }

        const newAppointment = createResponse.data.newAppointment;
        console.log('✅ Agendamento criado com sucesso!');
        console.log('🆔 Appointment ID:', newAppointment._id);
        console.log('📅 Data:', newAppointment.slotDate);
        console.log('⏰ Horário:', newAppointment.slotTime);
        console.log('👨‍⚕️ Médico:', newAppointment.doctor);
        console.log('👤 Usuário:', newAppointment.user);
        console.log('💰 Valor:', newAppointment.amount);
        console.log('');

        // 5. Buscar agendamentos novamente
        console.log('5️⃣ Buscando agendamentos após criar...');
        try {
            const finalAppointmentsResponse = await axios.get(backendUrl + '/api/appointment', {
                headers: {"client": "not-browser", "Authorization": `Bearer ${token}`},
                params: { _id: userId }
            });
            
            if (finalAppointmentsResponse.data.success) {
                console.log('✅ Agendamentos após criar:', finalAppointmentsResponse.data.appointments.length);
                console.log('📊 Dados dos agendamentos:');
                finalAppointmentsResponse.data.appointments.forEach((apt, index) => {
                    console.log(`  ${index + 1}. ID: ${apt._id}`);
                    console.log(`     User: ${apt.user}`);
                    console.log(`     Doctor: ${apt.doctor}`);
                    console.log(`     Date: ${apt.slotDate}`);
                    console.log(`     Time: ${apt.slotTime}`);
                    console.log(`     Cancelled: ${apt.cancelled}`);
                    console.log('');
                });
            } else {
                console.log('❌ Erro ao buscar agendamentos:', finalAppointmentsResponse.data.message);
            }
        } catch (error) {
            console.log('❌ Erro ao buscar agendamentos:', error.response?.data || error.message);
        }

        console.log('\n🎉 Teste concluído!');

    } catch (error) {
        console.error('❌ Erro geral:', error.message);
        if (error.response) {
            console.error('📡 Resposta da API:', error.response.data);
        }
    }
}

testAppointmentDebug(); 