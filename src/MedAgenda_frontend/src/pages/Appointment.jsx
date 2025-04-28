import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Appointment = () => {

  const {docId} = useParams()
  const {doctors, currencySymbol} = useContext(AppContext)

  const [docInfo,SetDocInfo] = useState(null)

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    SetDocInfo(docInfo)
    console.log(docInfo)
  }

  useEffect(()=>{
    fetchDocInfo()
  }, [doctors,docId])

  return docInfo && (
    <div>
      {/* detalhe medico */}
        <div className='flex flex-col sm:flex-row gap-20 items-center justify-center sm:justify-start'>
          <div className='pl-12'>
            <img className='bg-gray-800 w-full sm:max-w-35 rounded-4xl' src={docInfo.image} alt="" />
          </div>

          <div className='flex-l border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            {/* doc info: nome, etc */}
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name} 
              <img className='w-5' src={assets.verified_icon} alt="" />
            </p>
            <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
            </div>

            {/* ------ sobre o medico -------- */}
            <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>
                Sobre <img src={assets.info_icon} alt="" />
              </p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1 text-justify'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim voluptatibus quidem magnam molestiae pariatur officia iusto ipsam fuga corrupti maxime nemo quod consectetur aliquid, quo porro minima suscipit itaque corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum suscipit harum alias laudantium magnam.  </p>
            </div>
            <p className='text-gray-500 font-medium mt-4'>
              Valor da consulta: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
            </p>
          </div>
        </div>
    </div>
  )
}

export default Appointment