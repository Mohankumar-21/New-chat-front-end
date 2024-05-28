import Avatar from './ProfilepicDesign';
import React from 'react';
import '../CSS/UserCard.css';
import { Link } from 'react-router-dom';

const UnserCard = ({user, onClose}) => {
  return (
    <>
    <Link to={"/"+user?._id} onClick={onClose} className='d-flex gap-3 border p-2 UserCard-container rounded' >
        <div>
            <Avatar 
              width ={40}
              height={40}
              name={user?.name}
              imageurl= {user?.profile_pic }
              userId = {user?._id}
            />
        </div>
        <div>
            <div className='userdetail-content line-clamp-1' >
                {user?.name}
            </div>
            <p className='email-content line-clamp-1'>{user?.email}</p>
        </div>
        
    </Link>
    </>
  )
}

export default UnserCard;
