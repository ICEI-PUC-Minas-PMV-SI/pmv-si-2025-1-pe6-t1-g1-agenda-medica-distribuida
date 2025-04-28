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
        <div>
          <div>
            <img src={docInfo.image} alt="" />
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
          </div>
        </div>
    </div>
  )
}

export default Appointment