import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';

const App = () => {
  const {aToken} = useContext(AdminContext)
  return aToken ? ( 
    <div className='bg-[#F8F9FD]'>
      
      <ToastContainer/>
      <NavBar />
    </div>
  ) : (
    <>
    <Login />
    <ToastContainer/>
    </>
  )
}

export default App