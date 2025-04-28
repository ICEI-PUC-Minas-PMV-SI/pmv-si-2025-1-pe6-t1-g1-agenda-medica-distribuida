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
        <div className='flex flex-col sm:flex-row gap-4'>
          <div>
            <img className='bg-gray-800 w-full sm:max-w-72 rounded-4xl' src={docInfo.image} alt="" />
          </div>

          <div>
            {/* doc info: nome, etc */}
            <p>
              {docInfo.nome} 
              <img src={assets.verified_icon} alt="" />
            </p>
            <div>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button>{docInfo.experience}</button>
            </div>

            {/* ------ sobroe o medico -------- */}
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