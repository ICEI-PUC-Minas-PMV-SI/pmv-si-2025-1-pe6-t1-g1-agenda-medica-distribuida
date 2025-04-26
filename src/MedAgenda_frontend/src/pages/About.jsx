import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-10 text-[#4B5563]'>
        <p>SOBRE <span className='text-gray-700 font-semibold'>NÓS</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[360px]' src={assets.sobre_nos_Illustration_Medical} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600'>
          <p>Lorem ipsum dolor sit amet. In reiciendis doloribus vel reiciendis galisum non distinctio dolor ut commodi recusandae qui molestiae amet aut accusantium ipsa. Ea ducimus tempora ut voluptas maiores sed quia fugiat qui delectus aperiam ut nostrum officiis in dolores officiis. Sed nobis molestias aut nulla distinctio in quia saepe et similique laborum sed tempore dolorem rem velit enim.</p>
          <p>Aut inventore libero in internos omnis ut libero deleniti non voluptatem omnis. Ut explicabo voluptatum non quasi modi aut alias adipisci. Non delectus iste eum cupiditate veritatis ea fuga facilis.</p>
          <b className='text-gray-800'>Nossa Visão</b>
          <p>Lorem ipsum dolor sit amet. In reiciendis doloribus vel reiciendis galisum non distinctio dolor ut commodi recusandae qui molestiae amet aut accusantium ipsa. Ea ducimus tempora ut voluptas maiores sed quia fugiat qui delectus aperiam ut nostrum officiis in dolores officiis. Sed nobis molestias aut nulla distinctio in quia saepe et similique laborum sed tempore dolorem rem velit enim.</p>
          <p>Aut inventore libero in internos omnis ut libero deleniti non voluptatem omnis. Ut explicabo voluptatum non quasi modi aut alias adipisci. Non delectus iste eum cupiditate veritatis ea fuga facilis.</p>
        </div>
      </div>

      <div className='text-xl my-4'>
        <p>POR QUAIS MOTIVOS <br /> ESCOLHER <span className='text-gray-700 font-semibold'>NÓS</span></p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>EFICIÊNCIA:</b>
          <p>Aut inventore libero in internos omnis ut libero deleniti</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVENIÊNCIA:</b>
          <p>Aut inventore libero in internos omnis ut libero deleniti</p>

        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZAÇÃO:</b>
          <p>Aut inventore libero in internos omnis ut libero deleniti</p>

        </div>
      </div>

    </div>
  )
}

export default About