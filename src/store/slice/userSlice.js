import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { _publicRequest, _userRequest } from '../../requestMethod'
import {createInstanceSocket} from '../../utils/socket' 

const socket = createInstanceSocket(); 

export const userRegister = createAsyncThunk(
  'users/register',
  async (data) => {
    try {
      const response = await _publicRequest.post('account/register',data); 
      return response.data
    } catch (error) { 
        throw error?.response?.data
    }
  }
)

export const userLogin = createAsyncThunk(
  'users/login',
  async (data) => {
    try{
      const response = await _publicRequest.post('account/login',data); 
      return response.data
    }catch(error){
      throw error?.response?.data
    }
  }
)

export const userAddFriend = createAsyncThunk(
  'users/addFriend',
  async (data) => {
    const {id,userData} = data; 
    const response = await _userRequest.put(`user/friend/${id}`,userData); 
    return response.data
  }
)

export const recoverPassword = createAsyncThunk(
  'users/password/reset',
  async (data) => {
    try {
      const response = await _userRequest.post('account/password/reset',data); 
      return response.data
    } catch (error) {
      throw error?.response?.data
    }
  }
)



export const userAcceptAddFriend = createAsyncThunk(
  'users/acceptAddFriend',
  async (data) => {
    const {id,userData} = data; 
    const response = await _userRequest.put(`user/friend/accept/${id}`,userData); 
    return response.data
  }
)



export const userCancelAddFriend = createAsyncThunk(
  'users/cancelAddFriend',
  async (data) => {
    const {id,userData} = data; 
    const response = await _userRequest.put(`user/unfriend/${id}`,userData); 
    return response.data
  }
)

export const updateBlock = createAsyncThunk(
  'users/updateBlock',
  async (data) => {
    const {id,userData} = data; 
    const response = await _userRequest.put(`user/block/${id}`,userData); 
    return response.data
  }
)





export const getUserInfo = createAsyncThunk(
  'users/getUserInfo',
  async (userId) => {
    const response = await _userRequest.get(`user/${userId}`); 
    return response.data
  }
)

export const getBlockingUser = createAsyncThunk(
  'users/getBlockingUser',
  async (userId) => {
    const response = await _userRequest.get(`user/block/${userId}`); 
    return response.data
  }
)

export const getUserDob = createAsyncThunk(
  'users/dob',
  async (userId) => {
    const response = await _userRequest.get(`user/dob/${userId}`); 
    return response.data
  }
)



export const getUserList = createAsyncThunk(
  'users/getUserList',
  async () => {
    const response = await _userRequest.get('user'); 
    return response.data
  }
)



export const updateUserInfo = createAsyncThunk(
  'users/updateUserInfo',
  async (data) => {
    const {userId,userData} = data; 
    const response = await _userRequest.put(`user/${userId}`,userData); 
    return response.data
  }
)

export const updatePassword = createAsyncThunk(
  'users/updatePassword',
  async (data) => {
    try {
      const {accountId,accountData} = data; 
      const response = await _userRequest.put(`account/password/${accountId}`,accountData); 
      return response.data    
    } catch (error) {
      throw error?.response?.data
    }
  }
)


const userState = {
  isShowLoginForm:false,
  typePopupForm:1,
  isLoading:false,
  isError:false,
  user: JSON.parse(localStorage.getItem('user'))  || null,
  userInfo:null,
  userInfoTemp:null,
  error:null,
  success:false,
  isRecoverPassSuccess:false,
  activeList: [],
  userDob:[],
  userList:[],
  blockingUser:[],
  userSuccessMessage:""
}

export const userSlice = createSlice({
  name: 'user',
  initialState:userState,
  reducers: {
    showLoginForm : (state,action)=>{
      state.isShowLoginForm = true; 
      state.typePopupForm = action.payload
    },
    hiddenLoginForm:(state)=>{
        state.isShowLoginForm = false; 
    },
    setTypePopupForm:(state,action)=>{
        state.typePopupForm = action.payload;
    },
    userLogout:(state,action)=>{
      state.user = null; 
      localStorage.removeItem('user');
      localStorage.clear();  
      state.activeList = state.activeList.filter(item => item !== action.payload); 
      state.userInfo = null; 
     
    },
    setUserActive:(state,action)=>{
     state.activeList = action.payload;
    },
    setEmptyUserChat:(state,action)=>{
        state.userInfo = {...state.userInfo,chats:[]}
    },
    resetUserSuccess:(state,action)=>{
      state.success = false; 
      state.userSuccessMessage = "";
      state.isRecoverPassSuccess = false;
    },
    removeFromActiveList:(state,action)=>{
      state.activeList = state.activeList.filter(item => item !== action.payload); 
    },

    filterFriends:(state,action)=>{
      state.userInfo.friends = state.userInfoTemp.friends; 
      if(action.payload.trim() !== ""){
        state.userInfo.friends = state.userInfo.friends.filter(item => item._id.userName.toLowerCase().includes(action.payload.toLowerCase()))
      }else{
        state.userInfo.friends = state.userInfoTemp.friends; 
      }
    }
  },

  extraReducers: (builder) => {

    builder.addCase(recoverPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.isRecoverPassSuccess = true; 
    })

    builder.addCase(recoverPassword.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error; 
      state.success = false; 
      state.isRecoverPassSuccess = false; 
    })

    builder.addCase(getUserDob.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.userDob = action.payload.data; 
    })


    builder.addCase(updatePassword.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.success = true; 
      state.userSuccessMessage = action.payload.message
      // state.blockingUser = action.payload.data; 

    })
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.isError = true;
      state.error = action.error;
      state.isLoading = false; 
      state.success = false; 
    })


    
    builder.addCase(updateBlock.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(updateBlock.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.blockingUser = action.payload.data; 

    })
    builder.addCase(updateBlock.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })


    builder.addCase(getBlockingUser.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(getBlockingUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.blockingUser = action.payload.data; 
    })
    builder.addCase(getBlockingUser.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })



    builder.addCase(getUserList.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(getUserList.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.userList = action.payload.data; 
    })
    builder.addCase(getUserList.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })




    builder.addCase(userCancelAddFriend.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(userCancelAddFriend.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      if(action.payload.data.type !== undefined && action.payload.data.type === 2){
        state.userInfo.requestAddFriend = action.payload.data.requestAddFriend;
        state.userInfo.friends = action.payload.data.friends;
        return;
      }
      state.userInfo.requestAddFriendFromUser = action.payload.data.requestAddFriendFromUser;
      state.userInfo.friends = action.payload.data.friends
    })
    builder.addCase(userCancelAddFriend.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })


    builder.addCase(userAcceptAddFriend.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(userAcceptAddFriend.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.userInfo.friends = action.payload.data.friends;
      state.userInfo.requestAddFriend = action.payload.data.requestAddFriend;
    })
    builder.addCase(userAcceptAddFriend.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })




    builder.addCase(userAddFriend.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(userAddFriend.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.userInfo.requestAddFriendFromUser = action.payload.data;

    })
    builder.addCase(userAddFriend.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })

    builder.addCase(updateUserInfo.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(updateUserInfo.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.userInfo = action.payload?.data; 
      if(state.user !== null){
        state.user.data.avatar = action.payload?.data?.avatar; 
        state.user.data.userName = action.payload?.data?._id.userName
      }
      localStorage.removeItem('user'); 
      localStorage.setItem('user',JSON.stringify(state.user)); 
      state.success = true; 
      state.userSuccessMessage = action.payload.message
    })
    builder.addCase(updateUserInfo.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })


    builder.addCase(userRegister.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(userRegister.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null; 
      state.isError = false; 
      state.user = action.payload; 
      localStorage.setItem('user',JSON.stringify((state.user))); 
    })
    builder.addCase(userRegister.rejected, (state, action) => {
      state.isError = true;
      state.user = null;
      state.error = action.error;
      state.isLoading = false; 
    })

    builder.addCase(userLogin.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(userLogin.fulfilled, (state, action) => {
      state.isLoading = false; 
      state.user = action.payload; 
      localStorage.setItem('user',JSON.stringify((state.user))); 
    })
    builder.addCase(userLogin.rejected, (state, action) => {
      state.user = null;
      state.error = action.error
      state.isLoading = false; 
    })


    builder.addCase(getUserInfo.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      state.isLoading = false; 
      state.userInfo = action.payload.data; 
      state.userInfoTemp = action.payload.data; 
    })
    builder.addCase(getUserInfo.rejected, (state, action) => {
      state.user = null;
      state.isLoading = false; 
    })
  },
})


export const {filterFriends,removeFromActiveList,resetUserSuccess,showLoginForm,hiddenLoginForm,setTypePopupForm,userLogout,setUserActive,setEmptyUserChat} = userSlice.actions

export default userSlice.reducer