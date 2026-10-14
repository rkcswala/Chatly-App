import React from 'react'
import  { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../redux/userSlice";

const Currentuser = () => {
    
const dispatch = useDispatch();

  useEffect(() => {
  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(
        "https://chatly-app-chi.vercel.app/users/current",
        { withCredentials: true }
      );

      dispatch(setUser(response.data.user || response.data.User));
    } catch (error) {
      console.error(
        "Current User Error:",
        error.response?.data || error.message
      );
    }
  };

  fetchCurrentUser();
}, [dispatch]);
  return null;
}

export default Currentuser