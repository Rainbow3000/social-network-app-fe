import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { _publicRequest } from '../../requestMethod'

export const createNotification = createAsyncThunk(
  'notification/create',
  async (data) => {
    try {
      const response = await _publicRequest.post('notification',data); 
      return response.data
    } catch (error) { 
        throw error?.response?.data
    }
  }
)


export const getNotificationByUser = createAsyncThunk(
  'notification/getByUser',
  async (userId) => {
    try {
      const response = await _publicRequest.get(`notification/getByUser/${userId}`); 
      return response.data
    } catch (error) { 
        throw error?.response?.data
    }
  }
)

export const updateNotifiList = createAsyncThunk(
  'notifi/update',
  async (id) => {
    try {
      const response = await _publicRequest.put(`notification/${id}`); 
      return response.data
    } catch (error) {
      throw error?.response?.data
    }
  }
)


const notificationState = {
  notificationList:[],
  unReadNumber:0,
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState:notificationState,
  reducers: {
    addNotifi:(state,action)=>{
      if(state.notificationList.find(item => item._id === action.payload._id) === undefined){
        state.notificationList = [action.payload,...state.notificationList];
        state.unReadNumber = state.unReadNumber + 1;
      }
    },
    notifiReset: () => notificationState
  },

  extraReducers: (builder) => {


    builder.addCase(createNotification.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(createNotification.fulfilled, (state, action) => {
        state.notificationList = action.payload.data;
    })
    builder.addCase(createNotification.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })

    builder.addCase(getNotificationByUser.pending, (state, action) => {
      state.isLoading = true; 
    })
    builder.addCase(getNotificationByUser.fulfilled, (state, action) => {
        state.notificationList = action.payload.data;
        state.unReadNumber = state.notificationList.filter(item => item.isReaded === false).length; 
    })
    builder.addCase(getNotificationByUser.rejected, (state, action) => {
      state.user = null;
      state.isError = true;
      state.error = action.payload;
      state.isLoading = false; 
    })

    builder.addCase(updateNotifiList.fulfilled,(state,action) => {
      state.isLoading = false;
      state.notificationList = state.notificationList.map(item =>{
        if(item._id === action.payload.data._id){
        
           item = action.payload.data; 
        }
        return item; 
      })

      state.unReadNumber = state.notificationList.filter(item => item.isReaded === false).length; 
   
    })


  },
})


export const { addNotifi,notifiReset } = notificationSlice.actions

export default notificationSlice.reducer