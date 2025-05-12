import React, {useState} from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {

const [userData,setUserData] = useState({
  name:"Daniel Matos",
image:assets.profile_pic,
email:'danielmatos@gmail.com',
gender:'Masculino',
birthdate: '25/06/2003'

})

const [isEdit,setIsEdit] = useState(false)

  return (
    <div>
        <img src={userData.image} alt="" />

        {
          isEdit
           ? <input type="text" value={userData.name} onChange={e => setUserData(prev =>({...prev,name:e.target.value}))}/>
           : <p>{userData.name}</p>
        }

        <hr />
        <div>
          <p>Informações</p>
          <div>
            <p>Email id:</p>
            <p>{userData.email}</p>
            <p>Gênero:</p>
            {
          isEdit
           ? <select onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))} value={userData.gender}>
            <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
              <option value="Prefiro não dizer">Prefiro não dizer</option>
           </select>
           : <p>{userData.gender}</p>
        }
        <p>Data de nascimento:</p>
        {
          isEdit 
          ? <input type="date" onChange={(e) => setUserData(prev => ({...prev, birthdate: e.target.value}))} value={userData.birthdate}/>
          : <p>{userData.birthdate}</p>

        }
          </div>
        </div>

<div>
  {
    isEdit
    ? <button onClick ={()=>setIsEdit(false)} className='bg-gray-800 text-white px-8 py-3 rounded-full font-light hidden md:block'>Alterar senha</button>
    : <button onClick={()=>setIsEdit(true)} className='bg-gray-800 text-white px-8 py-3 rounded-full font-light hidden md:block'>Alterar senha</button>

  }
</div>



    </div>
  )
}

export default MyProfile