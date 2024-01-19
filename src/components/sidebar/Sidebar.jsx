import React, { useEffect, useState,useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.scss'
import { useDispatch, useSelector } from 'react-redux';
import { BiCategory } from "react-icons/bi";
import { BiBell } from "react-icons/bi";
import { BiMessage } from "react-icons/bi";
import { FaWpexplorer } from "react-icons/fa";
import { RxPerson } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { TbUsersGroup } from "react-icons/tb";
import { MdOutlineLogout } from "react-icons/md";
import {userLogout} from '../../store/slice/userSlice'
import { notifiReset } from '../../store/slice/notificationSlice';
import {updateUserInfo,removeFromActiveList} from '../../store/slice/userSlice'
import {chatReset} from '../../store/slice/chatSlice'
const Sidebar = () => {
  const {user,userInfo} = useSelector(state => state.user); 
  const {unReadNumber} = useSelector(state => state.notification); 
  const [pageRender,setPageRender] = useState(1); 
  const navigate = useNavigate();
  const dispatch = useDispatch(); 

  const handleLogout = ()=>{
    const userId = user.data._id
    const userData = {timeDisconnect:1}
    dispatch(userLogout());
    dispatch(notifiReset())
    dispatch(chatReset()); 
    dispatch(updateUserInfo({userId,userData}));
    dispatch(removeFromActiveList(userId)); 
  }
  
  if(user === null){
    navigate('/auth')
  }


  const handleChangePage = (value)=>{
    setPageRender(value); 
  }


  return (
    <div className='sidebar'>
        <div id='logo'>
        <Link className='link' to="/"><h1>K2 Meet</h1></Link>
        </div>
        <ul className='sidebar-action-list'>
            <li className={pageRender === 1 ?'active':''} onClick={()=>handleChangePage(1)}>
              <Link className='link' to='/'>
                <BiCategory/>
                 <span>&nbsp;&nbsp; Bảng tin</span>
              </Link>
            </li>
            <li className={pageRender === 2 ?'active':''} onClick={()=>handleChangePage(2)}>
              <Link className='link notifi' to="/chat">
                <BiMessage/>
                 <span>&nbsp;&nbsp; Tin nhắn</span>
                
                  
              </Link>
            </li>

            <li className={pageRender === 3 ?'active':''} onClick={()=>handleChangePage(3)}>
              <Link className='link' to="/community">
                <TbUsersGroup/>
                 <span>&nbsp;&nbsp; Mọi người</span>
              </Link>
            </li>

            <li className={pageRender === 4 ?'active':''} onClick={()=>handleChangePage(4)}>
              <Link className='link notifi' to="/notification">
                <BiBell/>
                 <span>&nbsp;&nbsp; Thông báo</span>
                 {unReadNumber > 0 && (
                    <div className='notifi-number'>{unReadNumber}</div>
                 )}
              </Link>
            </li>
          

            <li className={pageRender === 5 ?'active':''} onClick={()=>handleChangePage(5)}>
              <Link className='link' to={`/profile/${user?.data?._id}`}>
                <RxPerson/>
                 <span>&nbsp;&nbsp; Hồ sơ</span>
              </Link>
            </li>

            <li className={pageRender === 6 ?'active':''} onClick={()=>handleChangePage(6)}>
              <Link className='link' to="/setting">
                <IoSettingsOutline/>
                 <span>&nbsp;&nbsp; Cài đặt</span>
              </Link>
            </li>
            
              {
                user !== null && (
                <li className={pageRender === 7 ?'active':''} onClick={()=>handleChangePage(7)}>
                    <Link className='link' to="/auth" onClick={handleLogout}>
                      <MdOutlineLogout/>
                      <span>&nbsp;&nbsp; Thoát</span>
                    </Link>
                </li>
                )
              }
           
        </ul>
    </div>
  )
}

export default Sidebar