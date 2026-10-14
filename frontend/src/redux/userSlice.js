
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null,
  otheruser: null,
  selecteduser: null,
  socket: null,
  onlineuser:null
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {

    setUser: (state, action) => {
      state.userData = action.payload;
    },


    setotheruser: (state, action) => {
      state.otheruser = action.payload;
    },


    setselecteduser: (state, action) => {
      state.selecteduser = action.payload;
    },

     setsocket: (state, action) => {
      state.socket = action.payload;
    },

     setonlineusers: (state, action) => {
      state.onlineusers = action.payload;
    },
    updateUserData: (state, action) => {
      state.userData = {
        ...state.userData,
        ...action.payload,
      };
    },

    clearUser: (state) => {
      state.userData = null;
      state.otheruser = null;
      state.selecteduser = null;
    },
  },
});

export const {
  setUser,
  clearUser,
  setotheruser,
  setselecteduser,
  updateUserData,
  setsocket,
  setonlineusers
} = userSlice.actions;

export default userSlice.reducer;

