
import './App.scss';
import Home from './pages/home/Home';
import { useState } from 'react';
import Header from './components/header/Header';
import Sidebar from './components/sidebar/Sidebar';
import Profile from './pages/profile/Profile';
import Chat from './pages/chat/Chat'
import { Routes, Route, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import Community from './pages/community/Community';
import Auth from './pages/auth/Auth';
import Setting from './pages/setting/Setting';
import Notification from './pages/notification/Notification';
import {createInstanceSocket} from '../src/utils/socket'
import { useEffect,useRef } from 'react';
import {getNotificationByUser} from './store/slice/notificationSlice'
import {setUserActive,getUserDob} from './store/slice/userSlice'
import {addNotifi} from '../src/store/slice/notificationSlice'
import {addChatCreated,setConfirm,setCancel,setCallFriend} from '../src/store/slice/chatSlice'
import HashLoader from 'react-spinners/HashLoader'
import VideoCall from './components/videoCall/VideoCall';


function App() {

  const dispatch = useDispatch(); 
  const {user,activeList} = useSelector(state => state.user); 
  const {isShowOverlay} = useSelector(state => state.app); 
  const {callFromFriend} = useSelector(state => state.chat); 
  const [showCall,setShowCall] = useState([false]); 
  const socket = useRef(); 
  const navigate = useNavigate(); 

  const handleCancel = ()=>{
    dispatch(setCancel(true))
    dispatch(setConfirm(false))
    dispatch(setCallFriend(null))
  }

  const handleSuccess = ()=>{
    dispatch(setConfirm(true))
    dispatch(setCancel(false))
    dispatch(setCallFriend(null))
  }

  useEffect(()=>{


    if(user === null){
      navigate('/auth')
      return;
    }

    if(activeList.find(item => item !== user.data._id) === undefined){
        const newActiveList = [...activeList,user.data._id]; 
        dispatch(setUserActive(newActiveList)); 
    }

    socket.current = createInstanceSocket();
    if(socket.current){
      socket.current.on('connect', () => {
         socket.current.emit('user-connected',user?.data?._id); 
      });


      socket.current.on('user-online',(data)=>{
            dispatch(setUserActive(data));         
      })

      socket.current.on('notifi-add-friend-single-user',(notifi)=>{
        dispatch(addNotifi(notifi));
     })
     socket.current.on('notifi-accept-add-friend-single-user',(notifi)=>{
         dispatch(addNotifi(notifi));
      })
     
      socket.current.on('receive-message-single-user',(msg)=>{
        dispatch(addChatCreated(msg));
     })   
     
     socket.current.on('admin-notifi',(notifi)=>{
      dispatch(addNotifi(notifi));
   })   


    socket.current.on('admin-confirm-offence',(notifi)=>{
      dispatch(addNotifi(notifi));
    })   

    socket.current.on('admin-delete-post',(notifi)=>{
      dispatch(addNotifi(notifi));
    }) 

  
    socket.current.on('user-like-post',(notifi)=>{
      dispatch(addNotifi(notifi));
    })  
    }


    
    dispatch(getUserDob(user?.data?._id))
    dispatch(getNotificationByUser(user?.data?._id)); 

  },[user])



  return (
    <div id="app">
      <VideoCall/>
      
      {
        isShowOverlay === true && (
          <div className='overlay'>       
            <HashLoader color="#36d7b7" />
          </div>
        )
      }
      {callFromFriend !== null && callFromFriend?._id !== user.data._id &&  (
        <div className='overlay-call'>       
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',backgroundColor:'#FFFFFF',padding:30,width:'auto'}}>
            <img width={120} height={120} style={{borderRadius:'50%'}} src={callFromFriend.avatar} alt=''/>
            <span>Cuộc gọi đến từ <b>{callFromFriend?.userName}</b></span>
            <div>
              <button onClick={handleCancel} className='btn btn-danger'>Hủy</button>
              <button onClick={handleSuccess} className='btn btn-success'>Đồng ý</button>
            </div>
          </div>
       </div>
      

      )}
    

            {
              user !== null &&  (
                <div className="app-left">
                  <Sidebar/>
                </div>
              )
            }
            <div className="app-center">
              {
                user !== null && (
                  <Header/>           
                )
              }
                  <Routes>
                    <Route path=''  element={<Home/>} />
                    <Route path='/profile/:id'  element={<Profile/>} />
                    <Route path='/chat'  element={<Chat/>} />
                    <Route path='/community'  element={<Community/>} />
                    <Route path='/setting'  element={<Setting/>} />               
                    <Route path='/notification'  element={<Notification/>} />  
                    <Route path='/auth'  element={<Auth/>} />             
                 </Routes>
            </div>
    </div>
  );
}

export default App;
