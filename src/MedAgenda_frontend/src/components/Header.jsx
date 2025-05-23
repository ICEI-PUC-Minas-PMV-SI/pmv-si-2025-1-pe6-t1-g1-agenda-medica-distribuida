import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-gray-800 rounded-lg px-6 rounded-1g px-6 md:px-10 1g:px-20'>

        {/* ------ lado esquerdo ------- */}
        <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
            <p className='text-white text-3xl md:text-4xl lg:text-4xl font-semibold leading-tight md:leading-tight lg:leading-tight'>
                Agende sua consulta com <br /> médicos de confiança
            </p>
            <div className='text-white flex flex-col md:flex-row items-center gap-3 text-sm font-light'>
                <p>Navegue pela nossa ampla lista de médicos especializados <br className='hidden sm:block'/> e agende sua consulta facilmente.</p>
            </div>
            <a href="#speciality"  className='flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-800 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300'>
                Guia Médico <img src={assets.arrow_icon} alt="" />
            </a>
        </div>

        {/* ------- lado direito ------- */}
        <div className='md:w-1/2 relative'>
            <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
        </div>
    </div>
  )
}

export default Header