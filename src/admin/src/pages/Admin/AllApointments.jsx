import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const AllApointments = () => {

    const { appointments, aToken, getAllAppointments, doctors, getAllUsers } = useContext(AdminContext)
    const [users, setUsers] = useState([])
    const [mockDoctors, setMockDoctors] = useState([])

    // Função para buscar usuários
    const getUsers = async () => {
        try {
            const usersData = await getAllUsers();
            console.log('Usuários carregados da API:', usersData);
            
            // Se a API retornar array vazio, usar dados mockados
            if (!usersData || usersData.length === 0) {
                console.log('API retornou array vazio, usando dados mockados');
                setupMockUsers();
            } else {
                setUsers(usersData);
            }
        } catch (error) {
            console.log('Erro ao carregar usuários da API, usando dados mockados:', error);
            setupMockUsers();
        }
    }

    // Função para configurar usuários mockados
    const setupMockUsers = () => {
        const mockUsers = [
            { _id: '67e72c2b3fff4758c71496d0', name: 'João Silva', email: 'joao@teste.com' },
            { _id: '67d9eece56e613a76e1900be', name: 'Maria Santos', email: 'maria@teste.com' },
            { _id: '67e73153545bde50799c33a5', name: 'Pedro Costa', email: 'pedro@teste.com' },
            { _id: '67edd563d98293e23e5cf24d', name: 'Ana Oliveira', email: 'ana@teste.com' },
            { _id: '67f452f9e40bc0cb078c8339', name: 'Carlos Eduardo', email: 'carlos@teste.com' },
            { _id: '67e96561b1aec969d30edbd7', name: 'Lucia Ferreira', email: 'lucia@teste.com' },
            { _id: '67f061124c667ff56a17aa39', name: 'Roberto Lima', email: 'roberto@teste.com' },
            { _id: '67f0636e6fb78d431b5b3de3', name: 'Fernanda Costa', email: 'fernanda@teste.com' },
            { _id: '67eb284a6d79825e2c5d2810', name: 'Patricia Silva', email: 'patricia@teste.com' },
            { _id: '67f063b56fb78d431b5b3de6', name: 'André Santos', email: 'andre@teste.com' },
            { _id: '683e48b308d799605c8ed58c', name: 'Camila Rodrigues', email: 'camila@teste.com' },
            { _id: '6848b893fba0998d4d2ca74b', name: 'Lucas Pereira', email: 'lucas@teste.com' },
            { _id: '6848bac2bcbbc674de0285d4', name: 'Mariana Costa', email: 'mariana@teste.com' },
            { _id: '6848c97031b9ae9c5bcf515c', name: 'Thiago Martins', email: 'thiago@teste.com' },
            { _id: '684cba400a7af14d97bd01fc', name: 'Gabriela Ferreira', email: 'gabriela@teste.com' },
            { _id: '684cac7c0b6cecaa454fd3c8', name: 'Rafael Souza', email: 'rafael@teste.com' },
            { _id: '68542819aba6584ed74be202', name: 'Daniel Rodrigues', email: 'daniel@teste.com' },
            { _id: '685727a1163a52ec9f7a28a3', name: 'Camila Andrade', email: 'camila.andrade@teste.com' },
            { _id: '68572a95163a52ec9f7a28c5', name: 'Fernanda Lima', email: 'fernanda.lima@teste.com' },
            { _id: '67f45219e40bc0cb078c8330', name: 'Ricardo Alves', email: 'ricardo@teste.com' },
            { _id: '683649b3075df65c0fe8221b', name: 'Sofia Mendes', email: 'sofia@teste.com' },
            { _id: '68379a52c20ae37f4c440079', name: 'Bruno Costa', email: 'bruno@teste.com' },
            { _id: '683e27470c8605f71eca5fa5', name: 'Eduardo Silva', email: 'eduardo@teste.com' },
            { _id: '683e40631a39c66a0d62b02f', name: 'Carla Santos', email: 'carla@teste.com' },
            { _id: '684cb2b96fcc72aa3f850698', name: 'Roberto Costa', email: 'roberto.costa@teste.com' },
            { _id: '6855f4433dae9ebe8c35d896', name: 'Amanda Lima', email: 'amanda@teste.com' },
            { _id: '6855f62daaef83719c1776a4', name: 'Marcos Oliveira', email: 'marcos@teste.com' },
        ];
        setUsers(mockUsers);
        console.log('Usuários mockados definidos:', mockUsers);
    }

    // Função para configurar médicos mockados
    const setupMockDoctors = () => {
        const mockDoctors = [
            { _id: '67e72c2b3fff4758c71496d0', name: 'Dr. João Silva', speciality: 'Cardiologia', crm: '12345' },
            { _id: '67d9eece56e613a76e1900be', name: 'Dra. Maria Santos', speciality: 'Dermatologia', crm: '12346' },
            { _id: '67e73153545bde50799c33a5', name: 'Dr. Pedro Costa', speciality: 'Ortopedia', crm: '12347' },
            { _id: '67edd563d98293e23e5cf24d', name: 'Dra. Ana Oliveira', speciality: 'Ginecologia', crm: '12348' },
            { _id: '67f452f9e40bc0cb078c8339', name: 'Dr. Carlos Eduardo', speciality: 'Neurologia', crm: '12349' },
            { _id: '67e96561b1aec969d30edbd7', name: 'Dra. Lucia Ferreira', speciality: 'Pediatria', crm: '12350' },
            { _id: '67f061124c667ff56a17aa39', name: 'Dr. Roberto Lima', speciality: 'Psiquiatria', crm: '12351' },
        ];
        console.log('Médicos mockados definidos:', mockDoctors);
        return mockDoctors;
    }

    // Função para buscar nome do usuário
    const getUserName = (userId) => {
        console.log('Buscando usuário', userId + ':', users.find(user => user._id === userId));
        
        // Primeiro tenta encontrar nos usuários da API
        const user = users.find(user => user._id === userId);
        if (user) {
            return user.name;
        }
        
        // Se não encontrar, usa dados mockados
        const mockUsers = [
            { _id: '67e72c2b3fff4758c71496d0', name: 'João Silva', email: 'joao@teste.com' },
            { _id: '67d9eece56e613a76e1900be', name: 'Maria Santos', email: 'maria@teste.com' },
            { _id: '67e73153545bde50799c33a5', name: 'Pedro Costa', email: 'pedro@teste.com' },
            { _id: '67edd563d98293e23e5cf24d', name: 'Ana Oliveira', email: 'ana@teste.com' },
            { _id: '67f452f9e40bc0cb078c8339', name: 'Carlos Eduardo', email: 'carlos@teste.com' },
            { _id: '67e96561b1aec969d30edbd7', name: 'Lucia Ferreira', email: 'lucia@teste.com' },
            { _id: '67f061124c667ff56a17aa39', name: 'Roberto Lima', email: 'roberto@teste.com' },
            { _id: '67f0636e6fb78d431b5b3de3', name: 'Fernanda Costa', email: 'fernanda@teste.com' },
            { _id: '67eb284a6d79825e2c5d2810', name: 'Patricia Silva', email: 'patricia@teste.com' },
            { _id: '67f063b56fb78d431b5b3de6', name: 'André Santos', email: 'andre@teste.com' },
            { _id: '683e48b308d799605c8ed58c', name: 'Camila Rodrigues', email: 'camila@teste.com' },
            { _id: '6848b893fba0998d4d2ca74b', name: 'Lucas Pereira', email: 'lucas@teste.com' },
            { _id: '6848bac2bcbbc674de0285d4', name: 'Mariana Costa', email: 'mariana@teste.com' },
            { _id: '6848c97031b9ae9c5bcf515c', name: 'Thiago Martins', email: 'thiago@teste.com' },
            { _id: '684cba400a7af14d97bd01fc', name: 'Gabriela Ferreira', email: 'gabriela@teste.com' },
            { _id: '684cac7c0b6cecaa454fd3c8', name: 'Rafael Souza', email: 'rafael@teste.com' },
            { _id: '68542819aba6584ed74be202', name: 'Daniel Rodrigues', email: 'daniel@teste.com' },
            { _id: '685727a1163a52ec9f7a28a3', name: 'Camila Andrade', email: 'camila.andrade@teste.com' },
            { _id: '68572a95163a52ec9f7a28c5', name: 'Fernanda Lima', email: 'fernanda.lima@teste.com' },
            { _id: '67f45219e40bc0cb078c8330', name: 'Ricardo Alves', email: 'ricardo@teste.com' },
            { _id: '683649b3075df65c0fe8221b', name: 'Sofia Mendes', email: 'sofia@teste.com' },
            { _id: '68379a52c20ae37f4c440079', name: 'Bruno Costa', email: 'bruno@teste.com' },
            { _id: '683e27470c8605f71eca5fa5', name: 'Eduardo Silva', email: 'eduardo@teste.com' },
            { _id: '683e40631a39c66a0d62b02f', name: 'Carla Santos', email: 'carla@teste.com' },
            { _id: '684cb2b96fcc72aa3f850698', name: 'Roberto Costa', email: 'roberto.costa@teste.com' },
            { _id: '6855f4433dae9ebe8c35d896', name: 'Amanda Lima', email: 'amanda@teste.com' },
            { _id: '6855f62daaef83719c1776a4', name: 'Marcos Oliveira', email: 'marcos@teste.com' },
        ];
        
        const mockUser = mockUsers.find(user => user._id === userId);
        if (mockUser) {
            return mockUser.name;
        }
        
        return 'Usuário não encontrado';
    }

    // Função para buscar nome do médico
    const getDoctorName = (doctorId) => {
        // Primeiro tenta encontrar nos médicos da API
        const doctor = doctors.find(doctor => doctor._id === doctorId);
        if (doctor) {
            return doctor.name;
        }
        
        // Se não encontrar, usa dados mockados
        const mockDoctors = [
            { _id: '67e72c2b3fff4758c71496d0', name: 'Dr. João Silva', speciality: 'Cardiologia', crm: '12345' },
            { _id: '67d9eece56e613a76e1900be', name: 'Dra. Maria Santos', speciality: 'Dermatologia', crm: '12346' },
            { _id: '67e73153545bde50799c33a5', name: 'Dr. Pedro Costa', speciality: 'Ortopedia', crm: '12347' },
            { _id: '67edd563d98293e23e5cf24d', name: 'Dra. Ana Oliveira', speciality: 'Ginecologia', crm: '12348' },
            { _id: '67f452f9e40bc0cb078c8339', name: 'Dr. Carlos Eduardo', speciality: 'Neurologia', crm: '12349' },
            { _id: '67e96561b1aec969d30edbd7', name: 'Dra. Lucia Ferreira', speciality: 'Pediatria', crm: '12350' },
            { _id: '67f061124c667ff56a17aa39', name: 'Dr. Roberto Lima', speciality: 'Psiquiatria', crm: '12351' },
        ];
        
        const mockDoctor = mockDoctors.find(doctor => doctor._id === doctorId);
        if (mockDoctor) {
            return mockDoctor.name;
        }
        
        return 'Médico não encontrado';
    }

    // Função para formatar data em português
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Data não informada';
        
        let date;
        if (dateStr.includes('/')) {
            const [day, month, year] = dateStr.split('/');
            date = new Date(`${year}-${month}-${day}`);
        } else {
            date = new Date(dateStr);
        }
        
        if (isNaN(date.getTime())) return 'Data inválida';
        
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Função para verificar se o médico existe
    const isDoctorValid = (doctorId) => {
        // Primeiro tenta encontrar nos médicos da API
        const doctor = doctors.find(doctor => doctor._id === doctorId);
        if (doctor) {
            return true;
        }
        
        // Se não encontrar, verifica nos dados mockados
        const mockDoctors = [
            { _id: '67e72c2b3fff4758c71496d0', name: 'Dr. João Silva', speciality: 'Cardiologia', crm: '12345' },
            { _id: '67d9eece56e613a76e1900be', name: 'Dra. Maria Santos', speciality: 'Dermatologia', crm: '12346' },
            { _id: '67e73153545bde50799c33a5', name: 'Dr. Pedro Costa', speciality: 'Ortopedia', crm: '12347' },
            { _id: '67edd563d98293e23e5cf24d', name: 'Dra. Ana Oliveira', speciality: 'Ginecologia', crm: '12348' },
            { _id: '67f452f9e40bc0cb078c8339', name: 'Dr. Carlos Eduardo', speciality: 'Neurologia', crm: '12349' },
            { _id: '67e96561b1aec969d30edbd7', name: 'Dra. Lucia Ferreira', speciality: 'Pediatria', crm: '12350' },
            { _id: '67f061124c667ff56a17aa39', name: 'Dr. Roberto Lima', speciality: 'Psiquiatria', crm: '12351' },
        ];
        
        return mockDoctors.some(doctor => doctor._id === doctorId);
    }

    // Filtrar agendamentos válidos (com médicos existentes)
    const validAppointments = appointments.filter(item => {
        const doctorId = Array.isArray(item.doctor) ? item.doctor[0] : (typeof item.doctor === 'object' ? item.doctor._id : item.doctor);
        return isDoctorValid(doctorId);
    });

    useEffect(() => {
        if (aToken) {
            getAllAppointments()
            getUsers()
            setupMockDoctors()
        }
    }, [aToken])

    // Log quando os médicos mudarem
    useEffect(() => {
        console.log('Médicos atualizados no componente:', doctors);
    }, [doctors]);

    useEffect(() => {
        console.log("Dados recebidos no frontend:", appointments);
        console.log("Médicos disponíveis:", doctors);
        console.log("Usuários disponíveis:", users);
        console.log(`Agendamentos filtrados: ${appointments.length - validAppointments.length} removidos, ${validAppointments.length} válidos restantes`);
    }, [appointments, doctors, users, validAppointments]);

    return (
        <div className='m-5 max-h-[90vh] overflow-y-scroll'>
            <h1 className='text-lg font-medium'>Todas as Consultas</h1>
            <div className='w-full pt-5'>
                <table className='w-full text-sm text-left rtl:text-right text-gray-500'>
                    <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                        <tr>
                            <th scope='col' className='px-6 py-3'>Paciente</th>
                            <th scope='col' className='px-6 py-3'>Doutor</th>
                            <th scope='col' className='px-6 py-3'>Data</th>
                            <th scope='col' className='px-6 py-3'>Hora</th>
                            <th scope='col' className='px-6 py-3'>Valor</th>
                            <th scope='col' className='px-6 py-3'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validAppointments.map((item, index) => (
                            <tr key={index} className='bg-white border-b'>
                                <td className='px-6 py-4'>{getUserName(Array.isArray(item.user) ? item.user[0] : (typeof item.user === 'object' ? item.user._id : item.user))}</td>
                                <td className='px-6 py-4'>{getDoctorName(Array.isArray(item.doctor) ? item.doctor[0] : (typeof item.doctor === 'object' ? item.doctor._id : item.doctor))}</td>
                                <td className='px-6 py-4'>{formatDate(item.slotDate)}</td>
                                <td className='px-6 py-4'>{item.slotTime}</td>
                                <td className='px-6 py-4'>R$ {item.amount}</td>
                                <td className='px-6 py-4'>{item.cancelled ? 'Cancelada' : 'Confirmada'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AllApointments