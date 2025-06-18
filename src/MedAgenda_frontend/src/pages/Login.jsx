import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const [state, setState] = useState('Sign Up')
  const [loading, setLoading] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gender, setGender] = useState('')
  const [birthdate, setBirthdate] = useState('')

  const navigate = useNavigate()
  const { backendUrl, token, setToken } = useContext(AppContext)

  // Função para validar senha
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    return passwordRegex.test(password)
  }

  // Função para mapear gênero do frontend para o backend
  const mapGenderToBackend = (frontendGender) => {
    const genderMap = {
      'Masculino': 'Male',
      'Feminino': 'Female'
    }
    return genderMap[frontendGender] || frontendGender
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      if (state === 'Sign Up') {
        // Validação de senha para cadastro
        if (!validatePassword(password)) {
          toast.error('A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número')
          setLoading(false)
          return
        }

        // Preparar dados para o backend
        const signupData = {
          name,
          email,
          password,
          gender: mapGenderToBackend(gender),
          birthdate: birthdate ? new Date(birthdate).toISOString() : undefined
        }

        const { data } = await axios.post(backendUrl + '/api/auth/signup', signupData)

        if (data.success) {
          toast.success('Conta criada com sucesso! Faça login para continuar.')
          setState('Login')
          // Limpar campos após cadastro bem-sucedido
          setName('')
          setGender('')
          setBirthdate('')
          setPassword('')
        } else {
          toast.error(data.message || 'Erro ao criar conta')
        }

      } else {
        // Login
        const { data } = await axios.post(backendUrl + '/api/auth/signin', { email, password })

        if (data.success) {
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Login realizado com sucesso!')
        } else {
          toast.error(data.message || 'Erro no login')
        }
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else if (error.response?.status === 401) {
        toast.error('Credenciais inválidas')
      } else if (error.response?.status === 409) {
        toast.error('Usuário já existe')
      } else {
        toast.error('Erro de conexão. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token, navigate])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Crie sua conta' : 'Login'}</p>

        {state === 'Sign Up'
          ? <div className='w-full'>
              <p>Nome</p>
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                type="text" 
                required 
                disabled={loading}
              />
            </div>
          : null
        }

        <div className='w-full'>
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className='border border-[#DADADA] rounded w-full p-2 mt-1' 
            type="email" 
            required 
            disabled={loading}
          />
        </div>

        <div className='w-full'>
          <p>Senha</p>
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            className='border border-[#DADADA] rounded w-full p-2 mt-1' 
            type="password" 
            required 
            disabled={loading}
            placeholder={state === 'Sign Up' ? 'Mín. 8 chars, 1 maiúscula, 1 minúscula, 1 número' : ''}
          />
          {state === 'Sign Up' && password && !validatePassword(password) && (
            <p className='text-red-500 text-xs mt-1'>
              A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um número
            </p>
          )}
        </div>

        {state === 'Sign Up'
          ? <>
              <div className='w-full'>
                <p>Gênero</p>
                <select 
                  onChange={(e) => setGender(e.target.value)} 
                  value={gender} 
                  className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                  required
                  disabled={loading}
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div className='w-full'>
                <p>Data de Nascimento</p>
                <input 
                  onChange={(e) => setBirthdate(e.target.value)} 
                  value={birthdate} 
                  className='border border-[#DADADA] rounded w-full p-2 mt-1' 
                  type="date" 
                  required
                  disabled={loading}
                />
              </div>
            </>
          : null
        }

        <button 
          className={`w-full py-2 my-2 rounded-md text-base text-white ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gray-800 cursor-pointer hover:bg-gray-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Carregando...' : (state === 'Sign Up' ? 'Criar conta' : 'Entrar')}
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