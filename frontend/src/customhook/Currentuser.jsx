import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const Currentuser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          "https://chatly-app-chi.vercel.app/users/current",
          { withCredentials: true }
        );

        // console.log("Current User API Response:", response.data);

        const userData = response.data.user || response.data.User;

        if (userData) {
          dispatch(setUser(userData));
          console.log("Dispatch called with user:", userData);
        } else {
          console.error("User data not found in API response");
        }
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
};

export default Currentuser;