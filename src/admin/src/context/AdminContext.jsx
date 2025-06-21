import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {

    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://med-agenda-backend.vercel.app'

    const getAllDoctors = async () => {

        try {

            const {data} = await axios.get(backendUrl + '/api/doctors', { headers: {"client": "not-browser", "Authorization": `Bearer ${aToken}`}})
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else  {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/appointment', { headers: { "client": "not-browser", "Authorization": `Bearer ${aToken}` } })
            if (data.success) {
                setAppointments(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const deleteDoctor = async (crm) => {
        try {
            const { data } = await axios.delete(
                backendUrl + '/api/doctors/' + crm,
                { headers: {"client": "not-browser", "Authorization": `Bearer ${aToken}`} }
            );
            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors,
        deleteDoctor,
        appointments,
        getAllAppointments
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )

}

export default AdminContextProvider