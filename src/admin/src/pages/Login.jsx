import React, {useContext, useState} from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

    const [state,setState] = useState('Admin')
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')

    const {setAToken,backendUrl} = useContext(AdminContext)


    const onSubmitHandler = async (event) => {
        event.preventDefault();
      
        try {
          if (state === 'Admin') {
            const { data } = await axios.post(backendUrl + '/api/auth/signin', { email, password });
      
            if (data.success) {
              localStorage.setItem('aToken', data.token);
              setAToken(data.token);
              toast.success('Login realizado com sucesso!');
            } else {
              toast.error(data.message || 'Erro ao fazer login.');
            }
          } else {
            toast.warn('Login de Doutor ainda não implementado.');
          }
        } catch (error) {
            console.error('Erro no login:', error);  // JÁ EXISTE
            console.log('Detalhes do erro:', error?.response); // ADICIONE ISSO
            toast.error(
              error?.response?.data?.message ||
              'Erro inesperado. Verifique seu backend ou tente novamente.'
            );
          }
      };
      




  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
<div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
    <p className='text-2xl font-semibold'><span className='text-primary'> {state} </span> Login</p>
    <div className='w-full'>
        <p>Email</p>
        <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
    </div>
    <div className='w-full'>
        <p>Senha</p>
        <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
    </div>
    <button className='bg-gray-800 cursor-pointer text-white w-full py-2 my-2 rounded-md text-base'>Login</button>
    {
        state === 'Admin'
        ? <p><span className='text-primary underline cursor-pointer' onClick={()=>setState('Doctor')}></span></p>
        : <p>Login de Admin? <span className='text-primary underline cursor-pointer' onClick={()=>setState('Admin')}>Clique aqui</span></p>
    }
</div>
    </form>
  )
}

export default Login