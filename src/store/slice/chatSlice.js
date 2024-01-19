import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { _userRequest } from '../../requestMethod'

export const getChatListByUser = createAsyncThunk(
  'chat/getListByUser',
   async (data) => {
    const {id,friendId} = data; 
    const response = await _userRequest.get(`chat/getbyuser/${id}&${friendId}`); 
    return response.data
  }
)

export const getUserChatList = createAsyncThunk(
  'chat/getUserChatList',
   async (userId) => {
    const response = await _userRequest.get(`chat/userchatlist/${userId}`); 
    return response.data
  }
)

export const createChat = createAsyncThunk(
    'chat/create',
     async (chatData) => {
      const response = await _userRequest.post('chat',chatData); 
      return response.data
    }
  )

  export const deleteChat = createAsyncThunk(
    'chat/deleteChat',
     async (chatId) => {
      const response = await _userRequest.delete(`chat/${chatId}`); 
      return {chatId}; 
    }
  )

export const updatePostByOtherUser = createAsyncThunk(
  'chat/updatePostByOtherUser',
   async ({postId,userId}) => {
    const response = await _userRequest.put(`post/update/byotheruser/${postId}`,{userId}); 
    return response.data
  }
)






const chatState = {
  chatList:[],
  userChatCurrent:JSON.parse(localStorage.getItem('user-chat')) !== null ? JSON.parse(localStorage.getItem('user-chat')) : null,
  userChatList:[],
  callIdList:[],
  isPlayCall:false,
  currentCallId:null,
  isShowCallLayout:false,
  isSuccess:false,
  isLoading:false,
  isError:false,
  error:null,
  callFromFriend:null,
  cancel:false, 
  confirm:false
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState:chatState,
  reducers: {

    setCancel:(state,action)=>{
      state.cancel = action.payload; 
    },

    setConfirm:(state,action)=>{
      state.confirm = action.payload; 
    },

    showCreatePost : (state)=>{
      state.isSuccess = false; 
      state.isShowCreatePost = true; 
    },
    hiddenShowCreatePost:(state)=>{
        state.isShowCreatePost = false; 
    },

    setUserChatCurrent:(state,action)=>{
        state.userChatCurrent = action.payload; 
    },
    setCallIdList:(state,action)=>{
        state.callIdList = action.payload; 
    },
    setCurrentCallId:(state,action)=>{
      state.currentCallId = action.payload; 
    },
    addChatCreated:(state,action)=>{
      if(state.chatList.find(item => item._id === action.payload._id) === undefined){
        state.chatList = [...state.chatList,action.payload]; 
      } 
    },

    setCallFriend:(state,action)=>{
      state.callFromFriend = action.payload; 
    },

    setIsPlayCall:(state,action)=>{
      state.isPlayCall = action.payload; 
    },
    setIsShowCallLayout:(state,action)=>{
      state.isShowCallLayout = action.payload
    },
    chatReset: () => chatState
  },
  extraReducers:(builder)=>{
    builder.addCase(deleteChat.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })
    builder.addCase(deleteChat.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false
      state.chatList = state.chatList.filter(item => item._id !== action.payload.chatId); 
    })
    builder.addCase(deleteChat.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    })


    builder.addCase(getUserChatList.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })
    builder.addCase(getUserChatList.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
      state.userChatList = action.payload.data; 
    })
    builder.addCase(getUserChatList.rejected, (state, action) => {
      state.isError = true;
      state.isSuccess = false;
      state.error = action.payload;
      state.isLoading = false;
    })



    builder.addCase(createChat.pending, (state, action) => {
        state.isLoading = true; 
        state.isSuccess = false;
      })
      builder.addCase(createChat.fulfilled,(state, action) => {
        state.isLoading = false;
        state.error = null; 
        state.isError = false;
        if(state.chatList.find(item => item._id === action.payload.data._id) === undefined){
          state.chatList =[...state.chatList,action.payload.data]; 
        } 
      
      })
      builder.addCase(createChat.rejected, (state, action) => {
        state.isError = true;
        state.isSuccess = false;
        state.error = action.payload;
        state.isLoading = false;
      })



    builder.addCase(getChatListByUser.pending, (state, action) => {
      state.isLoading = true; 
      state.isSuccess = false;
    })
    builder.addCase(getChatListByUser.fulfilled,(state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false;
      state.chatList = action.payload?.data;
    })
    builder.addCase(getChatListByUser.rejected, (state, action) => {
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

export const {setCancel,setConfirm,setCallFriend, setIsPlayCall,setIsShowCallLayout,showCreatePost,hiddenShowCreatePost,setUserChatCurrent,addChatCreated,chatReset,setCallIdList,setCurrentCallId } = chatSlice.actions

export default chatSlice.reducer