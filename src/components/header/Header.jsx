import React from 'react'
import { PiNotePencilLight } from "react-icons/pi";
import './header.scss'
import { Link } from 'react-router-dom';
import {showCreatePost} from '../../store/slice/postSlice'
import {showLoginForm, userLogout} from '../../store/slice/userSlice'
import { CiLogout } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import {useDispatch,useSelector} from 'react-redux'
const Header = () => {
  const dispatch = useDispatch(); 

  const {user} = useSelector(state => state.user); 

  const handleClick = ()=>{
    
    dispatch(showCreatePost());
  }
  const handleShowLoginForm = (type)=>{
    dispatch(showLoginForm(type)); 
    
  }

  const handleLogoutForm = ()=>{
    dispatch(userLogout())
  }
  return (
    <div className='header-container'>
          <div className='header-input' style={{border:'none'}}>
            {/* <div className='search-icon'>
                <BiSearch/>
            </div>
            <input type="text" placeholder='Hôm nay bạn tìm gì ...'/> */}
          </div>
          <div className='header-user'>
            <span>{user.data?.userName}</span>
            <img src={user.data?.avatar} alt="" />
          </div>
    </div>
  )
}

export default Header