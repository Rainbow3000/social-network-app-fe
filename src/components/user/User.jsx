import React from 'react'
import './user.scss'
import { useSelector } from 'react-redux'
const User = ({item}) => {

  const {activeList} = useSelector(state => state.user); 
  return (
    <div className='user-container'>
        <div className='top'>
          <img src={item.avatar} alt="" />
          <span className='user-name'>{item._id.userName}</span>
        </div>

        <div style={{display:'flex',alignItems:'center'}}>
          <div className={activeList.find(act => act === item._id._id) !== undefined ? 'active':'un-active'}></div>
        </div>
    </div>
  )
}

export default User