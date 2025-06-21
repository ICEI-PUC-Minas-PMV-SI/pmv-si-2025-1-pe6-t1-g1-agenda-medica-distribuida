import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = 'R$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://med-agenda-backend.vercel.app'
    const [doctors, setDoctors] = useState([])
    const [userData, setUserData] = useState(null)

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

    const getUserData = async () => {
        console.log('🔍 getUserData chamada, token:', token ? 'existe' : 'não existe');
        if (!token) return;
        
        try {
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
                console.log('✅ Dados básicos do usuário definidos:', basicUserData);
            }
        } catch (error) {
            console.log('❌ Erro ao decodificar token:', error.message);
            toast.error('Erro ao carregar dados do usuário');
        }
    }

    const value = {
        doctors,
        currencySymbol,
        backendUrl,
        token, setToken,
        userData, setUserData,
        getUserData
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
    }, [token])


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider