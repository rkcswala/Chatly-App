
import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/messageSlice";


const Getmessage = () => {
  const dispatch = useDispatch();
  const selecteduser = useSelector((state) => state.user.selecteduser);
  const receiverId = selecteduser?._id;

  useEffect(() => {

    if (!receiverId) return;

    const fetchMessages = async () => {
      //  const token = localStorage.getItem("token");
      try {
       
        const result = await axios.get(
          `https://chatly-app-chi.vercel.app/message/get/${selecteduser._id}`,
          {
            
            withCredentials: true,
          }
        );


        dispatch(setMessages(result.data.messages || []));

      } catch (error) {
        console.error(
          "Get message error:",
          error.response?.data || error.message
        );
      }
    };

    fetchMessages();


  }, [receiverId, dispatch]);
};

export default Getmessage;

