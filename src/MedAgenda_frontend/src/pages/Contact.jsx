import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
        
    <div className='text-center text-2xl pt-10 text-gray-600'> 
      <p>CONTATO</p>
    </div>

   <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>
   <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />

   <div className='flex flex-col justify-center items-start gap-6'>
   <p className='font-semibold text-lg text-gray-600'>INFORMAÇÕES DE <br /> CONTATO</p>
  <p className='text-gray-600'>Av. Padre Cletus Francis Cox, 1661 -  <br /> Jardim Country Club, Poços de Caldas - <br /> MG, 37714-620</p>
  <p className='text-gray-600'>Tel: (35) 3729-9200  <br /> Email: medagendaapi@gmail.com </p>
   </div>
  
   </div>

    </div>
  )
}

export default Contact 