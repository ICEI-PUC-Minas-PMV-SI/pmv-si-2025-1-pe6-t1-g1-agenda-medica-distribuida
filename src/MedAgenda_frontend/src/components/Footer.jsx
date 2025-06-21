import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {

    const navigate = useNavigate()

  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            {/* ------   esquerda ------- */}
            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>A MedAgenda conecta pacientes e profissionais de saúde de forma prática e segura.
                Nossa plataforma foi desenvolvida para facilitar o agendamento de consultas, oferecendo uma experiência simples, eficiente e acessível para todos. Com poucos cliques, você encontra o especialista que precisa, no horário que preferir.</p>
            </div>

            {/* -------- centro --------- */}
            <div>
                <p className='text-xl font-medium mb-5 text-gray-800'>EMPRESA</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li onClick={()=>navigate('/')} className='cursor-pointer text-gray-600 hover:text-black hover:font-medium transition duration-200'>Home</li>
                    <li onClick={()=>navigate('/about')} className='cursor-pointer text-gray-600 hover:text-black hover:font-medium transition duration-200'>Sobre Nós</li>
                    <li onClick={()=>navigate('/contact')} className='cursor-pointer text-gray-600 hover:text-black hover:font-medium transition duration-200'>Contato</li>
                </ul>
            </div>
            {/* --------- direita --------- */}
            <div>
                <p className='text-xl font-medium mb-5 text-gray-800'>CONTATO</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+55111939471185</li>
                    <li>medagenda@gmail.com</li>
                </ul>
            </div>
        </div>

        {/*---------- copyright ------- */}
        <div>
            <hr className='border-t border-gray-300 rounded-full'/>
            <p className='py-5 text-sm text-center text-gray-800'>Copyright © 2025 MedAgenda - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer