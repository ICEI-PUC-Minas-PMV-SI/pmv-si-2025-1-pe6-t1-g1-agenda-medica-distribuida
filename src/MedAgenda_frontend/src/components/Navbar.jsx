import React from 'react'
import {assets} from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>
        <img src={assets.logo} alt="" />
        <ul>
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