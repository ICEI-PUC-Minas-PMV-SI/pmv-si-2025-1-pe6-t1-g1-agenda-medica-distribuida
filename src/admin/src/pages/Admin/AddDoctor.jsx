import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'
import axios from 'axios'



const AddDoctor = () => {

    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [crm, setCRM] = useState('')
    const [speciality, setSpeciality] = useState('Clínico Geral')
    const [pricePerAppointment, setPrice] = useState('')
    const [about, setAbout] = useState('')
    const [imageUrl, setImageUrl] = useState('')

   
    const {backendUrl, aToken } = useContext(AdminContext)

    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxjzekvs3/image/upload';
    const CLOUDINARY_UPLOAD_PRESET = 'medagenda_unsigned';

    // Função para upload direto para o Cloudinary
    const uploadToCloudinary = async (file) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: data,
        });
        const json = await res.json();
        return json.secure_url;
    };

    // Ao selecionar a imagem, faz upload para o Cloudinary
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setDocImg(file);
        if (file) {
            const url = await uploadToCloudinary(file);
            setImageUrl(url);
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault()


        try {

            if (!imageUrl) {
                return toast.error('Imagem não selecionada ou não enviada')
            }

            const { data } = await axios.post(
                backendUrl + '/api/doctors',
                {
                    name,
                    crm,
                    speciality,
                    pricePerAppointment,
                    about,
                    doctorImage: imageUrl,
                },
                { headers: {"client": "not-browser", "Authorization": `Bearer ${aToken}`}}
            )
            if (data.success) {                
                toast.success(data.message)
                setDocImg(false)
                setImageUrl('')
                setName('')
                setCRM('')
                setSpeciality('')
                setPrice('')
                setAbout('')

            } else {
                
                toast.error(data.message)
            }


        } catch (error) {
            if (error.response) {
                console.error("Status da resposta:", error.response.status);
              console.error("Erro na resposta do servidor:", error.response.data);
              console.error("Status:", error.response.status);
              console.error("Headers:", error.response.headers);
              toast.error(error.response.data?.message || 'Erro do servidor ao adicionar o doutor.');
            } else if (error.request) {
              console.error("Sem resposta do servidor:", error.request);
              toast.error('Servidor não respondeu.');
            } else {
              console.error("Erro na requisição:", error.message);
              toast.error('Erro ao configurar a requisição.');
            }
          }

    }


    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Adicionar Doutor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4x1 max-h-[80vh] overflow-y-scroll'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={handleImageChange} type="file" id="doc-img" hidden />
                    <p>Foto do Doutor</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>
                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Nome</p>
                            <input onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2' type="text" placeholder='Nome' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>CRM</p>
                            <input onChange={e => setCRM(e.target.value)} value={crm} className='border rounded px-3 py-2' type="text" placeholder='CRM' required />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <p>Especialidade</p>
                            <select onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-3 py-2' name="" id="">
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
                            <input onChange={e => setPrice(e.target.value)} value={pricePerAppointment} className='border rounded px-3 py-2' type="number" placeholder='R$' required />
                        </div>

                    </div>
                </div>

                <div>
                    <p className='mt-4 mb-2'>Sobre o Doutor</p>
                    <textarea onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded' placeholder='Escreva sobre o doutor' rows={5} required />
                </div>

                <button type='submit' className='bg-gray-800 px-10 py-3 mt-4 text-white rounded-full'>Adicionar</button>


            </div>



        </form>
    )
}







export default AddDoctor