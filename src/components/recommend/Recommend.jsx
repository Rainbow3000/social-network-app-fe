import React from 'react'
import './recommend.scss'
import { RiFacebookBoxLine } from "react-icons/ri";
import { FaInstagram } from "react-icons/fa";
import { LuTwitter } from "react-icons/lu";
import { PiLinkedinLogoBold } from "react-icons/pi";
import { TiMessages } from "react-icons/ti";
import {Link} from 'react-router-dom' 
import { IoEyeOutline } from "react-icons/io5";

const Recommend = ({isHiddenTop,item,type}) => {

  return (
    <div className="right-recommend">
                  <div className={isHiddenTop === true ? 'top hidden':'top'}>
                    <span>Đề xuất</span>
                    <span>Xem thêm</span>
                  </div>
                  <Link className='link' to={`/profile/${item?._id?._id}`}>
                    <div className='center'>           
                        <div className='center-avatar'>
                        <img src={item?.avatar} alt="" />  
                        </div>            
                        <div className="user-wrapper">
                          <div className='user-name'>
                            <span>{item?._id?.userName}</span>
                
                            <div className='icon-list'>
                              <span><RiFacebookBoxLine/></span>
                              <span><LuTwitter/></span>
                              <span><FaInstagram/></span>
                              <span><PiLinkedinLogoBold/></span>
                            </div>

                           
                            <span style={{fontSize:14}}>{item.postNumber} Bài viết</span>
                           

                          </div>


                        </div>
                        
                    </div>
                  </Link>
                    {
                      type === 'REQUEST_ADD_FRIEND' && (
                        <div className='bottom'>
                          <button>Xóa</button>
                          <button>Đồng ý</button>
                        </div>
                      )
                    }

                    {
                      type === 'ADD_FRIEND' && (
                        <div className='bottom' >
                          <button style={{color:'#4E5D78'}}>Hủy yêu cầu</button>
                          <button style={{display:'flex',alignItems:'center',justifyContent:'center'}} ><TiMessages/>&nbsp;Nhắn tin</button>                        
                        </div>
                      )
                    }

{
                      type === 'PERSON' && (
                        <div className='bottom' >   
                          <Link className='link' to={`/profile/${item?._id?._id}`}>  
                              <IoEyeOutline className='eye-icon'/>
                          </Link>
                        </div>
                      )
                    }
              </div>
  )
}

export default Recommend