import React, { useEffect, useState } from 'react'
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import './profile.scss'
import Post from '../../components/post/Post';
import { useDispatch, useSelector } from 'react-redux';
import {getUserInfo} from '../../store/slice/userSlice'
import { useLocation, useNavigate } from 'react-router-dom';
import {getPostByUser,} from '../../store/slice/postSlice'
import { BsGenderAmbiguous } from "react-icons/bs";
import { IoLocationOutline } from "react-icons/io5";
import { RiFacebookBoxLine } from "react-icons/ri";
import { FiTwitter } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { IoCloudUploadOutline } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import { IoIosRadio } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { FiRadio } from "react-icons/fi";
import { FiPhone } from "react-icons/fi";
import { PiMessengerLogoBold } from "react-icons/pi";
import {GenderEnum} from '../../enums/Enum'
import storage from '../../firebase'; 
import {ref as refStorage,uploadBytes, deleteObject , getDownloadURL} from 'firebase/storage'
import uuid from 'react-uuid';
import {Link} from 'react-router-dom'
import {userAddFriend,userCancelAddFriend,userAcceptAddFriend,setEmptyUserChat,updateBlock,resetUserSuccess,updateUserInfo} from '../../store/slice/userSlice'
import { LuPenSquare } from "react-icons/lu";
import { MdClear } from "react-icons/md";
import { LiaUserFriendsSolid } from "react-icons/lia";
import {setUserChatCurrent} from '../../store/slice/chatSlice'
import {resetPostSuccess} from '../../store/slice/postSlice'
import { ToastContainer, toast } from 'react-toastify';
import {toggleOverlay} from '../../store/slice/appSlice'

const Profile = () => {
    const dispatch = useDispatch(); 
    const navigate = useNavigate(); 
    const location = useLocation(); 
    const userId = location.pathname.split('/')[2]; 
    const ownUserId = JSON.parse(localStorage.getItem('user')).data._id;
    const {userInfo,success,userSuccessMessage} = useSelector(state => state.user); 
    const {postOfUser} = useSelector(state => state.post); 
    const handleChooseImage = (event)=>{
            dispatch(toggleOverlay(true))
            const file = event.target.files[0]; 
              const fileName =  `images/${uuid()}-${file.name}`; 
              const storageRef = refStorage(storage,fileName); 
              uploadBytes(storageRef,file).then((snapshot)=>{
                  getDownloadURL(refStorage(storage,fileName)).then(downloadUrl =>{     
                    const userData = {avatar:`${downloadUrl}@-@${fileName}`};
                    dispatch(updateUserInfo({userId,userData}));
                    dispatch(toggleOverlay(false))
                  })
            })
            
    }

    const handleChooseCoverImage = (event)=>{
        dispatch(toggleOverlay(true))
        const file = event.target.files[0]; 
          const fileName =  `images/${uuid()}-${file.name}`; 
          const storageRef = refStorage(storage,fileName); 
          uploadBytes(storageRef,file).then((snapshot)=>{
              getDownloadURL(refStorage(storage,fileName)).then(downloadUrl =>{     
                const userData = {coverAvatar:`${downloadUrl}@-@${fileName}`};
                dispatch(updateUserInfo({userId,userData}));
                dispatch(toggleOverlay(false))
              })
        })
    }

    const handleAddFriend = ()=>{
        const userData = {
            userId
        }
        const id = ownUserId; 
        dispatch(userAddFriend({userData,id}))
    }

    const handleAcceptAddFriend = ()=>{
        const userData = {
            userId:ownUserId,
        }
        dispatch(userAcceptAddFriend({userData,id:userId}))
    }


    const handleCancelAddFriend = ()=>{
        const userData = {
            userId
        }
        const id = ownUserId; 
        dispatch(userCancelAddFriend({userData,id})) 
    }

    const handleCancelAddFriendFromUserRequested = ()=>{
        const userData = {
            userId:ownUserId,
            type:2
        }
        dispatch(userCancelAddFriend({userData,id:userId})) 
    }

    const handleSetUserChat = ()=>{     
        dispatch(setEmptyUserChat()); 
        dispatch(setUserChatCurrent(userInfo))
        localStorage.setItem('user-chat',JSON.stringify(userInfo)); 
    }

    const handleBlock = ()=>{

        const userData = {
            userId:ownUserId,
        }
        dispatch(updateBlock({userData,id:userId})); 
    }

    if(success){  
        toast.success(userSuccessMessage)
        dispatch(resetUserSuccess());
    }
    

    useEffect(()=>{
        dispatch(getUserInfo(userId)); 
        dispatch(getPostByUser(userId));
    },[userId])


 
  return (
    <div className='profile-container'>
        <div className="profile-top">
            <div className='profile-info-user'>
                {
                    userInfo?.coverAvatar !== undefined && userInfo?.coverAvatar !== null && (
                        <img className='img-cover' src = {userInfo?.coverAvatar} alt="" />
                    )
                }

                {
                    (userInfo?.coverAvatar === undefined  || userInfo?.coverAvatar === null) && (
                     
                        <div className='img-cover-no-img' src = {userInfo?.coverAvatar} alt=""></div>
                    )
                }

                <div className='user-info'>
                    {
                        userId === ownUserId && (
                            <>
                            <input type="file" id='avatar-update' onChange={handleChooseImage}/>
                            <label htmlFor='avatar-update' className='upload-icon' ><IoCloudUploadOutline/></label>
                            </>
                        )
                    }
                    <img src={userInfo?.avatar} alt="" />
                    <span className='user-name'>{userInfo?._id?.userName}</span>
                    <span>{userInfo?.career}</span>
                </div>
                {
                    userId !== ownUserId && (
                        <div className='profile-btn-list'>
                                    {
                                        userInfo?.friends?.find(item => item?._id?._id === ownUserId) !== undefined && (
                                            <button className='primary-btn' ><LiaUserFriendsSolid/> &nbsp; Bạn bè</button>
                                        )
                                    }


                                    {
                                        userInfo?.requestAddFriendFromUser?.find(item => item?._id?._id === ownUserId) === undefined &&  userInfo?.requestAddFriend?.find(item => item._id._id === ownUserId) === undefined &&
                                        
                                        userInfo?.friends?.find(item => item?._id?._id === userId) === undefined && userInfo?.friends?.find(item => item?._id?._id === ownUserId) === undefined && (
                                            <button className='primary-btn' onClick={handleAddFriend}><FaPlus/> &nbsp; Kết bạn</button>
                                        )                                    
                                    }
                                 
                           
                                    {
                                        userInfo?.requestAddFriendFromUser?.find(item => item?._id?._id === ownUserId) !== undefined && (
                                            <button onClick={handleCancelAddFriend}><MdClear/> &nbsp; Hủy lời mời kết bạn</button>
                                        )
                                    }
                         
                                      {
                                        userInfo?.requestAddFriend?.find(item => item?._id?._id === ownUserId) !== undefined && (
                                        <>
                                            <span>Đã gửi cho bạn lời mời kết bạn &nbsp;&nbsp;&nbsp;</span>
                                            <button className='primary-btn' onClick={handleAcceptAddFriend}><FaPlus/> &nbsp; Chấp nhận yêu cầu</ button>
                                            <button onClick={handleCancelAddFriendFromUserRequested}><MdClear/> &nbsp; Bỏ qua</button>
                                            <div className='hr'></div>
                                        </>
                                        )
                                      }
                                         

                                {
                                    userInfo?.friends.find(item => item?._id?._id === ownUserId) !== undefined && (
                                        <button onClick={handleSetUserChat}>
                                            <Link to="/chat" className='link'>
                                                <PiMessengerLogoBold/> &nbsp;Nhắn tin
                                            </Link>
                                        </button>
                                    )
                                }
                          
                            <span className='profile-options-icon'><HiDotsHorizontal/>
                                <ul className='profile-options'>
                                    <li onClick={handleCancelAddFriend}>Hủy kết bạn</li>
                                    <li>Tố cáo</li>
                                    <li onClick={handleBlock}>Chặn</li>
                                </ul>
                            </span>
                        </div>
                    )
                }

                {
                    userId === JSON.parse(localStorage.getItem('user'))?.data?._id && (
                        <div className='profile-btn-list'>
                            <Link to="/setting" className='link'>   
                                <button><LuPenSquare/> &nbsp; Cập nhật thông tin</button>
                            </Link>
                        </div>

                    )
                }


                {
                    userId === ownUserId && (
                        <>
                            <input type="file" id='cover-avatar-update' onChange={handleChooseCoverImage} />
                            <label htmlFor='cover-avatar-update' className='edit-cover-photo'>
                                <IoCloudUploadOutline/>
                                &nbsp;
                                <span>Cập nhật ảnh bìa</span>
                            </label>
                        </>
                    )
                }

            </div>

        </div>
        <div className="profile-center">

            <div className='profile-intro'>             
                <ul>
                    <li>Giới thiệu</li>
                    <li><div style={{width:'max-content',display:'flex',justifyContent:'cen',alignItems:'center'}}><BsGenderAmbiguous /></div> &nbsp;&nbsp;{GenderEnum[userInfo?.gender]}</li>
                    <li><div style={{width:'max-content',display:'flex',justifyContent:'cen',alignItems:'center'}}><LiaBirthdayCakeSolid /></div>&nbsp;&nbsp;{userInfo?.dob.split('-').reverse().join('-')}</li>
                    <li><div style={{width:'max-content',display:'flex',justifyContent:'cen',alignItems:'center'}}><FiPhone /></div>&nbsp;&nbsp;{userInfo?.phoneNumber !== null && userInfo?.phoneNumber !== undefined ? <span>{userInfo?.phoneNumber}</span> :'Chưa cập nhật'}</li>
                    <li><div style={{width:'max-content',display:'flex',justifyContent:'cen',alignItems:'center'}}><IoLocationOutline /></div>&nbsp;&nbsp;{userInfo?.address !== null && userInfo?.address !== undefined ? <span>{userInfo?.address}</span> :'Chưa cập nhật'}</li>
                    <li><div style={{width:'max-content',display:'flex',justifyContent:'cen',alignItems:'center'}}><RiFacebookBoxLine /></div>&nbsp;&nbsp;{userInfo?.facebookLink !== null && userInfo?.facebookLink !== undefined ? <span>{userInfo?.facebookLink}</span> :'Chưa cập nhật'}</li>
                    <li><div style={{width:'max-content',display:'flex',justifyContent:'cen',alignItems:'center'}}><FiTwitter /></div>&nbsp;&nbsp;{userInfo?.twitterLink !== null && userInfo?.twitterLink !== undefined ? <span>{userInfo?.twitterLink}</span> :'Chưa cập nhật'}</li>
                    <li><div style={{width:'max-content',display:'flex',justifyContent:'cen',alignItems:'center'}}><FaInstagram /></div>&nbsp;&nbsp;{userInfo?.instagramLink !== null && userInfo?.instagramLink !== undefined  ? <span>{userInfo?.instagramLink}</span> :'Chưa cập nhật'}</li>                 
                </ul>
            </div>

            <div className='profile-post'>
                {
                    postOfUser?.length === 0 && (
                        <span className='post-empty-title'>Chưa có bài viết được tạo !</span>
                    )
                }
                <div className='post-list'>
                {
                    postOfUser?.length > 0 && (
                             <div className="profile-center-bottom">
                                {
                                    postOfUser.map(item=>{
                                        return (
                                            <Post userIdProfile = {userId} item= {item}/>
                                        )
                                    })
                                }
                            
                            </div> 
                            
                            )
                        }
                </div>

               
            </div>

        </div>

    </div>
  )
}

export default Profile