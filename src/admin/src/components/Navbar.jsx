import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'

const NavBar = () => {

const {aToken} = useContext(AdminContext)

  return (
    <div className='relative flex items-center justify-between text-sm py-4 mb-5'>
        <div>
            <img src={assets.admin_logo} alt="" />
            <p>{aToken ? 'Admin' : 'Doctor'}</p>
        </div>
        <button>Logout</button>
    </div>
  )
}

export default NavBar