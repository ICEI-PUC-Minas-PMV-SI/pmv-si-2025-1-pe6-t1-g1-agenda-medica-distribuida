import React from 'react'
import {assets} from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5'>
        <img className='w-60 cursor-pointer' src={assets.logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/doctors'>
                <li className='py-1'>DOUTORES</li>
                <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/about'>
                <li className='py-1'>SOBRE NÓS</li>
                <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1'>CONTATO</li>
                <hr className='border-none outline-none h-0.5 bg-black w-3/5 m-auto hidden' />
            </NavLink>
        </ul>
        <div>
            <button className='bg-black text-white px-8 py-3 rounded-full font-light hidden md:block'>Crie sua conta</button>
        </div>
    </div>
  )
}

export default Navbar