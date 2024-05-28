import React, { useEffect, useState } from 'react';
import '../CSS/RegisterPage.css';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { message} from 'antd';
import Avatar from '../component/ProfilepicDesign';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';


const CheckPassword= () => {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [data, setData] = useState(
    {
      password : "",
    }
  );
  

  useEffect(()=>
  {
      if(!location?.state?.name)
        {
           navigate('/email')
        }
        // eslint-disable-next-line
  },[])

  const handleOnChange = (e)=>
  {
     const {name, value} = e.target;

    setData((prev)=>
    {
      return {
        ...prev,
        [name] : value
      }
    })
  }; 



  const handleSubmit = async(e) =>
  {
   e.preventDefault();
   e.stopPropagation();
   
   const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;
   


   try
   {
      const res = await axios
      (
        {
             method : 'post',
             url : URL,
             data : {
              userId : location?.state?._id,
              password : data.password
             },
             withCredentials : true
        }
      );

      message.success(res.data.message);   


      if(res.data.success)  
        {
          dispatch(setToken(res?.data?.token));
          localStorage.setItem('token', res?.data?.token);
          setData(
           {
            password : "",
            });
            
            navigate('/');
        }  
   }
   catch(error)
   {
      message.error(error?.response?.data?.message || "something went wrong")
   }
  }


  return (
    <div className=' mt-5'>
       <div className=' bg-white w-full max mx-2 px-5 py-4 rounded overflow-hidden mx-auto  shadow'>
             <div className='new-class'>
           
                <Avatar 
                 width = {60}
                 height={60}
                 name={location?.state?.name}
                 imageurl={location?.state?.profile_pic}
                />
             </div>

             <h3 className='text-center'>{location?.state?.name}</h3>
             <form className='d-grid gap-3 mt-4' onSubmit={handleSubmit} >
               
             
                <div className='d-flex flex-column gap-1' >
                  <label className="custom-bold" htmlFor='password' >Password :</label>
                  <input type='password' 
                  id='password'
                  name='password'
                  placeholder='Enter your password'
                  className=' px-2 py-1 custom-focus-outline'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  />
                </div>
          
                <button className='background-btn px-2 py-1'>
                  Let's Go
                </button>
             </form>

             <p className='my-3 text-center' >New User? <Link className='custom-link' to={"/register"} >Register</Link> </p>
             {/* <p className='my-3 text-center' ><Link className='custom-link' to={"/forget-password"} >Forgot Password ?</Link> </p> */}
       </div>
    </div>
  )
}

export default CheckPassword;
