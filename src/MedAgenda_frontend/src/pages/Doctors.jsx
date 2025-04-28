import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const navigate = useNavigate()

  const {doctors} = useContext(AppContext)

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
  }

  useEffect(()=> {
    applyFilter()
  }, [doctors, speciality])

  return (
    <div>
        <p className='text-gray-600'>Navegue pela lista de nossos melhores profissionais.</p>
        <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
          <div className='flex-col gap-4 text-sm text-gray-600'>
            <p className>Clínico Geral</p>
            <p className>Ginecologista</p>
            <p className>Dermatologista</p>
            <p className>Pediatra</p>
            <p className>Neurologista</p>
            <p className>Gastroenterologista</p>
          </div>
          <div className='w-full grid [grid-template-columns:repeat(auto-fill,minmax(100px,1fr))] gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
            {
              filterDoc.map((item,index)=>(
                <div onClick={(()=>navigate(`/appointment/${item._id}`))} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                    <img className='bg-blue-50' src={item.image} alt="" />
                    <div className='p-4'>
                      <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                        <p className='w-2 h-2 bg-green-500 rounded-full text-xs'></p><p>Disponível</p>
                      </div>
                    <p className='text-gray-900 text-base font-medium'>{item.name}</p>
                    <p className='text-shadow-gray-600 text-xs'>{item.speciality}</p>
                    </div>
                </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default Doctors