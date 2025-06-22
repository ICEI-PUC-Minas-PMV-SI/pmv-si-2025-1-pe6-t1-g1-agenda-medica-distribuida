import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = 'R$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://med-agenda-backend.vercel.app'
    const [doctors, setDoctors] = useState([])
    const [userData, setUserData] = useState(null)
    const [appointments, setAppointments] = useState([])

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

    const getUserData = async () => {
        console.log('🔍 getUserData chamada, token:', token ? 'existe' : 'não existe');
        if (!token) {
            // Se não há token, limpar dados do localStorage
            localStorage.removeItem('userData');
            setUserData(null);
            return;
        }
        
        try {
            // Primeiro, tentar carregar dados salvos do localStorage
            const savedUserData = localStorage.getItem('userData');
            if (savedUserData) {
                const parsedData = JSON.parse(savedUserData);
                setUserData(parsedData);
                console.log('📦 Dados carregados do localStorage:', parsedData);
                return;
            }
            
            // Decodificar o token JWT para obter informações básicas
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                console.log('📦 Dados do token:', payload);
                
                // Criar objeto com dados básicos do usuário
                const basicUserData = {
                    userId: payload.userId,
                    email: payload.email,
                    verified: payload.verified,
                    isAdmin: payload.isAdmin,
                    name: payload.email.split('@')[0], // Nome temporário baseado no email
                    userImage: null,
                    gender: null,
                    birthdate: null
                };
                
                setUserData(basicUserData);
                // Salvar no localStorage
                localStorage.setItem('userData', JSON.stringify(basicUserData));
                console.log('✅ Dados básicos do usuário definidos:', basicUserData);
            }
        } catch (error) {
            console.log('❌ Erro ao decodificar token:', error.message);
            toast.error('Erro ao carregar dados do usuário');
        }
    }

    const clearUserData = () => {
        localStorage.removeItem('userData');
        setUserData(null);
    }

    // Função para buscar agendamentos do usuário
    const getUserAppointments = async () => {
        if (!token || !userData) {
            console.log('❌ Token ou userData não disponível');
            return;
        }
        
        console.log('🔍 Buscando agendamentos para userId:', userData.userId);
        
        try {
            const { data } = await axios.get(backendUrl + '/api/appointment', { 
                headers: {"client": "not-browser", "Authorization": `Bearer ${token}`},
                params: { _id: userData.userId }
            });
            
            console.log('📡 Resposta da API:', data);
            
            if (data.success) {
                setAppointments(data.appointments);
                console.log('📅 Agendamentos carregados:', data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error('Erro ao carregar agendamentos: ' + error.response.data.message);
            } else {
                toast.error('Erro ao carregar agendamentos');
            }
            console.log('Detalhe do erro:', error.response ? error.response.data : error);
        }
    }

    // Função para criar novo agendamento
    const createAppointment = async (docId, slotDate, slotTime) => {
        if (!token || !userData) {
            toast.error('Usuário não autenticado');
            return false;
        }
        
        try {
            const { data } = await axios.post(backendUrl + '/api/appointment', {
                userId: userData.userId,
                docId: docId,
                slotDate: slotDate,
                slotTime: slotTime
            }, {
                headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
            });
            
            if (data.success) {
                toast.success('Agendamento criado com sucesso!');
                // Recarregar agendamentos
                getUserAppointments();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.log('❌ Erro ao criar agendamento:', error);
            toast.error(error.response?.data?.message || 'Erro ao criar agendamento');
            return false;
        }
    }

    // Função para cancelar agendamento
    const cancelAppointment = async (appointmentId) => {
        if (!token || !userData) {
            toast.error('Usuário não autenticado');
            return false;
        }
        
        try {
            const { data } = await axios.post(backendUrl + '/api/appointment/cancel', {
                userId: userData.userId,
                appointmentId: appointmentId
            }, {
                headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}
            });
            
            if (data.success) {
                toast.success('Agendamento cancelado com sucesso!');
                // Recarregar agendamentos
                getUserAppointments();
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            console.log('❌ Erro ao cancelar agendamento:', error);
            toast.error(error.response?.data?.message || 'Erro ao cancelar agendamento');
            return false;
        }
    }

    const value = {
        doctors,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData,
        getUserData,
        clearUserData,
        appointments,
        getUserAppointments,
        createAppointment,
        cancelAppointment
    }

    const getDoctorsData = async () => {

        try {

            

            const { data } = await axios.get(backendUrl + '/api/doctors', { headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}})
           
            if (data.success) {
                const doctorsWithImage = data.doctors.map(doc => ({
                    ...doc,
                    image: doc.image || doc.doctorImage || '',
                    about: doc.about || '',
                    fees: doc.fees || doc.pricePerAppointment || '',
                }));
                setDoctors(doctorsWithImage)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }

    }

    useEffect(() => {
        getDoctorsData()
        getUserData()
        // getUserAppointments() será chamada após getUserData() ser executada
    }, [token])

    // Novo useEffect para chamar getUserAppointments quando userData estiver disponível
    useEffect(() => {
        if (userData && token) {
            getUserAppointments()
        }
    }, [userData, token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider