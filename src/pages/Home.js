import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { message } from 'antd';
import axios from 'axios';
import { logout, setOnlineUser, setUser } from '../redux/userSlice';
import '../CSS/Home.css';
import Sidebar from '../component/Sidebar';
import logo from '../assests/logo4.png';
import { useSocket } from '../context/SocketContext';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();

  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
      const token = localStorage.getItem('token'); // Get the token from local storage
      const response = await axios.get(URL, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
  
      dispatch(setUser(response.data.data));
  
      if (response.data.data.logout) {
        dispatch(logout());
        navigate('/email');
      }
    } catch (error) {
      message.error('Fetching user data failed!!');
    }
  };
    

  useEffect(() => {
    fetchUserDetails();
    // eslint-disable-next-line 
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
      });

      socket.on('onlineusers', (data) => {
        dispatch(setOnlineUser(data));
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      return () => {
        socket.off('connect');
        socket.off('onlineusers');
        socket.off('disconnect');
      };
    }
  }, [dispatch, socket]);

  const basePath = location.pathname === '/';

  return (
    <div className='Home-container'>
      <div className={!basePath ? 'd-none d-md-block bg-white sidebar-container' : 'bg-white sidebar-container'}>
        <Sidebar />
      </div>

      <div className={basePath ? 'd-none' : ''}>
        <Outlet />
      </div>

      <div className={`d-none ${basePath ? 'd-lg-flex justify-content-center align-items-center flex-column gap-2' : ''}`}>
        <div>
          <img src={logo} width={300} alt='logo' />
        </div>
        <p>Select User to send message</p>
      </div>
    </div>
  );
};

export default Home;
