import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = 'R$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])

    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')

    
    

    const value = {
        doctors,
        currencySymbol,
        token, setToken,
    }


    const getDoctorsData = async () => {

        try {

            

            const { data } = await axios.get(backendUrl + '/api/doctors', { headers: {"client": "not-browser", "Authorization": `Bearer ${token}`}})
           
            if (data.success) {
                setDoctors(data.doctors)
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