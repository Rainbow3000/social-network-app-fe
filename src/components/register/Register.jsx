import React, { useState } from 'react'
import './register.scss'
import { userRegister } from '../../store/slice/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import {hiddenLoginForm} from '../../store/slice/userSlice'
import {hiddenOverlay} from '../../store/slice/appSlice'
const Register = () => {
  
  const [userName,setUserName] = useState("")  
  const [email,setEmail] = useState("")  
  const [password,setPassword] = useState("")  
  const [rePassword,setRePassword] = useState("")  
  
  const dispatch = useDispatch(); 
   const {user} = useSelector(state => state.user);  
  const handleSubmitForm = (e)=>{
    e.preventDefault(); 
    const data = {
        userName,
        email,
        password
    }
    dispatch(userRegister(data)); 
  }

  return (
    <form className='register-form' onSubmit={handleSubmitForm}>
        <div className='register-input-item'>
            <label>Tên người dùng</label>
            <input type="text" onChange={(e)=> setUserName(e.target.value)} />
        </div>
        <div className='register-input-item'>
            <label>Email</label>
            <input type="email" onChange={(e)=> setEmail(e.target.value)} required/>
        </div>
        <div className='register-input-item'>
            <label>Mật khẩu</label>
            <input type="password" onChange={(e)=> setPassword(e.target.value)} />
     </div>
        <div className='register-input-item'>
            <label>Nhập lại mật khẩu</label>
            <input type="password"  onChange={(e)=> setPassword(e.target.value)} />
        </div>
        <div className='register-btn-wrapper'>
            <button type='submit'>Tiếp tục</button>
        </div>
    </form>
  )
}

export default Register