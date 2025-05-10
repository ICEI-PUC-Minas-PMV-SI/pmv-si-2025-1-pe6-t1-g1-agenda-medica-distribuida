import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'


const NavBar = () => {

const {aToken, setAToken} = useContext(AdminContext)

const navigate = useNavigate()

const logout = () => {
    navigate('/')
aToken && setAToken ('')
aToken && localStorage.removeItem('aToken')
}

  return (
    <div className='relative flex items-center justify-between text-sm py-4 mb-5'>
        <div className='flex items-center gap-2 text-xs'>
            <img className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
            <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button onClick={logout} className='bg-gray-800 cursor-pointer text-white px-8 py-3 rounded-full font-light hidden md:block'>Logout</button>
    </div>
  )
}

export default NavBar