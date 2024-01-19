import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { _userRequest } from '../../requestMethod'

export const getCommentList = createAsyncThunk(
  'comment/getList',
   async () => {
    const response = await _userRequest.get('comment'); 
    return response.data
  }
)

export const removeComment = createAsyncThunk(
  'comment/removeComment',
   async (commentId) => {
    const response = await _userRequest.delete(`comment/${commentId}`); 
    return {commentId,message:response.data.message}
  }
)

export const updatePostByOtherUser = createAsyncThunk(
  'comment/updatePostByOtherUser',
   async ({postId,userId}) => {
    const response = await _userRequest.put(`post/update/byotheruser/${postId}`,{userId}); 
    return response.data
  }
)


const commentState = {
  commentList:[],
  isSuccess:false,
  isLoading:false,
  isError:false,
  error:null,
}

export const commentSlice = createSlice({
  name: 'comment',
  initialState:commentState,
  reducers: {
    showCreatePost : (state)=>{
      state.isSuccess = false; 
      state.isShowCreatePost = true; 
    },
    hiddenShowCreatePost:(state)=>{
        state.isShowCreatePost = false; 
    },
  },
  extraReducers:(builder)=>{

    builder.addCase(getCommentList.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })
    builder.addCase(getCommentList.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
      state.commentList = action.payload?.data?.reverse();
    })

    builder.addCase(removeComment.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
     
    })


    builder.addCase(getCommentList.rejected, (state, action) => {
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
      state.postList =  state.postList.map(item=>{
         if(item._id === action.payload?.data?._id){
            item = action.payload?.data;
            return item; 
         }
         return item; 
      })
    })
    builder.addCase(updatePostByOtherUser.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    })
  }
})

export const { showCreatePost,hiddenShowCreatePost } = commentSlice.actions

export default commentSlice.reducer