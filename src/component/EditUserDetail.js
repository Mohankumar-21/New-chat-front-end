import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import '../CSS/EditUserDetail.css';
import Avatar from './ProfilepicDesign';
import UploadFile from '../helpers/UploadFile';
import axios from 'axios';
import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EditUserDetail = ({ onClose, user }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      profile_pic: user?.profile_pic || ''
    }
  });

  const uploadPhotoref = useRef();
  const dispatch = useDispatch();

  const handleOpenupload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoref.current.click();
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadPhoto = await UploadFile(file);
      setValue('profile_pic', uploadPhoto?.url || watch('profile_pic'));
    }
  };

  const onSubmit = async (data) => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;

    try {
      const response = await axios.post(URL, data, {
        withCredentials: true,
      });

      message.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        onClose();
      }
    } catch (error) {
      message.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='Edituser-Container'>
      <div className='bg-white p-4 m-1 rounded Edituser-content shadow'>
        <h2 className='text-center custom-font'>User Details</h2>
        <p className='custom-ptag'>Edit User Information</p>

        <form onSubmit={handleSubmit(onSubmit)} className='d-grid gap-3 mt-3'>
          <div className='Edit-FormContainer'>
            <label className='custom-bold' htmlFor='name'>Name:</label>
            <input
              type='text'
              name='name'
              id='name'
              {...register('name', { required: true })}
              className='custom-input py-1 px-2 mt-1 rounded'
            />
            {errors.name && <span className="error">Name is required</span>}
          </div>
          <div className='custom-bold'>
            <div>Photo:</div>
            <div className='my-1 arrange-photo-form'>
              <Avatar
                width={50}
                height={50}
                imageurl={watch('profile_pic')}
                name={watch('name')}
              />
              <label className='custom-bold' htmlFor='profile-pic'>
                <button className='photo-btn mt-2 p-1 px-3 rounded' onClick={handleOpenupload}>Change Photo</button>
                <input
                  type='file'
                  id='profile-pic'
                  className='hidden'
                  onChange={handleUpload}
                  ref={uploadPhotoref}
                />
              </label>
            </div>
          </div>
          <hr />
          <div className='d-flex gap-3'>
            <button type='button' onClick={onClose} className='cancel-btn py-1 px-3 rounded'>Cancel</button>
            <button type='submit' className='Save-btn py-1 px-3 rounded'>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserDetail;
