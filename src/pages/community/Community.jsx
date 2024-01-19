import React, { useEffect, useState } from 'react'
import './community.scss'
import Rightbar from '../../components/rightbar/Rightbar'
import Recommend from '../../components/recommend/Recommend'
import { FaUserFriends } from "react-icons/fa";
import { IoMdPersonAdd } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { RiGlobalLine } from "react-icons/ri";
import {getUserInfo,getUserList} from '../../store/slice/userSlice'
const Community = () => {

  let {userInfo,user,userList} = useSelector(state => state.user); 

  userList = userList.filter(item => item?._id._id !== user.data._id && userInfo?.friends?.find(element => element?._id._id === item?._id._id) === undefined); 
  const dispatch = useDispatch(); 
  const [indexRender,setIndexRender] = useState(3)
  useEffect(()=>{
     dispatch(getUserInfo(user?.data?._id))
     dispatch(getUserList()); 
  },[])

  const handleClick = (number)=>{
    setIndexRender(number); 
  }

  return (
    <div className='community-container'>
        <div className='community-wrapper'>
            <div className="community-top">
                <div onClick={()=>handleClick(3)} className={indexRender === 3 ? 'top-btn active':'top-btn'}><span  style={{display:'flex',alignItems:'center'}}><RiGlobalLine/>&nbsp;{userList?.length} Người dùng</span></div>
                <div onClick={()=>handleClick(1)} className={indexRender === 1 ? 'top-btn active':'top-btn'}><span  style={{display:'flex',alignItems:'center'}}><IoMdPersonAdd/>&nbsp;&nbsp;{userInfo?.requestAddFriendFromUser.length} Lời mời kết bạn</span></div>
                <div onClick={()=>handleClick(2)} className={indexRender === 2 ? 'top-btn active':'top-btn'}><span  style={{display:'flex',alignItems:'center'}}><IoMdPersonAdd/>&nbsp;&nbsp;{userInfo?.requestAddFriend.length} Lời kết bạn đã gửi</span></div>
            </div>


            {
                indexRender === 1 && (
                    <div className="community-center">  
                    {
                        userInfo?.requestAddFriendFromUser.length > 0 && userInfo.requestAddFriendFromUser.map(item =>{
                            return (
                                <Recommend type='REQUEST_ADD_FRIEND' item = {item} isHiddenTop={true}/>
                            )
                        })
                    }

                    
                    </div>
                )
            }

{
                indexRender === 2 && (
                    <div className="community-center">  
                    {
                        userInfo?.requestAddFriend.length > 0 && userInfo.requestAddFriend.map(item =>{
                            return (
                                <Recommend type='ADD_FRIEND' item = {item} isHiddenTop={true}/>
                            )
                        })
                    }

                    
                    </div>
                )
            }


{
                indexRender === 3 && (
                    <div className="community-center">  
                    {
                        userList?.length > 0 && userList.map(item =>{
                            return (
                                <Recommend type='PERSON' item = {item} isHiddenTop={true}/>
                            )
                        })
                    }

                    
                    </div>
                )
            }





        </div>
        <div className='rightbar'>
            <Rightbar/>
        </div>
    </div>
  )
}

export default Community