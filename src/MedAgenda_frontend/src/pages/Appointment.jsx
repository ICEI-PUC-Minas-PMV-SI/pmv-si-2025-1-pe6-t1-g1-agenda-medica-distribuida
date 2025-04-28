import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Appointment = () => {

  const {docId} = useParams()
  const {doctors} = useContext(AppContext)

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
            <img className='bg-gray-800 w-full sm:max-w-72 rounded-4xl' src={docInfo.image} alt="" />
          </div>

          <div className='flex-l border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
            {/* doc info: nome, etc */}
            <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>
              {docInfo.name} 
              <img src={assets.verified_icon} alt="" />
            </p>
            <div>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button>{docInfo.experience}</button>
            </div>

            {/* ------ sobre o medico -------- */}
            <div>
              <p>
                Sobre <img src={assets.info_icon} alt="" />
              </p>
              <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim voluptatibus quidem magnam molestiae pariatur officia iusto ipsam fuga corrupti maxime nemo quod consectetur aliquid, quo porro minima suscipit itaque corporis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum suscipit harum alias laudantium magnam.  </p>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Appointment