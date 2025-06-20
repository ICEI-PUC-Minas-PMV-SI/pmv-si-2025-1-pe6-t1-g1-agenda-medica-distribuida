import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = 'R$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://med-agenda-backend.vercel.app'
    const [doctors, setDoctors] = useState([])

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

    
    

    const value = {
        doctors,
        currencySymbol,
        backendUrl,
        token, setToken,
    }


    const getDoctorsData = async () => {

        try {

            

            const { data } = await axios.get(backendUrl + '/api/doctors', { headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}})
           
            if (data.success) {
                const doctorsWithImage = data.doctors.map(doc => ({
                    ...doc,
                    image: doc.image || doc.doctorImage || '',
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
    }, [])


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider