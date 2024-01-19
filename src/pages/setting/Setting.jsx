import React, { useState } from 'react'
import './setting.scss'
import { IoPersonOutline } from "react-icons/io5";
import { MdBlock } from "react-icons/md";
import { GoBell } from "react-icons/go";
import { FiLock } from "react-icons/fi";
import { MdOutlineHistory } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import EditProfile from '../../components/editProfile/EditProfile';
import BlockList from '../../components/blockList/BlockList';
import Account from '../../components/account/Account'
const Setting = () => {

  const [tabRender,setTabRender] = useState(1); 
  const handleSetTabRender = (value)=>{
      setTabRender(value); 
  }

  return (
    <div className='setting-container'>
        <div className='setting-list'>
            <ul>
                <li onClick={()=>handleSetTabRender(1)} className={ tabRender === 1? 'active':''}><IoPersonOutline/>&nbsp;&nbsp;&nbsp;Cập nhật hồ sơ {tabRender === 1 && <MdArrowForwardIos className='arrow-icon'/>} </li>
                <li onClick={()=>handleSetTabRender(2)} className={ tabRender === 2? 'active':''}><MdBlock/>&nbsp;&nbsp;&nbsp;Đã chặn {tabRender === 2 && <MdArrowForwardIos className='arrow-icon'/>}</li>
                <li onClick={()=>handleSetTabRender(3)} className={ tabRender === 3? 'active':''}><FiLock/>&nbsp;&nbsp;&nbsp;Đổi mật khẩu {tabRender === 3 && <MdArrowForwardIos className='arrow-icon'/>}</li>
                {/* <li onClick={handleSetTabRender(4)}><MdOutlineHistory/>&nbsp;&nbsp;&nbsp;Lịch sử hoạt động</li> */}
            </ul>
        </div>

        <div className='setting-content'>
          {
            tabRender === 1 && (
              <EditProfile/>
            )
            
          }

          {
            tabRender === 2 && (
              <BlockList/> 
            )
            
          }

          {
            tabRender === 3 && (
              <Account/>
            )
            
          }

        </div>
    </div>
  )
}

export default Setting