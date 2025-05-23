import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {

  const {docId} = useParams()
  const {doctors, currencySymbol} = useContext(AppContext)
  const daysOfWeek = ['DOM','SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']

  const [docInfo,SetDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    SetDocInfo(docInfo)
  }

  const getAvaliableSlots = async () => {
    setDocSlots([])

    //pega a data atual
    let today = new Date()

    for(let i = 0; i < 7; i++) {
      //pega o index da data
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate()+i)

      // configurar
      let endTime = new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      //configurando horas
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while(currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})

        //array
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        // 30 m
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev,timeSlots]))

    }
  }

  useEffect(()=>{
    fetchDocInfo()
  }, [doctors,docId])

  useEffect(()=> {
    getAvaliableSlots()
  }, [docInfo])

  useEffect(()=> {
    console.log(docSlots)
  },[docSlots])

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

        {/*------- agendamento -------  */}
        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Horários Disponíveis</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item,index)=> (
              <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-gray-800 text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            ))
          }
        </div>

        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item,index)=>(
            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-gray-800 text-white' : 'text-gray-400 border border-gray-300' }`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button className='bg-gray-800 text-white text-sm font-light px-18 py-4 rounded-full my-6 cursor-pointer'>Marque a consulta</button>
        </div>

        {/* lista de médicos relacionados */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
        

    </div>
  )
}

export default Appointment