import React from 'react';
import { FaUserSecret } from "react-icons/fa";
import '../CSS/Avatar.css';
import { useSelector } from 'react-redux';

const Avatar = ({userId, name, imageurl, width, height}) => {
 
    const onlineUser = useSelector(state=>state?.user?.onlineUser);
    
    let avatarName = "";

    if(name) {
        const splitName = name?.split(" ");

        if(splitName.length > 1)
            {
                avatarName = splitName[0][0]+splitName[1][0];
            }
         else
            {
                avatarName = splitName[0][0]
            }

    }

    const bgColor = [
        'bg-primary',
        'bg-secondary',
        'bg-success',
        'bg-danger',
        'bg-warning',
        'bg-info',
        'bg-dark'
    ]
 
    const randomnum = Math.floor(Math.random() * bgColor.length)
    
    const isonline = onlineUser.includes(userId);
   
  return (
    <div className={`avatar-container border text-white`} style={{width : width+"px", height : height+"px"}} >
        {
            imageurl ? (
                <img 
                 
                 src={imageurl}
                 width={width}
                 height={height}
                 alt={name}
                 className='customavatar'
                />
            ) :  (
                name ? 
                (
                    <div style={{width : width+"px", height : height+"px"}} className={`customavatar new-avatar ${bgColor[randomnum]}`} > {avatarName} </div>
                ) : 
                (
                    <FaUserSecret
                    size={width}
                    style={{color : 'black'}}
                    />
                )
            )
        }
        
        {
            isonline && (
                <div className='online-contaiiner' ></div>
            )
        }
    </div>
  )
}

export default Avatar;
