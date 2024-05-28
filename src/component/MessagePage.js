// MessagePage.js
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import '../CSS/MessagePage.css';
import Avatar from './ProfilepicDesign';
import { PiDotsThreeCircleVertical } from "react-icons/pi";
import { GoTriangleLeft } from "react-icons/go";
import { BiPlusCircle } from "react-icons/bi";
import { MdVideoLibrary } from "react-icons/md";
import { IoIosImages } from "react-icons/io";
import UploadFile from '../helpers/UploadFile';
import { IoCloseCircle } from "react-icons/io5";
import Loading from './Loading';
import { RiSendPlane2Fill } from "react-icons/ri";
import moment from 'moment';
import { useSocket } from '../context/SocketContext';

const MessagePage = () => {
  const params = useParams();
  const user = useSelector(state => state?.user);
  const [loading, setLoading] = useState(false);
  const socket = useSocket();
  const [userdata, setUserdata] = useState({
      name: "",
      email: "",
      profile_pic: "",
      online: false,
      _id: ""
  });

  const [message, setMessage] = useState({
      text: "",
      imageUrl: "",
      videoUrl: ""
  });

  const [allMessage, setAllmessage] = useState([]);
  const currentMsg = useRef(null);
  const [openimgvid, setopenimgvid] = useState(false);

  useEffect(() => {
      if (currentMsg.current) {
          currentMsg.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
  }, [allMessage]);

  useEffect(() => {
      if (socket) {
          socket.emit('message-page', params.userId);

          socket.on('message-user', (data) => {
              setUserdata(data);
          });

          socket.on('messages', (data) => {
              setAllmessage(data);
          });

          socket.on('new-message', (newMessage) => {
              setAllmessage(prevMessages => [...prevMessages, newMessage]);
          });

          return () => {
              socket.off('message-user');
              socket.off('messages');
              socket.off('new-message');
          };
      }
  }, [socket, params.userId, user]);

  const handleUploadImageVideoOpen = () => {
      setopenimgvid(prev => !prev);
  };

  const handleUploadImage = async (e) => {
      const file = e.target.files[0];
      setLoading(true);
      const uploadPhoto = await UploadFile(file);
      setLoading(false);
      setopenimgvid(false);
      setMessage((prev) => ({
          ...prev,
          imageUrl: uploadPhoto?.url
      }));
  };

  const handleClearImage = () => {
      setMessage((prev) => ({
          ...prev,
          imageUrl: ""
      }));
  };

  const handleClearVideo = () => {
      setMessage((prev) => ({
          ...prev,
          videoUrl: ""
      }));
  };

  const handleUploadVideo = async (e) => {
      const file = e.target.files[0];
      setLoading(true);
      const uploadPhoto = await UploadFile(file);
      setLoading(false);
      setopenimgvid(false);
      setMessage((prev) => ({
          ...prev,
          videoUrl: uploadPhoto?.url
      }));
  };

  const handleOnChange = async (e) => {
      const { value } = e.target;
      setMessage((prev) => ({
          ...prev,
          text: value
      }));
  };

  const handleMessageSubmit = async (e) => {
      e.preventDefault();
      if (message.text || message.imageUrl || message.videoUrl) {
          if (socket) {
              socket.emit('new-message', {
                  sender: user?._id,
                  receiver: params.userId,
                  text: message.text,
                  imageUrl: message.imageUrl,
                  videoUrl: message.videoUrl,
                  msgByuserid: user?._id
              });
              setMessage({
                  text: "",
                  imageUrl: "",
                  videoUrl: ""
              });
          }
      }
  };

  if (!socket) {
      return <div>Loading...</div>; // Add a loading state here
  }

  return (
      <div>
          <header className='message-nav'>
              <div className='message-container'>
                  <Link to={'/'}>
                      <GoTriangleLeft size={30} />
                  </Link>
                  <div className='avatar-align'>
                      <Avatar
                          width={40}
                          height={40}
                          name={userdata?.name}
                          imageurl={userdata?.profile_pic}
                          userId={userdata?._id}
                      />
                  </div>
                  <div className='avatar-align'>
                      <h4 className='name-content'>{userdata?.name}</h4>
                      <p className='para-content'>
                          {userdata.online ? <span className='text-success'>online</span> : <span className='text-danger'>offline</span>}
                      </p>
                  </div>
              </div>
              <div className='dot-align'>
                  <PiDotsThreeCircleVertical size={30} />
              </div>
          </header>

          <div className='Message-Box scrollbar background-img'>
              <div className='Display-Message-container' ref={currentMsg}>
                  {allMessage.map((msg, index) => (
                      <div className={`Display-Message-content rounded ${user._id === msg.msgByuserid ? "margin-align" : ""}`} key={index}>
                          <div className='image-content-container'>
                              {msg?.imageUrl && (
                                  <img
                                      src={msg?.imageUrl}
                                      className='get-image-content'
                                      alt='img'
                                  />
                              )}
                          </div>
                          <div className='image-content-container'>
                              {msg?.videoUrl && (
                                  <video
                                      src={msg?.videoUrl}
                                      className='get-image-content'
                                      controls
                                  />
                              )}
                          </div>
                          <p className='text-message'>{msg.text}</p>
                          <p className='dateFormat'>{moment(msg.createdAt).format('hh:mm')}</p>
                      </div>
                  ))}
              </div>

              {message.imageUrl && (
                  <div className='image-video-upload-container rounded'>
                      <div className='CloseTag-alignment' onClick={handleClearImage}>
                          <IoCloseCircle size={30} />
                      </div>
                      <div className='bg-white p-3 image-alignment'>
                          <img
                              src={message.imageUrl}
                              alt='uploadimag'
                              width={250}
                              height={250}
                              className='align-content'
                          />
                      </div>
                  </div>
              )}

              {message.videoUrl && (
                  <div className='image-video-upload-container rounded'>
                      <div className='CloseTag-alignment' onClick={handleClearVideo}>
                          <IoCloseCircle size={30} />
                      </div>
                      <div className='bg-white p-3 image-alignment'>
                          <video
                              src={message.videoUrl}
                              width={250}
                              height={250}
                              className='align-content'
                              controls
                          />
                      </div>
                  </div>
              )}

              {loading && (
                  <div className='Loading-content'><Loading /></div>
              )}
          </div>

          <div className='Input-message-container'>
              <div className='plus-btn-container'>
                  <button onClick={handleUploadImageVideoOpen} className='plus-icon-align'>
                      <BiPlusCircle size={25} />
                  </button>

                  {openimgvid && (
                      <div className='video-image-icon-container p-3 shadow rounded'>
                          <form>
                              <div className='icon-Box'>
                                  <label htmlFor='upload-image' className='icon-alignment rounded p-1 px-2'>
                                      <div className='image-icon'>
                                          <IoIosImages size={25} />
                                      </div>
                                      <p>Image</p>
                                  </label>
                                  <label htmlFor='upload-video' className='icon-alignment rounded px-2'>
                                      <div className='video-icon'>
                                          <MdVideoLibrary size={25} />
                                      </div>
                                      <p>Video</p>
                                  </label>
                              </div>
                              <input
                                  className='d-none'
                                  type='file'
                                  id='upload-image'
                                  onChange={handleUploadImage}
                              />
                              <input
                                  className='d-none'
                                  type='file'
                                  id='upload-video'
                                  onChange={handleUploadVideo}
                              />
                          </form>
                      </div>
                  )}
              </div>

              <form className='Send-message-container' onSubmit={handleMessageSubmit}>
                  <input
                      className='input-message-box'
                      type='text'
                      placeholder='Type your message here...'
                      value={message.text}
                      onChange={handleOnChange}
                  />
                  <button className='send-icon-align'>
                      <RiSendPlane2Fill size={25} />
                  </button>
              </form>
          </div>
      </div>
  );
};

export default MessagePage;
