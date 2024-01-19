import React, { useState } from 'react'
import User from '../user/User'
import './rightbar.scss'
import { BiSearch } from "react-icons/bi";
import { useSelector,useDispatch } from 'react-redux';
import {Link} from 'react-router-dom'
import {filterFriends} from '../../store/slice/userSlice'

const Rightbar = () => {
  const [text,setText] = useState(""); 
  const {userInfo} = useSelector(state => state.user); 
  const dispatch = useDispatch()

  return (
    <div className='right-container'>
        <div className='search-input'>
          <div className='search-icon'>
              <BiSearch/>
          </div>
          <input  type="text" placeholder='Tìm bạn bè ...' onChange={(e)=>dispatch(filterFriends(e.target.value))}/>
        </div>

        <div className='right-title'>
          <span>Bạn bè</span>
        </div>
        {
          userInfo?.friends?.length > 0 && userInfo.friends.map(item =>{
            return (
              <Link to={`/profile/${item._id._id}`} className='link'>
                <User item={item}/>
              </Link>
            )
          })
        }
    </div>
  )
}

export default Rightbar