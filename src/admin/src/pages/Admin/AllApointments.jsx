import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const AllApointments = () => {

    const { appointments, aToken, getAllAppointments } = useContext(AdminContext)

    useEffect(() => {
        if (aToken) {
            getAllAppointments()
        }
    }, [aToken])

    useEffect(() => {
        console.log("Dados recebidos no frontend:", appointments);
    }, [appointments]);

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
                        {appointments.map((item, index) => (
                            <tr key={index} className='bg-white border-b'>
                                <td className='px-6 py-4'>{item.user[0]?.name}</td>
                                <td className='px-6 py-4'>{item.doctor[0]?.name}</td>
                                <td className='px-6 py-4'>{item.slotDate}</td>
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