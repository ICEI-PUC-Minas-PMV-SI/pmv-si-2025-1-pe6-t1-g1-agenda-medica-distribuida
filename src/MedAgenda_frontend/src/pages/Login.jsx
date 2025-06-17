import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('')
  const [birthdate, setBirthdate] = useState('')


  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (state === 'Sign Up') {

      const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password, gender, birthdate })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    } else {

      const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

      if (data.success) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
      } else {
        toast.error(data.message)
      }

    }

  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
  <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
    <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Crie sua conta' : 'Login'}</p>

    {state === 'Sign Up'
      ? <div className='w-full'>
          <p>Nome</p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="text" required />
        </div>
      : null
    }

    <div className='w-full'>
      <p>Email</p>
      <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
    </div>

    <div className='w-full'>
      <p>Senha</p>
      <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
    </div>

    {state === 'Sign Up'
      ? <>
          <div className='w-full'>
            <p>Gênero</p>
            <select onChange={(e) => setGender(e.target.value)} value={gender} className='border border-[#DADADA] rounded w-full p-2 mt-1' required>
              <option value="">Selecione</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
              <option value="Prefiro não dizer">Prefiro não dizer</option>
            </select>
          </div>

          <div className='w-full'>
            <p>Data de Nascimento</p>
            <input onChange={(e) => setBirthdate(e.target.value)} value={birthdate} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="date" required />
          </div>
        </>
      : null
    }

    <button className='bg-gray-800 cursor-pointer text-white w-full py-2 my-2 rounded-md text-base'>
      {state === 'Sign Up' ? 'Crie sua conta' : 'Login'}
    </button>

    {state === 'Sign Up'
      ? <p>Já tem uma conta? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login</span></p>
      : <p>Criar uma nova conta? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Clique aqui</span></p>
    }
  </div>
</form>
  )
}

export default Login