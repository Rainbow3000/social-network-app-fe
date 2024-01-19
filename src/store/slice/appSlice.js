import { createSlice } from '@reduxjs/toolkit'

const appState = {
  isShowOverlay:false
}

export const appSlice = createSlice({
  name: 'app',
  initialState:appState,
  reducers: {
    toggleOverlay : (state,action)=>{
      state.isShowOverlay = action.payload; 
    }
  },
})

// Action creators are generated for each case reducer function
export const {toggleOverlay} = appSlice.actions

export default appSlice.reducer