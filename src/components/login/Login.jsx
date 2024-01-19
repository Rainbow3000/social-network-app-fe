import React, { useState } from 'react'
import './login.scss'
import { useDispatch,useSelector } from 'react-redux';
import { userLogin } from '../../store/slice/userSlice';
import {hiddenLoginForm} from '../../store/slice/userSlice'
const Login = () => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const dispatch= useDispatch(); 
  const {user} = useSelector(state => state.user); 
  const handleSubmitForm = (e)=>{
    e.preventDefault(); 
    const data = {
      email,
      password
    }
    dispatch(userLogin(data)); 
  }

  if(user !== null && user.statusCode === 200){
    dispatch(hiddenLoginForm());
   
  }
  return (
    <form className='login-form' onSubmit={handleSubmitForm}>
        <div className='login-input-item'>
            <label>Email</label>
            <input type="email" onChange={(e)=> setEmail(e.target.value)} />
        </div>
        <div className='login-input-item'>
            <label>Mật khẩu</label>
            <input type="password" onChange={(e)=> setPassword(e.target.value)}/>
        </div>
        <div className='login-btn-wrapper'>
          <button type='submit'>Đăng Nhập</button>
        </div>
    </form>
  )
}

export default Login