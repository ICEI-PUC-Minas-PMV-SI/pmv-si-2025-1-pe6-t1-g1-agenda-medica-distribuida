import React from 'react'
import { assets } from '../../assets/assets'

const AddDoctor = () => {

  


    return (
        <form className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Adicionar Doutor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4x1 max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={assets.upload_area} alt="" />
                    </label>
                    <input type="file" id="doc-img" hidden />
                    <p>Foto do Doutor</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Nome</p>
                            <input className='border rounded px-3 py-2' type="text" placeholder='Nome' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>CRM</p>
                            <input className='border rounded px-3 py-2' type="text" placeholder='CRM' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Especialidade</p>
                            <select className='border rounded px-3 py-2' name="" id="">
                                <option value="Clínico Geral">Clínico Geral</option>
                                <option value="Ginecologista">Ginecologista</option>
                                <option value="Dermatologista">Dermatologista</option>
                                <option value="Pediatra">Pediatra</option>
                                <option value="Neurologista">Neurologista</option>
                                <option value="Gastroenterologista">Gastroenterologist</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p >Preço da consulta</p>
                            <input className='border rounded px-3 py-2' type="text" placeholder='R$' required />
                        </div>

                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>Sobre o Doutor</p>
                    <textarea className='w-full px-4 pt-2 border rounded' placeholder='Escreva sobre o doutor' rows={5} required />
                </div>

                <button className='bg-gray-800 px-10 py-3 mt-4 text-white rounded-full'>Adicionar</button>


            </div>



        </form>
    )
}







export default AddDoctor