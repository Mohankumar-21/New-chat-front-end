import React from 'react';
import logo from '../assests/logo3.jpg';
import './Mainpage.css'

const Mainpage = ({children}) => {
  return (
    <>
       <div className='d-flex justify-content-center align-items-center py-3 h-25 border border-info border-2 shadow-sm  bg-white'>
        <img src={logo} alt='logo' height={70} width={200}/>
       </div>

       {children}
    </>
  )
}

export default Mainpage;
