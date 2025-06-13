import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, aToken, getAllDoctors, deleteDoctor } = useContext(AdminContext)

  useEffect(()=>{
    if (aToken) {
      getAllDoctors ()
    }
  },[aToken])

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>Todos os Doutores</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {
          doctors.map((item,index)=>(
            <div className='relative border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group transition-all duration-200' key={index}>
              <button
                className='absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center transition-opacity duration-200 shadow-md hover:bg-red-700'
                title='Remover médico'
                onClick={(e) => {
                  e.stopPropagation();
                  deleteDoctor(item.crm);
                }}
              >
                ×
              </button>
              <img className='bg-[#EAEFFF] group-hover:bg-primary transition-all duration-50' src={item.image} alt="" />
              <div className='p-4'>
                <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
                <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DoctorsList