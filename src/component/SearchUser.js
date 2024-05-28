import React, { useEffect, useState } from 'react';
import '../CSS/SearchUser.css';
import { ImSearch } from "react-icons/im";
import Loading from './Loading';
import UnserCard from './UnserCard';
import {message} from 'antd';
import axios from 'axios';

const SearchUser = ({onClose}) => {

    const [searchUser, setSearchUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleSearchUser = async () =>
    {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/search-user`
        try
        {
           setLoading(true);
           const res = await axios.post(URL,{
            search : search
           })
           setLoading(false);
           setSearchUser(res.data.data);
        }
        catch(error)
        {
            message.error(error?.response?.data?.message)
        }
    }

    useEffect(()=>
    {
        handleSearchUser(); 
        // eslint-disable-next-line
    },[search]);



  return (
    <div className='search-container'>
       <div className='search-main mx-auto  mt-5' >
          <div className='input-container bg-white rounded' >
             <input 
               type='text'
               placeholder='Search user by name, email...'
               className='input-content w-100 p-1 px-4 border-0 no-outline'
               onChange={(e)=>setSearch(e.target.value)}
               value={search}
             />
             <div className='search-icon-alignment'>
               <ImSearch size={20} />
             </div>
       
          </div>

            <div className='bg-white mt-2 mx-2 w-90 p-4 rounded'>
                {/** no user found */}
                {
                    searchUser.length === 0 && !loading &&(
                        <p className='text-center opacity-75' >No user found!!</p>
                    )
                }

                {
                    loading && (
                      <p><Loading/></p> 
                    )
                }
                
                {
                    searchUser.length !== 0 && !loading && (
                        searchUser.map((user,index)=>
                        {
                            return (
                                <UnserCard key={user._id} user={user} onClose={onClose} />
                            )
                        })
                    )
                }
                <div className='search-btn-align' >
                  <button onClick={onClose} className='cancel-btn py-1 mt-2 px-3 rounded'>Close</button>
                </div>
                                    
            </div>
        
       </div>

    </div>
  )
}

export default SearchUser;
