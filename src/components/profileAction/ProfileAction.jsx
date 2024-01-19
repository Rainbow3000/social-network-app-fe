import React, { useEffect, useState } from 'react'
import './profileAction.scss'
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import storage from '../../firebase'; 
import {ref as refStorage,uploadBytes, deleteObject , getDownloadURL} from 'firebase/storage'
import { MdOutlineDateRange } from "react-icons/md";
import {updateUserInfo} from '../../store/slice/userSlice'
import {hiddenLoginForm} from '../../store/slice/userSlice'
import {toggleOverlay} from '../../store/slice/appSlice'

const ProfileAction = () => {
    const [phoneNumber,setPhoneNumber] = useState(""); 
    const [dob,setDob] = useState(""); 
    const [address,setAddress] = useState(""); 
    const [education,setEducation] = useState(""); 
    const [avatar,setAvatar] = useState(""); 
    const dispatch = useDispatch(); 
    const  {userInfo} = useSelector(state => state.user); 
    const handleSubmitForm = (e)=>{
        e.preventDefault(); 
        dispatch(toggleOverlay(true)); 
        const userId = JSON.parse(localStorage.getItem('user'))?.data?._id;  
        const userData = {
            avatar,
            education,
            address,
            dob,
            phoneNumber
        }
        dispatch(updateUserInfo({userId,userData}));
    }


    if(userInfo !== null && userInfo !== undefined){
        dispatch(hiddenLoginForm())
    }
    

    const handleChooseImage = (event)=>{
        const file = event.target.files[0]; 
              const fileName =  `images/${uuid()}-${file.name}`; 
              const storageRef = refStorage(storage,fileName); 
              uploadBytes(storageRef,file).then((snapshot)=>{
                  getDownloadURL(refStorage(storage,fileName)).then(downloadUrl =>{
                    setAvatar(`${downloadUrl}@-@${fileName}`)       
                  })
              })
    }

    
  return (
    <form className='profile-action-form' onSubmit={handleSubmitForm}>
        <span className='profile-action-title'>Cập nhật thông tin cá nhân</span>
        <div className='profile-action-input-item'>
            <label>Ảnh đại diện</label>
            <input type="file" onChange={handleChooseImage} />
            {
                avatar !== "" && (
                    <div className='preview-profile'>
                        <img src={avatar} alt="" />
                    </div>
                )
            }
        </div>
        <div className='profile-action-input-item'>
            <label>Sinh nhật</label>
            <input id='profile-date' value={dob} type="date" onChange={(e)=> setDob(e.target.value)} />
        </div>
        <div className='profile-action-input-item'>
            <label>Số điện thoại</label>
            <input value={phoneNumber} type="text" onChange={(e)=> setPhoneNumber(e.target.value)} />
     </div>
        <div className='profile-action-input-item'>
            <label>Trường học</label>
            <input value={education} type="text"  onChange={(e)=> setEducation(e.target.value)} />
        </div>
        <div className='profile-action-input-item'>
            <label>Nơi sống</label>
            <input value={address} type="text"  onChange={(e)=> setAddress(e.target.value)} />
        </div>
        <div className='profile-action-btn-wrapper'>
            <button type='submit'>Hoàn tất</button>
        </div>
    </form>
  )
}

export default ProfileAction