import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { _userRequest } from '../../requestMethod'
import {findComment,addComment,removeTreeComment} from '../../helper/commentHelper'
export const createPost = createAsyncThunk(
  'post/create',
   async (data) => {
    const response = await _userRequest.post('post',data); 
    return response.data
  }
)


export const createDenounce = createAsyncThunk(
  'post/createDenounce',
   async (data) => {
    const response = await _userRequest.put(`post/denounce/${data.postId}`,data); 
    return response.data
  }
)




export const createComment = createAsyncThunk(
  'comment/create',
   async (data) => {
    const response = await _userRequest.post('comment',data); 
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  'comment/deletePost',
   async (postId) => {
    const response = await _userRequest.delete(`post/${postId}`); 
    const {data,message} = response.data;
 
 
    return {data,postId,message}
  }
)



export const getPostList = createAsyncThunk(
  'post/getList',
   async () => {
    const response = await _userRequest.get('post'); 
    return response.data
  }
)


export const updatePostByOtherUser = createAsyncThunk(
  'post/updatePostByOtherUser',
   async ({postId,userId,type,isShare}) => {
    const response = await _userRequest.put(`post/update/byotheruser/${postId}`,{userId,type}); 
    if(isShare === true){
      response.data.type = 'SHARE'
    }
    return response.data; 
  }
)


export const updateStatusPost = createAsyncThunk(
  'post/updateStatusPost',
   async ({postId,status}) => {
    const response = await _userRequest.put(`post/status/${postId}`,{status}); 
    return response.data; 
  }
)

export const updatePost = createAsyncThunk(
  'post/updatePost',
   async ({postId,userId}) => {
    const response = await _userRequest.put(`post/${postId}`,{userId}); 
    return {postId,userId, message: response.data.message}; 
  }
)




export const getCommentByPost = createAsyncThunk(
  'comment/getCommentByPost',
   async (postId) => {
    const response = await _userRequest.get(`comment/getbypost/${postId}`); 
    return {commentData:response.data,postId}
  }
)

export const getCommentByParent = createAsyncThunk(
  'comment/getCommentByParent',
   async ({commentId,postId}) => {
    const response = await _userRequest.get(`comment/${commentId}`); 
    const {data} = response.data; 
    return {commentId,postId,data}
  }
)




export const getPostByUser= createAsyncThunk(
  'comment/getPostByUser',
   async (userId) => {
    const response = await _userRequest.get(`post/getbyuser/${userId}`); 
    return response.data
  }
)


export const removeComment = createAsyncThunk(
  'comment/removeComment',
   async ({commentId,postId,parentComment}) => {
    const response = await _userRequest.delete(`comment/${commentId}`); 
    return {commentId,postId,message:response.data.message,parentComment}
  }
)

const postState = {
  isShowCreatePost:false,
  postList:[],
  postOfUser:[],
  commentIdList:[],
  isSuccess:false,
  isLoading:false,
  isError:false,
  error:null,
  postSuccessMessage:""
}

export const postSlice = createSlice({
  name: 'post',
  initialState:postState,
  reducers: {
    showCreatePost : (state)=>{
      state.isSuccess = false; 
      state.isShowCreatePost = true; 
    },
    hiddenShowCreatePost:(state)=>{
        state.isShowCreatePost = false; 
    },
    setChildrentComment:(state,action)=>{
      state.postList = state.postList.map(post =>{
        if(post._id === action.payload.postId){
          let childComment = null; 
        
          childComment =  post.commentList?.filter(comment =>{
              if(action.payload.children.includes(comment._id)){
                return comment;
              }
            });   
          
         
          post.commentList = post.commentList.map(comment=>{

            if(comment._id === action.payload.commentId){
               if(state.commentIdList.find(item => item === action.payload.commentId) === undefined){
                 comment.children = childComment; 
                 state.commentIdList = [...state.commentIdList,action.payload.commentId]
               }else {              
                comment.children = action.payload.children.map(item => item._id)   
                state.commentIdList = state.commentIdList.filter(comId => comId !== action.payload.commentId); 
               }
            }

            
    
            return comment;
          })
       

        }
        return post;
      })


      state.postOfUser = state.postOfUser.map(post =>{
        if(post._id === action.payload.postId){
          const childComment =  post.commentList?.filter(comment =>{
            if(action.payload.children.includes(comment._id)){
              return comment;
            }
          });
         
          post.commentList = post.commentList.map(comment=>{
            if(comment._id === action.payload.commentId){
               comment.children = childComment; 
            }
            return comment;
          })
        }
        return post;
      })
    },


   
    resetPostSuccess:(state,action)=>{
      state.isSuccess = false; 
      state.postSuccessMessage = "" 
    }
   
  },
  extraReducers:(builder)=>{




    builder.addCase(createDenounce.fulfilled, (state, action) => {
      state.isSuccess = true; 
      state.postSuccessMessage = action.payload.message; 
    })

    builder.addCase(getCommentByParent.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false; 
    })
    builder.addCase(getCommentByParent.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 

      state.postList = state.postList.map(post => {
        if(post._id === action.payload.postId){
            post.commentList = post.commentList.map(comment =>{
              findComment(comment,action.payload.commentId,action.payload.data);           
              return comment; 
            })
        }
        return post; 
      })


      state.postOfUser = state.postOfUser.map(post => {
        if(post._id === action.payload.postId){
            post.commentList = post.commentList.map(comment =>{
              findComment(comment,action.payload.commentId,action.payload.data);           
              return comment; 
            })
        }
        return post; 
      })
   
    })
    builder.addCase(getCommentByParent.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })


    builder.addCase(updateStatusPost.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false; 
    })
    builder.addCase(updateStatusPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.isSuccess = true;
      state.postSuccessMessage = action.payload.message;
      state.postList = state.postList.map(item =>{
        if(item._id === action.payload._id){
            item = action.payload.data; 
        }
        return item; 
      })
      state.postOfUser = state.postOfUser.map(item =>{
        if(item._id === action.payload._id){
            item = action.payload.data; 
        }
        return item; 
      })

    })
    builder.addCase(updateStatusPost.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })



    builder.addCase(deletePost.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false; 
    })
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.postList = state.postList.filter(item => item._id !== action.payload.postId); 
      state.postOfUser = state.postOfUser.filter(item => item._id !== action.payload.postId); 
      state.isSuccess = true;
      state.postSuccessMessage = action.payload.message
      
    })
    builder.addCase(deletePost.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })


    
    builder.addCase(removeComment.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false; 
    })
    builder.addCase(removeComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 

  


      state.postList = state.postList.map(post =>{
        if(post._id === action.payload.postId){
          post.comment.number --; 


          if(action.payload.parentComment === null){
              post.commentList = post.commentList.filter(item => item._id !== action.payload.commentId)
          }else{
            
            post.commentList = post.commentList.map(comment =>{
              removeTreeComment(comment,action.payload.parentComment,action.payload.commentId); 
              return comment; 
            })
          }
                   

        }

        return post; 
      })
      state.isSuccess = true;
      state.postSuccessMessage = action.payload.message
      
    })
    builder.addCase(removeComment.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })




    builder.addCase(createPost.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false; 
    })
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.isSuccess = true;
      state.postSuccessMessage = action.payload.message; 
      state.postList = [...state.postList,action.payload?.data].reverse();
      state.postOfUser = [...state.postOfUser,action.payload?.data].reverse(); 

    })
    builder.addCase(createPost.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })
    


    builder.addCase(getPostList.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })
    builder.addCase(getPostList.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
      state.postList = action.payload?.data?.reverse();
    })
    builder.addCase(getPostList.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    })

    builder.addCase(updatePost.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })
    builder.addCase(updatePost.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
      state.postOfUser = state.postOfUser.filter(item => item._id !== action.payload.postId)
      state.isSuccess = true; 
      state.postSuccessMessage = action.payload.message; 

    })
    builder.addCase(updatePost.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    })

    builder.addCase(getPostByUser.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })
    builder.addCase(getPostByUser.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
      state.postOfUser = action.payload?.data?.reverse();
    })
    builder.addCase(getPostByUser.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    })


    builder.addCase(getCommentByPost.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })

    builder.addCase(getCommentByPost.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
      state.postList = state.postList.map(item =>{
        if(item._id === action.payload.postId){
            item.commentList = action.payload?.commentData?.data.reverse();
        }
        return item; 
      })

      state.postOfUser = state.postOfUser.map(item =>{
        if(item._id === action.payload.postId){
            item.commentList = action.payload?.commentData?.data.reverse();
        }
        return item; 
      })
    })
    
    builder.addCase(getCommentByPost.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    })



    builder.addCase(updatePostByOtherUser.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })
    builder.addCase(updatePostByOtherUser.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
      
      if(action.payload.type === 'SHARE'){
          state.postOfUser = state.postOfUser.map(item=>{     
            if(item._id === action.payload?.data?._id && item.type === 'SHARE'){  
              item = action.payload.data;
              item.type = 'SHARE'
            }else {
              item.like = action.payload.data.like
              item.share = action.payload.data.share
              
            }   
            return item; 
        })    
      }else {   
        state.postOfUser = state.postOfUser.map(item=>{     
          if(item._id === action.payload?.data?._id){  
            item.like = action.payload.data.like;
            item.share = action.payload.data.share
          }   
          return item; 
        })  
        
        
        state.postList = state.postList.map(item=>{
           if(item._id === action.payload?.data?._id){    
            item.like = action.payload.data.like;
            item.share = action.payload.data.share
           }
           return item; 
        })
      }

      
    })
    builder.addCase(updatePostByOtherUser.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    })

    builder.addCase(createComment.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false; 
    })
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
     
      state.postList = state.postList.map(post =>{
        if(post._id === action.payload.data.post){
          post.comment.number ++; 

          if(action.payload.data.parent === null){
          if(post.commentList === undefined){
              post.commentList = []; 
            }
            post.commentList = [...post.commentList,action.payload.data]; 
          }else{
            post.commentList = post.commentList.map(comment =>{
              addComment(comment,action.payload.data.parent,action.payload.data); 
              return comment; 
            })
          }

        }

        return post; 
      })


      state.postOfUser = state.postOfUser.map(post =>{
        if(post._id === action.payload.data.post){
          post.comment.number ++; 

          if(action.payload.data.parent === null){
          if(post.commentList === undefined){
              post.commentList = []; 
            }
            post.commentList = [...post.commentList,action.payload.data]; 
          }else{
            post.commentList = post.commentList.map(comment =>{
              addComment(comment,action.payload.data.parent,action.payload.data); 
              return comment; 
            })
          }

        }

        return post; 
      })

    
    })
    builder.addCase(createComment.rejected, (state, action) => {
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })
  }
})

export const { showCreatePost,hiddenShowCreatePost,setChildrentComment,setValueSuccess,resetPostSuccess } = postSlice.actions

export default postSlice.reducer