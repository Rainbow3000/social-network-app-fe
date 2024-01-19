import React, { useState } from 'react'
import './popup.scss'
import Login from '../login/Login'
import Register from '../register/Register'
import ProfileAction from '../profileAction/ProfileAction'
import { IoCloseSharp } from "react-icons/io5";
import {hiddenLoginForm} from '../../store/slice/userSlice'
import { useDispatch,useSelector } from 'react-redux';
import {setTypePopupForm} from '../../store/slice/userSlice'

const Popup = () => {
    const {typePopupForm}  = useSelector(state => state.user); 
    const handleChangePopupType = (type)=>{
       dispacth(setTypePopupForm(type));
    }
    const dispacth = useDispatch(); 
    const {user} = useSelector(state => state.user); 

    const handleClosePopupForm = ()=>{
        dispacth(hiddenLoginForm());
    }
  return (
    <div className='popup-container'>
        
        <IoCloseSharp onClick={handleClosePopupForm} className='popup-close-icon'/>
            {
                (user === null || user === undefined) && (
        <div className='popup-container-top'>
                    <>
                    <span className={ typePopupForm === 1 && 'popup-active'} onClick={()=>handleChangePopupType(1)}>Đăng Nhập</span>
                    <span className={ typePopupForm === 2 && 'popup-active'} onClick={()=>handleChangePopupType(2)}>Đăng Ký</span>
                    </>
        </div>
                )
            }
        {
            typePopupForm === 1 && (
                <Login/>
            )
        }

        {
            typePopupForm === 2 && (user === null || user === undefined) && (
                <Register/>
            )
        }

        {
            (user !== null && user !== undefined) && (
                <ProfileAction/>
            )
        }
    </div>
  )
}

export default Popup