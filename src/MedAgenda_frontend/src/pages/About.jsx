import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#4B5563]'>
        <p>SOBRE <span className='text-gray-700 font-semibold'>NÓS</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>A MedAgenda é uma plataforma desenvolvida para transformar a experiência de agendamento médico. Com o aumento da demanda por consultas e a necessidade de organização, buscamos soluções que otimizem o tempo de pacientes, médicos e secretários de clínicas e hospitais.</p>
          <p>Nossa proposta é oferecer uma ferramenta que conecta todos os envolvidos, proporcionando praticidade, eficiência e segurança na marcação e no gerenciamento de consultas médicas em qualquer lugar.</p>
          <b className='text-gray-800'>Nossa Visão</b>
          <p>Ser referência em inovação tecnológica para o setor da saúde, oferecendo um sistema de agendamento que se adapta às necessidades de cada usuário.</p>
          <p>Buscamos melhorar a gestão do tempo, aumentar a qualidade do atendimento e tornar o acesso aos serviços de saúde mais ágil, prático e humano para todos.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>POR QUAIS MOTIVOS <br /> ESCOLHER <span className='text-gray-700 font-semibold'>NÓS</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFICIÊNCIA:</b>
          <p>Agendamentos otimizados e redução de conflitos de horários, melhorando o fluxo de atendimentos e diminuindo faltas.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIÊNCIA:</b>
          <p>Agende, altere ou cancele consultas facilmente, de qualquer dispositivo, com acesso imediato à disponibilidade dos médicos.</p>

        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-500 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZAÇÃO:</b>
          <p>Plataforma adaptável às rotinas de clínicas e consultórios, com agendamento fácil e lembretes ajustados para cada necessidade.</p>

        </div>
      </div>

    </div>
  )
}

export default About