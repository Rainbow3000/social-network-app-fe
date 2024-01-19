import React,{useEffect, useState} from 'react'
import './account.scss'
import { IoCloudUploadOutline } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import storage from '../../firebase'; 
import {ref as refStorage,uploadBytes, deleteObject , getDownloadURL} from 'firebase/storage'
import {updatePassword,getUserInfo, resetUserSuccess} from '../../store/slice/userSlice'
import { useNavigate } from 'react-router-dom';
import {toggleOverlay} from '../../store/slice/appSlice'
import { ToastContainer, toast } from 'react-toastify';
import { validateEmail, validateEmpty, validateMinLenght } from '../../helper/validateHelper';


const Account = () => {

    const {user,userInfo,error,success,userSuccessMessage} = useSelector(state => state.user); 
    const [password,setPassword] = useState(""); 
    const [newPassword,setNewPassword] = useState(""); 
    const [reNewPassword,setReNewPassword] = useState(""); 
    const [emptyErr,setEmptyErr] = useState(""); 
    const [passwordLengthErr,setPasswordLengthErr] = useState(""); 
    const [passwordNotMatchErr,setPasswordNotMatchErr] = useState(""); 
    const [passwordErr,setPasswordErr] = useState(""); 
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
    let flag = 0; 
    const handleSubmitForm = (e)=>{
        e.preventDefault(); 

        if(validateEmpty(password)){
            setEmptyErr('Mật khẩu không được bỏ trống')
            flag = 1;
        }

        if(validateMinLenght(newPassword,6) || validateMinLenght(reNewPassword,6) ){
            setPasswordLengthErr("Mật khẩu phải lớn hơn hoặc bằng 6 ký tự")
            flag = 1;
        }

        if(newPassword.trim() !== reNewPassword.trim()){
            setPasswordNotMatchErr("Mật khẩu nhập lại không khớp")
            flag = 1; 
        }

        if(flag === 1){
            return; 
        }

        dispatch(toggleOverlay(true))
        const accountData = {
            password,
            newPassword
        }

        dispatch(updatePassword({accountData,accountId:user.data._id})) 
    }

    useEffect(()=>{
        dispatch(toggleOverlay(false)); 
    },[userInfo])

    useEffect(()=>{
        dispatch(getUserInfo(user?.data._id));
    },[])

    useEffect(()=>{

    },[userInfo])

 

    useEffect(()=>{
        if(error !== null){
            if(error?.message?.split(':')[0] === "Password"){
               setPasswordErr(error?.message?.split(':')[1]); 
            }
            dispatch(toggleOverlay(false)); 
        }
    
    },[error,success])
    


    if(success){
        toast.success(userSuccessMessage)
        dispatch(resetUserSuccess())
         dispatch(toggleOverlay(false)); 
    }

  return (
    <div className='edit-profile-container'>
        <ToastContainer/>
        <form onSubmit={handleSubmitForm}>
            <div className='input-list-wrapper'>
                <div className='input-item-wrap'>
                    <label htmlFor="">Email</label>
                    <input style={{fontSize:14}} disabled value={user?.data.email} type="email" />
                </div>

                <div className='input-item-wrap'>
                    <label htmlFor="">Mật khẩu hiện tại</label>
                    <span className='text-err'>{passwordErr}</span>
                    <span className='text-err'>{emptyErr}</span>
                    <input placeholder='Mật khẩu hiện tại' value={password} type="password" onChange={(e)=>{
                        setPassword(e.target.value)
                        setPasswordErr("");
                        setEmptyErr(""); 
                    }}/>
                </div>

                <div className='input-item-wrap'>
                    <label htmlFor="">Mật khẩu mới</label>
                    <span className='text-err'>{passwordLengthErr}</span>
                    <input placeholder='Mật khẩu mới' value={newPassword} type="password" onChange={(e) => {
                        setNewPassword(e.target.value)
                        setPasswordLengthErr(""); 
                    }}/>
                </div>

                <div className='input-item-wrap'>
                    <label htmlFor="">Nhập lại mật khẩu mới</label>
                    <span className='text-err'>{passwordLengthErr}</span>
                    <span className='text-err'>{passwordNotMatchErr}</span>
                    <input placeholder='Nhập lại mật khẩu mới' value={reNewPassword} type="password" onChange={(e) => {
                        setReNewPassword(e.target.value)
                        setPasswordLengthErr(""); 
                        setPasswordNotMatchErr(""); 
                    }}/>
                </div>
            
                
                <div className='input-item'>
                    <button type="submit" className='btn-update-pass'>Cập nhật</button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default Account