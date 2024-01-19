import React, { useEffect } from 'react'
import './blockList.scss'
import { useDispatch, useSelector } from 'react-redux'
import {getBlockingUser,updateBlock} from '../../store/slice/userSlice'
const BlockList = () => {
    const dispatch = useDispatch(); 
    const {user,blockingUser} = useSelector(state => state.user); 


    const handleUnBlock = (id)=>{
        const userData = {
            userId: user.data._id
        }
        dispatch(updateBlock({userData,id})); 
    }

    useEffect(()=>{
        dispatch(getBlockingUser(user.data._id)); 
    },[])

  return (
    <div style={{padding:20}}>
        

<table>
  {
    blockingUser?.length > 0 ? ( blockingUser?.map(item =>{
        return (
        <tr className='block-item'>
            <td style={{display:'flex',alignItems:'center'}}><img width={90} height={90} style={{borderRadius:'50%'}} src={item.avatar} alt="" />&nbsp;&nbsp;{item._id.userName}</td>
            <td style={{display:'flex',justifyContent:'flex-end',alignItems:'center',height:'100%'}}>
                <button onClick={()=>handleUnBlock(item._id._id)}>Bỏ chặn</button>
            </td>
        </tr>
        )       
    }) ) : (
        <div className='text-wrapper'>
            <span className='text-info'>Chưa có người dùng đã chặn</span>
        </div>
    )
  }
 
</table>
    </div>
  )
}

export default BlockList