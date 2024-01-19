import React, { useEffect, useState,useRef } from 'react'
import Post from '../../components/post/Post'
import RightBar from '../../components/rightbar/Rightbar'
import './home.scss'
import { useDispatch, useSelector } from 'react-redux'
import {getPostList,resetPostSuccess} from '../../store/slice/postSlice'
import { RiSendPlane2Line } from "react-icons/ri";
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { useNavigate } from 'react-router-dom'
import PostAction from '../../components/postAction/PostAction'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getUserInfo,resetUserSuccess} from '../../store/slice/userSlice'
import {createInstanceSocket} from '../../utils/socket'
import {setUserActive} from '../../store/slice/userSlice'

const Home = () => {

  const {postList} = useSelector(state => state.post); 
  const {user,userDob} = useSelector(state => state.user); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const notify = () => toast.info("...");
  
  const socket = useRef(); 

  useEffect(()=>{
    socket.current = createInstanceSocket();
    if(socket.current){
      socket.current.on('connect', () => {
         socket.current.emit('user-connected',user?.data?._id); 
      });

      socket.current.on('user-online',(data)=>{
            dispatch(setUserActive(data));         
      })
    }


    dispatch(getPostList());
    dispatch(getUserInfo(user?.data?._id))
  },[user])


  if(user === null){
    navigate('/auth')
    return;
  }
  return (
    <div className='home-container'>
        <ToastContainer />
        <div className="home-main">
            <div className="left">
             <PostAction/>
              <div className='post-list'>
                  {
                    postList && postList.map((item,index)=>{                   
                         return (
                           <Post key={item._id} item = {item}/>
                         )                                              
                    })
                  }
              </div>

            </div>
            <div className="right">
                    
          
                <div className="right-recommend">
                    <div className='top'>
                      <span>Sinh nhật</span>
                      {/* <span onClick={notify}>Xem thêm</span> */}
                    </div>
                    {
                      userDob.length > 0 && userDob.map(item =>{
                        return (
                          <>
                          <div className='center'>           
                            <img className='dob-user-img' src={item.avatar} alt="" />            
                            <div className="user-wrapper">
                              <div className='user-name'>
                                <span>{item.userName}</span>
                                <span style={{fontSize:13}}>Sinh nhật ngày hôm nay</span>                      
                              </div>

                            </div>
                            
                          </div>
                           
                          </>
                        )
                      })
                    }
                  

                    <div className='dob-upcomming' >
                      <div className='dob-icon'>
                          <LiaBirthdayCakeSolid/>
                      </div>
                      <div className='dob-info'>
                        <span style={{fontSize:15}}>Sinh nhật của bạn bè</span>
                        {
                          userDob.length > 0 ? (
                            <span style={{fontSize:14}}>{userDob.length} người bạn đón sinh nhật hôm nay</span>
                          ):(
                            <span style={{fontSize:14}}>Hôm nay không có bạn bè sinh nhật</span>
                          )
                        }
                      </div>
                    </div>
                </div>
            
            </div>
        </div>
     
        <div className="right-bar">   
            <RightBar/>
        </div>
    </div>
  )
}

export default Home