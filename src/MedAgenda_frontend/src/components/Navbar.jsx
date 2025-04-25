import React from 'react'
import {assets} from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5'>
        <img className='w-60 cursor-pointer' src={assets.logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink>
                <li>HOME</li>
                <hr />
            </NavLink>
            <NavLink>
                <li>DOUTORES</li>
                <hr />
            </NavLink>
            <NavLink>
                <li>SOBRE NÓS</li>
                <hr />
            </NavLink>
            <NavLink>
                <li>CONTATO</li>
                <hr />
            </NavLink>
        </ul>
        <div>
            <button>Crie sua conta</button>
        </div>
    </div>
  )
}

export default Navbar