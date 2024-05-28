// Sidebar.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiUserGroup } from "react-icons/hi2";
import { RiLogoutCircleLine } from "react-icons/ri";
import Avatar from './ProfilepicDesign';
import EditUserDetail from './EditUserDetail';
import talk from '../assests/talk.avif';
import SearchUser from './SearchUser';
import { FaImage, FaVideo } from "react-icons/fa";
import { logout } from '../redux/userSlice';
import { SiGooglemessages } from "react-icons/si";
import { useSocket } from '../context/SocketContext';
import '../CSS/Sidebar.css';

const Sidebar = () => {
    const user = useSelector(state => state?.user);
    const [editUser, setUserEdit] = useState(false);
    const [alluser, setAlluser] = useState([]);
    const [searchUser, SetSearchUser] = useState(false);
    const socket = useSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (socket) {
            socket.emit('sidebar', user?._id);

            socket.on('conversation', (data) => {
                const conversationUserData = data.map((convuser) => {
                    if (convuser?.sender?._id === convuser?.receiver?._id) {
                        return { ...convuser, userDetails: convuser?.sender };
                    } else if (convuser?.receiver?._id !== user?._id) {
                        return { ...convuser, userDetails: convuser?.receiver };
                    } else {
                        return { ...convuser, userDetails: convuser?.sender };
                    }
                });
                setAlluser(conversationUserData);
            });

            return () => {
                socket.off('conversation');
            };
        }
    }, [socket, user]);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/email');
    };

    return (
        <div className='sidebar-main bg-white'>
            <div className='Sidebar-container py-4 Sidebar-contain'>
                <div className='top-container'>
                    <NavLink className={({ isActive }) => `logo-design ${isActive && "bacgroud_Set"}`} title='chat'>
                        <SiGooglemessages size={35} style={{ color: 'black' }} />
                    </NavLink>

                    <div onClick={() => SetSearchUser(true)} className='logo-design' title='Add friend'>
                        <HiUserGroup size={40} />
                    </div>
                </div>
                <div className='bottom-container'>
                    <button title={`${user?.name}`} className='avatar-conatiner mb-1 mx-auto' onClick={() => { setUserEdit(true) }}>
                        <Avatar width={45} height={45} name={user?.name} imageurl={user?.profile_pic} userId={user?._id} className='custom-align-avatar-btn' />
                    </button>
                    <button className='logo-design new-set' title='logout' onClick={handleLogout}>
                        <RiLogoutCircleLine size={30} />
                    </button>
                </div>
            </div>

            <div className='p-1 pt-2 Message-box'>
                <h4 className='Message-Container'>Chats</h4>
                <hr />
                <div className='message-content scrollbar'>
                    {alluser.length === 0 && (
                        <div>
                            <div className='d-flex justify-content-center my-4 custom-image'>
                                <img src={talk} alt='' width={150} />
                            </div>
                            <p className='text-center custom-image'>Start a new conversation</p>
                        </div>
                    )}

                    {alluser.map((msg, index) => {
                        return (
                            <NavLink to={'/' + msg?.userDetails?._id} key={msg?._id} className='sidebar-alluser-container shadow-sm rounded m-1 px-2'>
                                <div>
                                    <Avatar imageurl={msg?.userDetails?.profile_pic} name={msg?.userDetails?.name} height={50} width={50} userId={msg?.userDetails?._id} />
                                </div>

                                <div>
                                    <p className='sidebar-name-alignment'>{msg?.userDetails?.name}</p>
                                    <div>
                                        <div>
                                            {msg?.lastMsg?.imageUrl && (
                                                <div className='lastmsg-imagevideo-alignment d-flex'>
                                                    <span><FaImage size={20} /></span>
                                                    <span>Image</span>
                                                </div>
                                            )}

                                            {msg?.lastMsg?.videoUrl && (
                                                <div className='lastmsg-imagevideo-alignment'>
                                                    <span><FaVideo size={20} /></span>
                                                    <span>Video</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className='lastmessage-alignment'>{msg?.lastMsg?.text}</p>
                                    </div>
                                </div>
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {editUser && <EditUserDetail onClose={() => setUserEdit(false)} user={user} />}
            {searchUser && <SearchUser onClose={() => SetSearchUser(false)} />}
        </div>
    );
};

export default Sidebar;
