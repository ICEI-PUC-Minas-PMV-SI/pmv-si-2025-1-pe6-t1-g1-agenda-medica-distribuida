import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {

    const { aToken } = useContext(AdminContext)

    return (
        <div>
            {
                aToken && <ul>

                    <NavLink>
                        <img src={assets.appointment_icon} alt="" />
                        <p>Consultas</p>
                    </NavLink>
                    <NavLink>
                        <img src={assets.add_icon} alt="" />
                        <p>Adicionar doutor</p>
                    </NavLink>
                    <NavLink>
                        <img src={assets.people_icon} alt="" />
                        <p>Lista de doutores</p>
                    </NavLink>

                </ul>
            }

        </div>
    )
}

export default Sidebar