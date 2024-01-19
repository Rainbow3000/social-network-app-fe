import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { GrLike } from "react-icons/gr";
import { FaRegCommentDots, FaSlack } from "react-icons/fa";
import { CiShare2 } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { IoLogoYen, IoTimeOutline } from "react-icons/io5";
import {updatePostByOtherUser} from '../../store/slice/postSlice'
import {useDispatch, useSelector} from 'react-redux'
import { IoClose } from "react-icons/io5";
import Comment from '../comment/Comment';
import './post.scss'
import uuid from 'react-uuid';
import storage from '../../firebase'; 
import {ref as refStorage,uploadBytes, getDownloadURL} from 'firebase/storage'
import {createComment} from '../../store/slice/postSlice'
import { CiImageOn } from "react-icons/ci";
import { VscSmiley } from "react-icons/vsc";
import {Link} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {getCommentByPost,getPostByUser,updateStatusPost,deletePost,createDenounce,setValueSuccess,resetPostSuccess,updatePost} from '../../store/slice/postSlice'
import { RiSendPlane2Line } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import moment from 'moment/dist/moment';
import 'moment/dist/locale/vi'
moment.locale('vi');



const Post = ({item,userIdProfile}) => {
  const [likeNumber,setLikeNumber] = useState(item?.like?.number);
  const [shareNumber,setShareNumber] = useState(item?.share?.number);
  const [content,setContent] = useState(""); 
  const [image,setImage] = useState(""); 
  const [video,setVideo] = useState(""); 
  const [parent,setParent] = useState(null); 
  const [isShowActionActive,setIsShowActionActive] = useState(false); 
  const [emojiShow, setEmojiShow] = useState(false);
  const [parentName,setParentName] = useState('')
  const [level,setLevel] = useState(0); 
  const dispatch = useDispatch(); 
  const {user}= useSelector(state => state.user); 
  const {postSuccessMessage,isSuccess}= useSelector(state => state.post); 
  const inputRef = useRef(); 
  const videoRef = useRef();
  const [userShare,setUserShare] = useState(null); 
  const [postId,setPostId] = useState(""); 
  const [denounceContent,setDenounceContent] = useState([]);  
  const [myContent,setMyContent] = useState(""); 
  const denounceFirst =  useRef(); 
  const denounceSecond =  useRef(); 
  const denounceThree = useRef(); 
  
  const handleLikePost = (postId,type)=>{
    const userId = user.data._id 
    if(type === 'SHARE'){
        dispatch(updatePostByOtherUser({postId,userId,type:1,isShare:true})); 
        return; 
    }

    dispatch(updatePostByOtherUser({postId,userId,type:1,isShare:false}));

  }

  const handleSharePost = (postId)=>{
    setShareNumber(item?.share?.number + 1); 
    const userId = user.data._id 
    dispatch(updatePostByOtherUser({postId,userId,type:2})); 
    toast.success('Chia sẻ bài viết thành công')
  }


  const onEmojiClick = (object) => {
    let text = content + object.emoji;
    setContent(text);
  };


  const handleChooseImage = (event)=>{
        const file = event.target.files[0]; 
        const fileNameExtension = file.name?.split('.')[1]; 
        if(fileNameExtension === "mp4"){
          const fileName =  `videos/${uuid()}-${file.name}`; 
          const storageRef = refStorage(storage,fileName); 
          uploadBytes(storageRef,file).then((snapshot)=>{
              getDownloadURL(refStorage(storage,fileName)).then(downloadUrl =>{
                  setVideo(downloadUrl)             
              })
          })
        }else{
          const fileName =  `images/${uuid()}-${file.name}`; 
          const storageRef = refStorage(storage,fileName); 
          uploadBytes(storageRef,file).then((snapshot)=>{
              getDownloadURL(refStorage(storage,fileName)).then(downloadUrl =>{
                setImage(`${downloadUrl}@-@${fileName}`)       
              })
          })
        }
    }


  

const handleSubmitForm = (e)=>{
    e.preventDefault(); 
    const comment = {
        content : content.includes('@') === true ? content.split(' ').slice(1).join(' ') : content,
        parent,
        video,
        image,
        user: JSON.parse(localStorage.getItem('user'))?.data?._id,
        post: item._id,
        level,
        parentName
    }
    dispatch(createComment(comment)); 
    setContent("");
    setVideo("");
    setImage("");
    setParent(null); 
    setEmojiShow(false)
}

const handleDenouncePost = (id)=>{
    setPostId(id); 
    setIsShowActionActive(false); 
}

const handleSetReplyComment = (userName,parent,level,parentPrev)=>{
  
    if(level === 3){
        setContent(`@${userName}`);
        setParent(parentPrev); 
        setLevel(level);
        setParentName(userName);
        inputRef.current.focus();
        return; 
    }
    setContent(`@${userName.replace(/\s/g, "")} `);
    setParent(parent); 
    setLevel(level);
    setParentName(userName);
    inputRef.current.focus();
}

const handleGetCommentByPost = (postId)=>{
    dispatch(getCommentByPost(postId))
}




const handleDeleteSharePost = (postId)=>{
    dispatch(updatePost({postId,userId:user.data?._id}))
    setIsShowActionActive(false); 
}


const handleSetDebounceContent = (value,position)=>{
    
    if(position === 1 && value === true){
       setDenounceContent( oldState => [...oldState,denounceFirst.current.value]); 
    }else if(position === 1 && value === false){
        const filter = denounceContent.filter(item => parseInt(item.split('.')[0]) !== position); 
        setDenounceContent(filter); 
    }

    if(position === 2 && value === true){
        setDenounceContent( oldState => [...oldState,denounceSecond.current.value]); 
    }else if(position === 2 && value === false){    
        const filter = denounceContent.filter(item => parseInt(item.split('.')[0]) !== position); 
        setDenounceContent(filter)
    }

    if(position === 3 && value === true){
        setDenounceContent( oldState => [...oldState,denounceThree.current.value]); 
    }else if(position === 3 && value === false){
        const filter = denounceContent.filter(item => parseInt(item.split('.')[0]) !== position); 
        setDenounceContent(filter)
    }

}

const handleHiddenPost = (postId)=>{
    dispatch(updateStatusPost({postId,status:0})); 
    setIsShowActionActive(false); 
}

const handleDeletePost = (postId)=>{
    dispatch(deletePost(postId)); 
    setIsShowActionActive(false); 
}

const handleSendDebounce = ()=>{

    const data = {
        user:user.data._id, 
        denounceContent:[...denounceContent,myContent.trim() !== "" && `${denounceContent.length + 1}.${myContent}`] ,
        postId:item._id
    }
    dispatch(createDenounce(data)); 
    setDenounceContent([]); 
    setMyContent(""); 
    setPostId(""); 
}


if(isSuccess){
    toast.success(postSuccessMessage)
    dispatch(resetPostSuccess()); 
}


useEffect(()=>{
    if(item.type !== undefined && item.type === 'SHARE'){
        const shareFilter = item?.share?.userShared?.filter(item => item.user?._id._id === user.data?._id)
        const share = shareFilter?.length > 0 && shareFilter[shareFilter.length - 1]
        setUserShare(share); 
    }
},[item])





  return (
    <div className='post-container'>
        <ToastContainer/>
        {postId === item.user._id._id && (
        <div className='denounce-list'>
            <IoClose className='io-close' onClick={()=>setPostId("")}/>
            <span>Tố cáo bài viết</span>
            <ul>
                <li>
                    <input ref={denounceFirst} style={{display:'none'}} type="text" value="1.Bài viết có chứa hình ảnh bạo lực hoặc nội dung bị cấm"/>
                    <input onChange={(e) => handleSetDebounceContent(e.target.checked,1)} type="checkbox" />
                    <label htmlFor="">Bài viết có chứa hình ảnh bạo lực hoặc nội dung bị cấm</label>
                </li>
                <li>
                    <input ref={denounceSecond} style={{display:'none'}} type="text" value="2.Bài viết có liên quan đến tệ nạn xã hội"/>
                    <input onChange={(e) => handleSetDebounceContent(e.target.checked,2)}  type="checkbox" />
                    <label htmlFor="">Bài viết có liên quan đến tệ nạn xã hội</label>
                </li>
                <li>
                    <input ref={denounceThree} style={{display:'none'}} type="text" value="3.Bài viết gây chia rẽ, xuyên tạc hoặc phản động" />
                    <input onChange={(e) => handleSetDebounceContent(e.target.checked,3)} type="checkbox"  />
                    <label htmlFor="">Bài viết gây chia rẽ, xuyên tạc hoặc phản động</label>
                </li>
               
                <li>
                    <textarea onChange={(e) =>setMyContent(e.target.value)} placeholder='Thêm nội dung của bạn'></textarea>
                </li>
            </ul>
            <button onClick={handleSendDebounce} >Gửi</button>
        </div>

        )}

        {
            item?.type === 'SHARE'  ? (
            <>
               
            <div className="post-top">
                
                <img src={user.data?.avatar} alt="" />
                
             <ul>
                <li>{userShare?.user?._id.userName} <span style={{fontWeight:'normal'}}>đã chia sẻ một bài viết</span></li>
                <li style={{display:'flex',alignItems:'center'}}><IoTimeOutline/> &nbsp;{moment(userShare?.timeShare).calendar()}</li>
             </ul>
             <ul>
                
             </ul>
              
             {
                item?.share?.userShared?.find(item => item?.user?._id?._id === user?.data._id) !== undefined  && (
                     <HiOutlineDotsHorizontal className='post-action' onClick={()=>setIsShowActionActive(active => !active)}/>
                     )
                    }
          

            <div className={ isShowActionActive === true ? 'post-action-item-wrapper active':'post-action-item-wrapper'}>            
                  
                    <span onClick={()=>handleDeleteSharePost(item._id)}>Xóa chia sẻ</span>                          
            </div>
            </div>
       
        <div className="post-center">
            {
                item?.images.length === 1 && (
                <div className='post-img-single'>
                    <img src={item?.images[0]} alt="" />
                </div>
                )
            }

            {
                item?.images.length > 1 && (
                    <div className='post-img-list'>
                        {
                            item.images?.map(item =>{
                                return (
                                    <img src={item} alt="" />
                                )
                            })
                        }
        
                    </div>
                )
            }

            {
                    item?.images?.length === 0  && item.video.trim() !== "" && (
                        <div className='post-video'>
                            <video width="100%" height="100%" controls ref={videoRef} poster={item.thumb} >
                                <source src={item.video} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )
                

                
            }

            {
                 (item?.thumb === undefined || item?.thumb === null || item.thumb === "") && (
                    item?.images?.length === 0  && item?.video?.trim() !== "" &&(
                        <div className='post-video'>
                            <video width="100%" height="100%" controls ref={videoRef} >
                                <source src={item.video} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )
                )
            }

                    <div className="post-top">
                        <Link to={`/profile/${item.user._id._id}`}>
                            <img src={item?.user?.avatar} alt="" />
                        </Link>
                        <ul>
                            <li>{item?.user?._id?.userName}</li>
                            <li>{moment(item?.createdDate).calendar()}</li>
                        </ul>
                        <ul>
                            
                        </ul>
                        
                      
                      
                    </div>

                    <div className='post-content'>
                        {item?.content}
                    </div>




            <ul className='post-center-action'>
            <li style={{display:'flex',alignItems:'center'}} className={item?.like?.userLiked?.find(item => item?._id?._id === user?.data._id) !== undefined && 'liked'} ><GrLike onClick={()=>handleLikePost(item?._id)}/>&nbsp;{item.like?.userLiked?.find(item => item?._id?._id === user?.data._id) !== undefined ? 'Đã thích':'Thích'}&nbsp;(&nbsp;<span className='like-number-view' style={{position:'relative'}}> { item?.like?.number }
                           {
                            item?.like?.userLiked?.length > 0 && (
                                <ul className='show-user-list' style={{position:'absolute',display:'none',flexDirection:'column',alignItems:'center',
                                backgroundColor:'#F0F2F5',padding:20,borderRadius:5,bottom:20,width:'max-content',left:0}}>
                                        {
                                           item?.like?.userLiked.map(item =>{
                                                return (
                                                    <Link className='link' to={`/profile/${item?._id?._id}`}>
                                                        <li className='user-like-item'>{item?._id?.userName}</li>
                                                    </Link>
                                                )
                                           })
                                        }
                                    </ul>
                            )
                        }
                            </span>&nbsp;)
                               
                            </li>
                <li className='post-comment' onClick={()=> handleGetCommentByPost(item?._id)}><FaRegCommentDots/>&nbsp;Bình Luận&nbsp;( {item?.comment?.number} )</li>
                <li onClick={()=>handleSharePost(item?._id)}><CiShare2/>&nbsp;Chia sẻ&nbsp;( {shareNumber} )</li>
            </ul>
        </div>
        <div className="post-bottom">

            <div className='post-comment-list'>
                {
                    item?.commentList?.length > 0 && item?.commentList.map((comment,index)=>{
                        return (
                            <>
                            {
                                comment.parent === null && (
                                    <>
                                    <Comment level={0} key={index}   index = {index} handleSetReplyComment = {handleSetReplyComment} comment =  {comment}/>
                                    <div className='child-comment'>
                                        {
                                            comment?.children?.length > 0 && comment?.children?.map((child,indexTwo) =>{
                                                if(typeof child !== 'string'){
                                                    return ( 
                                                        <>
                                                            <Comment level={1} key={indexTwo}  index = {indexTwo}  handleSetReplyComment = {handleSetReplyComment} comment = {child}/>  
                                                            <div className='child-comment'>
                                                            {
                                                                child?.children?.length > 0 && child?.children.map((childTwo,indexThree) =>{
                                                                    if(typeof childTwo !== 'string'){
                                                                        return (   
                                                                            <>
                                                                                <Comment level={2} key={indexThree}  index = {indexThree}  handleSetReplyComment = {handleSetReplyComment} comment = {childTwo}/>  
                                                                                <div className='child-comment'>
                                                                                {
                                                                                    childTwo?.children?.length > 0 && childTwo?.children.map((childThree,indexFour) =>{
                                                                                        if(typeof childThree !== 'string'){
                                                                                            return (                                               
                                                                                                <Comment level={3} key={indexFour}  index = {indexFour}  handleSetReplyComment = {handleSetReplyComment} comment = {childThree}/>  
                                                                                                
                                                                                                )
                                                                                        }
                                                                                    })
                                                                                }
                                                                                </div>      
                                                                            </>                                            
                                                                            )
                                                                    }
                                                                })
                                                            }
                                                            </div>      
                                                        </>                                              
                                                        )
                                                }
                                            })
                                        }
                                    </div>          
                                    </>
                                )
                            }
                            </>
                    
                        )
                    })
                }
                {
                    item?.commentList?.length > 0 && (
                    <div className='more-comment'>
                        <span>Ẩn các bình luận</span>
                    </div>
                    )
                }
                
            </div>
            {
                image.trim() !== "" && (
                    <div className='preview-img'>
                        <img src={image} alt="" />
                    </div>
                )            
            }
            {
                 video.trim() !== "" && (
                    <div className='video-preview'> 
                        <video width="30%" height="30%" controls>
                            <source src={`${video}`} type="video/mp4"/>
                            Your browser does not support the video tag.
                        </video>
                    </div>
                  )
            }
            <div className='post-user-input'>
            <div style={{width:'max-content'}}>
                <img src={user.data?.avatar} alt="" />
            </div>
                <form  onSubmit={handleSubmitForm}>
                {emojiShow && (
                    <div className="emoji">
                        <EmojiPicker theme='light' onEmojiClick={onEmojiClick} />
                    </div>
                 )}
                    <input value={content} type="text" ref={inputRef} placeholder='Viết bình luận của bạn ...' onChange={(e)=>setContent(e.target.value)} />
                    <label htmlFor="" className='post-input icon'>
                        <VscSmiley onClick={() => setEmojiShow(!emojiShow)}/>
                    </label>
                    <label className='post-input image' htmlFor="input-file"><CiImageOn/></label>
                    <input type="file" id='input-file' onChange={handleChooseImage} />
                </form>
                <div className='send-icon' onClick={handleSubmitForm}>
                    <RiSendPlane2Line/>
                </div>
            </div>
        </div>
                </>
            ):(

                <>
                    <div className="post-top">
                        <Link to={`/profile/${item.user._id._id}`}>
                            <img src={item?.user?.avatar} alt="" />
                        </Link>
                        <ul>
                            <li>{item?.user?._id?.userName}</li>
                            <li style={{display:'flex',alignItems:'center'}}><IoTimeOutline/>&nbsp;{moment(item?.createdDate).calendar()}</li>
                        </ul>
                        <ul>
                            
                        </ul>
                       
                      
                                <HiOutlineDotsHorizontal className='post-action' onClick={()=>setIsShowActionActive(active => !active)}/>
                                
                    
                        {
                             user?.data?._id === item?.user?._id?._id && (
                                <div className={ isShowActionActive === true ? 'post-action-item-wrapper active':'post-action-item-wrapper'}>            
                                        
                                        <span onClick={()=>handleDeletePost(item._id)}>Xóa bài viết</span>                                 
                                </div>
                             )
                        }

                        {
                             user?.data?._id !== item?.user?._id?._id && (
                                <div className={ isShowActionActive === true ? 'post-action-item-wrapper active':'post-action-item-wrapper'}>            
                                        <span style={{margin:0}} onClick={()=>handleDenouncePost(item?.user?._id?._id)}>Tố cáo bài viết</span>                           
                                </div>
                             )
                        }

                    </div>
                    <div className='post-content'>
                        {item?.content}
                    </div>
                    <div className="post-center">
                        {
                            item?.images.length === 1 && (
                            <div className='post-img-single'>
                                <img src={item?.images[0]} alt="" />
                            </div>
                            )
                        }

                        {
                            item?.images.length > 1 && (
                                <div className='post-img-list'>
                                    {
                                        item.images?.map(item =>{
                                            return (
                                                <img src={item} alt="" />
                                            )
                                        })
                                    }
                    
                                </div>
                            )
                        }

                        {
                                item?.images?.length === 0  && item?.video?.trim() !== "" && (
                                    <div className='post-video'>
                                        <video width="100%" height="100%" controls ref={videoRef} poster={item.thumb} >
                                            <source src={item.video} type="video/mp4"/>
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )
                            

                            
                        }

                        {
                            (item?.thumb === undefined || item?.thumb === null || item.thumb === "") && (
                                item?.images?.length === 0 && item?.video?.trim() !== "" &&(
                                    <div className='post-video'>
                                        <video width="100%" height="100%" controls ref={videoRef} >
                                            <source src={item.video} type="video/mp4"/>
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                )
                            )
                        }



                        <ul className='post-center-action'>
                            <li style={{display:'flex',alignItems:'center'}} className={item?.like?.userLiked?.find(item => item?._id?._id === user?.data._id) !== undefined && 'liked'} ><GrLike onClick={()=>handleLikePost(item?._id)}/>&nbsp;{item.like?.userLiked?.find(item => item?._id?._id === user?.data._id) !== undefined ? 'Đã thích':'Thích'}&nbsp;(&nbsp;<span className='like-number-view' style={{position:'relative'}}> { item?.like?.number }
                           {
                            item?.like?.userLiked?.length > 0 && (
                                <ul className='show-user-list' style={{position:'absolute',display:'none',flexDirection:'column',alignItems:'center',
                                backgroundColor:'#F0F2F5',padding:20,borderRadius:5,bottom:20,width:'max-content',left:0}}>
                                        {
                                           item?.like?.userLiked.map(item =>{
                                                return (
                                                    <Link className='link' to={`/profile/${item?._id?._id}`}>
                                                        <li className='user-like-item'>{item?._id?.userName}</li>
                                                    </Link>
                                                )
                                           })
                                        }
                                    </ul>
                            )
                        }
                            </span>&nbsp;)
                               
                            </li>
                            <li className='post-comment' onClick={()=> handleGetCommentByPost(item?._id)}><FaRegCommentDots/>&nbsp;Bình Luận&nbsp;( {item?.comment?.number} )</li>
                            <li onClick={()=>handleSharePost(item?._id)}><CiShare2/>&nbsp;Chia sẻ&nbsp;( {shareNumber} )</li>
                        </ul>
                    </div>
                    <div className="post-bottom">

                        <div className='post-comment-list'>
                            {
                                item?.commentList?.length > 0 && item?.commentList.map((comment,index)=>{
                                    return (
                                        <>
                                        {
                                            comment.parent === null && (
                                                <>
                                                <Comment level={0} key={index}   index = {index} handleSetReplyComment = {handleSetReplyComment} comment =  {comment}/>
                                                <div className='child-comment'>
                                                    {
                                                        comment?.children?.length > 0 && comment?.children?.map((child,indexTwo) =>{
                                                            if(typeof child !== 'string'){
                                                                return ( 
                                                                    <>
                                                                        <Comment level={1} key={indexTwo}  index = {indexTwo}  handleSetReplyComment = {handleSetReplyComment} comment = {child}/>  
                                                                        <div className='child-comment'>
                                                                        {
                                                                            child?.children?.length > 0 && child?.children.map((childTwo,indexThree) =>{
                                                                                if(typeof childTwo !== 'string'){
                                                                                    return (   
                                                                                        <>
                                                                                            <Comment level={2} key={indexThree}  index = {indexThree}  handleSetReplyComment = {handleSetReplyComment} comment = {childTwo}/>  
                                                                                            <div className='child-comment'>
                                                                                            {
                                                                                                childTwo?.children?.length > 0 && childTwo?.children.map((childThree,indexFour) =>{
                                                                                                    if(typeof childThree !== 'string'){
                                                                                                        return (                                               
                                                                                                            <Comment level={3} key={indexFour}  index = {indexFour}  handleSetReplyComment = {handleSetReplyComment} comment = {childThree}/>  
                                                                                                            
                                                                                                            )
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                            </div>      
                                                                                        </>                                            
                                                                                        )
                                                                                }
                                                                            })
                                                                        }
                                                                        </div>      
                                                                    </>                                              
                                                                    )
                                                            }
                                                        })
                                                    }
                                                </div>          
                                                </>
                                            )
                                        }
                                        </>
                                
                                    )
                                })
                            }
                            {
                                item?.commentList?.length > 0 && (
                                <div className='more-comment'>
                                    <span>Ẩn các bình luận</span>
                                </div>
                                )
                            }
                            
                        </div>
                        {
                            image.trim() !== "" && (
                                <div className='preview-img'>
                                    <img src={image} alt="" />
                                </div>
                            )            
                        }
                        {
                            video.trim() !== "" && (
                                <div className='video-preview'> 
                                    <video width="30%" height="30%" controls>
                                        <source src={`${video}`} type="video/mp4"/>
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )
                        }
                        <div className='post-user-input'>
                            <div style={{width:'max-content'}}>
                            <img src={user?.data?.avatar} alt="" />
                            </div>
                            <form  onSubmit={handleSubmitForm}>
                            {emojiShow && (
                                <div className="emoji">
                                    <EmojiPicker theme='light' onEmojiClick={onEmojiClick} />
                                </div>
                            )}
                                <input value={content} type="text" ref={inputRef} placeholder='Viết bình luận của bạn ...' onChange={(e)=>setContent(e.target.value)} />
                                <label htmlFor="" className='post-input icon'>
                                    <VscSmiley onClick={() => setEmojiShow(!emojiShow)}/>
                                </label>
                                <label className='post-input image' htmlFor="input-file"><CiImageOn/></label>
                                <input type="file" id='input-file' onChange={handleChooseImage} />
                            </form>
                            <div className='send-icon' onClick={handleSubmitForm}>
                                <RiSendPlane2Line/>
                            </div>
                        </div>
                    </div>
                </>
            )
        }

    </div>
  )
}

export default Post