import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'

const MyAppointments = () => {

  const { doctors } = useContext(AppContext)

  return (
    <div>
        <p className='pb-3 mt-12 font-medium text-zinc-600 border-b border-zinc-300 border-b-[1px]'>Meus Agendamentos</p>
        <div>
          {doctors.slice(0,3).map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b border-zinc-200 border-b-[1px]' key={index}>
              <div>
                <img className='w-32 rounded-4xl bg-indigo-50' src={item.image} alt=""/>
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.name}</p>
                <p>{item.speciality}</p>
                <p className='text-xs mt-10'><span className='text-sm text-neutral-700 font-medium'>Data e Horário</span> 09/10/2025 10:00am</p>
              </div>
              <div></div>
              <div className='flex flex-col justify-end py-1.5'>
                {/* <button>Confirmar Agendamento</button> */}
                <button className='text-sm  text-stone-500 text-center sm:min-w-48 py-2 border border-zinc-300 rounded hover:bg-gray-800 hover:text-white transition-all duration-300 cursor-pointer'>Cancelar Agendamento</button>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}

export default MyAppointments