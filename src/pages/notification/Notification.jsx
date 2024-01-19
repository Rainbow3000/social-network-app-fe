import React, { useEffect, useRef, useState } from 'react'
import './notification.scss'
import { IoSettingsOutline } from "react-icons/io5";
import Rightbar from '../../components/rightbar/Rightbar';
import { MdOutlineChatBubbleOutline } from "react-icons/md";
import { MdPerson } from "react-icons/md";
import UserChat from '../../components/userChat/UserChat';
import { IoHeart } from "react-icons/io5";
import { IoMdImages } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import {updateNotifiList,getNotificationByUser} from '../../store/slice/notificationSlice'
import {getUserInfo} from '../../store/slice/userSlice'
import moment from 'moment/dist/moment';
import 'moment/dist/locale/vi'
import {createInstanceSocket} from '../../utils/socket'
import {addNotifi} from '../../store/slice/notificationSlice'
import {Link} from 'react-router-dom'
import { PiHandshake } from "react-icons/pi";
import { IoMdEye } from "react-icons/io";
import { FaUserSecret } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
moment.locale('vi');

const Notification = () => {  
  const {notificationList} = useSelector(state => state.notification)
  const {user} = useSelector(state => state.user)
  const [typeFilter,setTypeFilter] = useState("0"); 
  const [notiFilter,setNotifilter] = useState([]); 
  const dispatch = useDispatch()


  const handleSetChecked = (value)=>{
    dispatch(updateNotifiList(value)); 
  }


  
  useEffect(()=>{
      
    let filter = [];
    if(typeFilter === "0"){
    
        filter = notificationList.filter(item => item.isReaded === true || item.isReaded === false);

        setNotifilter(filter); 
    }else if(typeFilter === "1") {
      
        filter = notificationList.filter(item => item.isReaded === false);
        setNotifilter(filter); 
    }else{
        filter = notificationList.filter(item => item.isReaded === true);
        setNotifilter(filter); 
    }
  },[typeFilter,notificationList])


  useEffect(()=>{
    dispatch(getUserInfo(user.data?._id)); 
    dispatch(getNotificationByUser(user?.data?._id)); 
  },[])

  return (
    <div className='notification-container'>
        <div className="left">
            <div className="left-container">
                <div className="top-left">
                    <span>Thông báo</span>
                    <span>
                        <select onChange={(e)=> setTypeFilter(e.target.value)} className='noti-filter'>
                            <option  selected value="0">Tất cả</option>
                            <option  value="1">Chưa đọc</option>
                            <option  value="2">Đã đọc</option>
                        </select>
                    </span>
                </div>

                <div className='notifi-list'>
                    {
                        notiFilter.length > 0  &&  notiFilter?.map(item =>{
                            if(item?.notifiType === 'ADD_FRIEND'){
                                return (
                                    <div className="notifi-item">
                                        <div className='content'>
                                            <span className='notifi-type-icon follow'>   
                                                <MdPerson/>                   
                                                {/* <MdOutlineChatBubbleOutline/>
                                                <IoHeart/>
                                            <IoMdImages/> */}
                                            </span>
                                            <div className='notifi-user'>
                                            <Link to={`/profile/${item?.fromUser?._id?._id}`} className='link'>
                                                <img src={item?.fromUser?.avatar} alt="" />
                                             </Link>
                                                <div className='user-name'>
                                                    <span><b>{item?.fromUser?._id?.userName}</b>&nbsp;<span className='content'>{item?.content}</span></span>
                                                    <span className='time'>{moment(item?.createdAt).calendar()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className='notifi-item-btn'>
                                          
        
                                           
                                        </div>
                                        {
                                            item?.isReaded === true ? (
                                                <>
                                                    <div className='state done'>
                                                
                                                    </div>
                                                    
                                                </>
                                            ):(
                                                <>
                                                <div className='state'>
                                            
                                                </div>
                                                </>
                                            )
                                        }
                                        <input checked = {item?.isReaded} onChange={()=> handleSetChecked(item?._id)} type="checkbox" style={{marginRight:10,width:18,height:18}} />
                                       
                                        </div>
                                   
                                )
                            }

                            if(item?.notifiType === 'ACCEPT_ADD_FRIEND'){
                                return (
                                    <div className="notifi-item">
                                        <div className='content'>
                                            <span className='notifi-type-icon hand-shake'>   
                                                <PiHandshake/>                   
                                                {/* <MdOutlineChatBubbleOutline/>
                                                <IoHeart/>
                                            <IoMdImages/> */}
                                            </span>
                                            <div className='notifi-user'>
                                            <Link to={`/profile/${item?.fromUser?._id?._id}`} className='link'>
                                                <img src={item?.fromUser?.avatar} alt="" />
                                            </Link>
                                                <div className='user-name'>
                                                    <span><b>{item?.fromUser?._id?.userName}</b>&nbsp;<span className='content'>{item?.content}</span></span>
                                                    <span className='time'>{moment(item?.createdAt).calendar()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {
                                            item?.isReaded === true ? (
                                                <div className='state done'>
                                            
                                                </div>
                                            ):(
                                                <div className='state'>
                                            
                                                </div>
                                            )
                                        }
                                       
                                            <input checked = {item?.isReaded} onChange={()=> handleSetChecked(item?._id)} type="checkbox" style={{marginRight:10,width:18,height:18}} />
                                        </div>
                                )
                            }

                            if(item?.notifiType === 'ADMIN'){
                                return (
                                    <div className="notifi-item">
                                        <div className='content'>
                                            <span className='notifi-type-icon hand-shake'>   
                                                <FaUserSecret/>                   
                                            </span>
                                            <div className='notifi-user'>
                                          
                                                <div className='user-name'>
                                                    <span><span className='content'><b>{item?.content.split('@')[0]}</b>&nbsp;<span>{item?.content.split('@')[1]}</span>&nbsp;<b>{item?.content.split('@')[2]}</b></span></span>
                                                    <span className='time'>{moment(item?.createdAt).calendar()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {
                                            item?.isReaded === true ? (
                                                <div className='state done'>
                                            
                                                </div>
                                            ):(
                                                <div className='state'>
                                            
                                                </div>
                                            )
                                        }
                                       
                                            <input checked = {item?.isReaded} onChange={()=> handleSetChecked(item?._id)} type="checkbox" style={{marginRight:10,width:18,height:18}} />
                                        </div>
                                )
                            }


                            if(item?.notifiType === 'LIKE_POST'){
                                return (
                                    <div className="notifi-item">
                                        <div className='content'>
                                            <span className='notifi-type-icon hand-shake'>   
                                                <GrLike/>                   
                                            </span>
                                            <div className='notifi-user'>
                                          
                                                <div className='user-name'>
                                                    <span><span className='content'><b>{item?.content.split('@')[0]}</b>&nbsp;<span>{item?.content.split('@')[1]}</span>&nbsp;<b>{item?.content.split('@')[2]}</b></span></span>
                                                    <span className='time'>{moment(item?.createdAt).calendar()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {
                                            item?.isReaded === true ? (
                                                <div className='state done'>
                                            
                                                </div>
                                            ):(
                                                <div className='state'>
                                            
                                                </div>
                                            )
                                        }
                                       
                                            <input checked = {item?.isReaded} onChange={()=> handleSetChecked(item?._id)} type="checkbox" style={{marginRight:10,width:18,height:18}} />
                                        </div>
                                )
                            }
                        })
                    }                  
                </div>

            </div>
        </div>
        
        <div className="right">
            <Rightbar/>
        </div>
    </div>
  )
}

export default Notification