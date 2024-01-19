import React, { useEffect, useRef, useState } from 'react'
import './auth.scss'
import { FaRegUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FiLock } from "react-icons/fi";
import { BsGenderMale } from "react-icons/bs";
import { MdOutlineDateRange } from "react-icons/md";
import { validateEmail, validateEmpty, validateMinLenght } from '../../helper/validateHelper';
import { useDispatch,useSelector } from 'react-redux';
import { userLogin, userRegister,recoverPassword,resetUserSuccess } from '../../store/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import {toggleOverlay} from '../../store/slice/appSlice'
import { ToastContainer, toast } from 'react-toastify';
const Auth = () => {

  const dateInputRef = useRef(); 
  const [formState,setFormState] = useState(1);
  const [dob,setDob] = useState("");
  const [email,setEmail] = useState("");
  const [userName,setUserName] = useState("");
  const [password,setPassword] = useState(""); 
  const [gender,setGender] = useState("1"); 
  const [isForgetPassword,setIsForgetPassword] = useState(false); 
  const [emailErr,setEmailErr] = useState("")
  const [userNameErr,setUserNameErr] = useState("")
  const [passwordErr,setPasswordErr] = useState("")
  const [genderErr,setGenderErr] = useState("")
  const [dobErr,setDobErr] = useState("")
  
  const {user,error,isRecoverPassSuccess} = useSelector(state => state.user); 

  const navigate = useNavigate(); 
  const handleClick = ()=>{
    dateInputRef.current.showPicker();
  }

  const handleSetChangeStateForget = (value)=>{
    setIsForgetPassword(value); 
  }

  const handleChangeStateForm = (state)=>{
    setFormState(state);
    setEmail(""); 
    setPassword("");
    setUserName("");
    setDob("");
    setGender(1);
    setEmailErr("");
    setPasswordErr("");
    setUserNameErr("");
    setDobErr("");
    setGenderErr("");
    setIsForgetPassword(false); 
  }
  const dispatch = useDispatch(); 


  const handleSubmitRegisterForm = (e)=>{
    try {
    let flag = 0; 
    e.preventDefault(); 
    if(validateEmpty(email)){
        setEmailErr('Email không được bỏ trống')
        flag = 1
    }else if(!validateEmail(email)){
        setEmailErr('Email không đúng định dạng')
        flag = 1;
    }

    if(validateEmpty(userName)){
        setUserNameErr('Tên người dùng không được bỏ trống')
        flag = 1
    }

    if(validateEmpty(password)){
        setPasswordErr('Mật khẩu không được bỏ trống')
        flag = 1
    }else if(validateMinLenght(password,6)){
        setPasswordErr('Mật khẩu không được ít hơn 6 ký tự')
        flag = 1
    }

    if(validateEmpty(dob)){
        setDobErr('Sinh nhật không được bỏ trống')
        flag = 1
    }
    
    const data = {
        email,
        userName,
        password,
        gender,
        dob
    }
    
    if(flag === 1) return;   
    dispatch(toggleOverlay(true))
    dispatch(userRegister(data)); 
} catch (error) {
    console.log(error);  
}
}


const handleSubmitLoginForm = (e)=>{
    e.preventDefault(); 
    let flag = 0;
    if(validateEmpty(email)){
        setEmailErr('Email không được bỏ trống')
        flag = 1
    }else if(!validateEmail(email)){
        setEmailErr('Email không đúng định dạng')
        flag = 1;
    }

    if(validateEmpty(password)){
        setPasswordErr('Mật khẩu không được bỏ trống')
        flag = 1
    }else if(validateMinLenght(password,6)){
        setPasswordErr('Mật khẩu không được ít hơn 6 ký tự')
        flag = 1
    }

    if(flag === 1){
        flag = 0; 
        return;
    }; 

    dispatch(toggleOverlay(true))
    
    const data = {
        email,
        password
    }
    dispatch(userLogin(data)); 


}

const handleRecoverPassword = (e)=>{
    try {     
        e.preventDefault(); 
        let flag = 0;
        if(validateEmpty(email)){
            setEmailErr('Email không được bỏ trống')
            flag = 1
        }else if(!validateEmail(email)){
            setEmailErr('Email không đúng định dạng')
            flag = 1;
        }

        if(flag === 1) return; 
        dispatch(recoverPassword({email}))
        handleSetChangeStateForget(false); 
    } catch (error) {
        
    }
}

if(isRecoverPassSuccess === true){
    toast.success("Khôi phục mật khẩu thành công.Hãy kiểm tra email");
    handleSetChangeStateForget(false); 
    handleChangeStateForm(1);  
    dispatch(resetUserSuccess());
}



useEffect(()=>{
    if(error !== null){
        if(error?.message?.split(':')[0] === "Email"){
            setEmailErr(error?.message?.split(':')[1]); 
            dispatch(toggleOverlay(false)); 
        }

        if(error?.message?.split(':')[0] === "Password"){
            setPasswordErr(error?.message?.split(':')[1]); 
            dispatch(toggleOverlay(false)); 
        }
    }
    if(user !== null && (user.statusCode === 200 || user.statusCode === 201)){
        dispatch(toggleOverlay(false)); 
        navigate('/'); 
    }    
    
},[error,user])


  return (
    <div className='auth-container'> 
        <ToastContainer/>
        <div className="main">
            <div className="title">
                <span>K2 Meet !</span>
                <span>Tạo tài khoản để tiếp tục và kết nối với những người dùng khác</span>
            </div>
            {
                isForgetPassword === false ? (
                    <div className="form-container">
                        <div className={formState !== 1 ? "form-slice active":"form-slice"}>
                        <div className='form-wrapper'>
                                <form onSubmit={handleSubmitLoginForm}>
                                    <div className='input-item'>
                                    <span className="error-text">{emailErr}</span>
                                    <div className='input-main'>
                                        <MdAlternateEmail className='icon'/>
                                        <input value={email} type="text" placeholder='Email' onChange={e => setEmail(e.target.value)} />
                                    </div>
                                    </div>
                                    <div className='input-item'>
                                        <span className="error-text">{passwordErr}</span>
                                        <div className="input-main">
                                            <FiLock className='icon'/>
                                            <input value={password} type="password" placeholder='Mật khẩu' onChange={e => setPassword(e.target.value)} />
                                            <FaRegEyeSlash className='icon'/>
                                        </div>
                                    </div>
                                    <div className='input-wrapper'>
                                        <div className='forget-pass'>
                                            <span>Quên mật khẩu ?</span>
                                            <span onClick={()=>handleSetChangeStateForget(true)}>Cấp lại mật khẩu</span>
                                        </div>
                                    </div>
                                    <button className='form-btn'>
                                        <span>Đăng Nhập</span>
                                    </button>
                                    <div className='login-link'>
                                        <span>Bạn chưa có tài khoản ?</span>
                                        &nbsp;
                                        &nbsp;
                                        <span onClick={()=>handleChangeStateForm(2)}>Đăng ký</span>
                                    </div>
                                </form>
                                
                            </div>
                            <div className='form-wrapper'>
                                <form onSubmit={handleSubmitRegisterForm}>
                                    <div className='input-item'>
                                        <span className="error-text">{emailErr}</span>
                                        <div className='input-main'>
                                            <MdAlternateEmail className='icon'/>
                                            <input value={email} type="email" placeholder='Email' onChange={e => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className='input-item'>
                                    <span className="error-text">{userNameErr}</span>
                                    <div className='input-main'>
                                        <FaRegUser className='icon'/>
                                        <input value={userName} type="text" placeholder='Tên hiển thị' onChange={e => setUserName(e.target.value)} />
                                    </div>
                                    </div>

                                        <div className='input-item'>
                                            <span className="error-text">{passwordErr}</span>
                                            <div className='input-main'>
                                                <FiLock className='icon'/>
                                                <input type="password" placeholder='Mật khẩu' onChange={e => setPassword(e.target.value)} />
                                                <FaRegEyeSlash className='icon'/>
                                            </div>
                                        </div>

                                    <div className='input-wrapper'>
                                        <div className='input-item'>
                                            <span className="error-text">{dobErr}</span>
                                            <div className='input-main'>  
                                                <input ref={dateInputRef} id='date' type="date" onChange={e => setDob(e.target.value)}/>     
                                                <div className='input-date'>
                                                    <MdOutlineDateRange className='icon' onClick={handleClick}/>
                                                    &nbsp;
                                                    &nbsp;
                                                    <span>{dob?.trim() !== "" ? dob.split('-').reverse().join('-') : 'Sinh nhật'}</span>
                                                </div>                  
                                            </div>
                                    </div>
                                        <div className='input-item'>
                                            <span className="error-text">{genderErr}</span>
                                            <div className='input-main'>
                                                <BsGenderMale className='gender-icon'/>
                                                <input onChange={e => setGender(e.target.value)} type="radio" name='gender' value="1"  defaultChecked/>
                                                <label className='gender-label' htmlFor="">Nam</label>
                                                <input onChange={e => setGender(e.target.value)} type="radio" name='gender' value="2" />
                                                <label className='gender-label' htmlFor="">Nữ</label>
                                                <input onChange={e => setGender(e.target.value)} type="radio" name='gender' value="3" />
                                                <label className='gender-label' htmlFor="">Khác</label>
                                            </div>
                                        </div>
                                    </div>
                                    <button type='submit' className='form-btn'>
                                        <span>Đăng Ký</span>
                                    </button>
                                    <div className='login-link'>
                                        <span>Bạn đã có tài khoản ?</span>
                                        &nbsp;
                                        &nbsp;
                                        <span onClick={()=>handleChangeStateForm(1)} >Đăng nhập</span>
                                    </div>
                                </form>
                                
                            </div>
                        
                        </div>
                    </div>
                ):(
                    <div className="form-container">
                    <div className="form-slice">
                    <div className='form-wrapper'>
                            <form onSubmit={handleRecoverPassword}>
                                <div className='input-item'>
                                <span className="error-text">{emailErr}</span>
                                <div className='input-main'>
                                    <MdAlternateEmail className='icon'/>
                                    <input value={email} type="text" placeholder='Nhập email của bạn để khôi phục mật khẩu ' onChange={e => {
                                        setEmail(e.target.value)
                                        setEmailErr("");
                                    }} />
                                </div>
                                </div>
                                                       
                                <button className='form-btn'>
                                    <span>Yêu cầu khôi phục</span>
                                </button>
                                <div className='login-link'>
                                    <span>Bạn chưa có tài khoản ?</span>
                                    &nbsp;
                                    &nbsp;
                                    <span onClick={()=>handleChangeStateForm(2)}>Đăng ký</span>
                                </div>
                            </form>
                            
                    </div>
                                           
                    </div>
                </div>
                )
            }
        </div>
    </div>
  )
}

export default Auth