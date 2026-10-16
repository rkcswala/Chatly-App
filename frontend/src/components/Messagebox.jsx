
import React, { useState, useEffect } from "react";

import {
  FaPhone,
  FaVideo,
  FaEllipsisV,
  FaArrowLeft,
} from "react-icons/fa";

import { setselecteduser } from "../redux/userSlice";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoIosImages } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import Emojipicker from "emoji-picker-react";

import { useDispatch, useSelector } from "react-redux";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";
import axios from "axios";
import { addMessage } from "../redux/messageSlice";
import socket from "../socket";


const API = "https://chatly-app-chi.vercel.app";

const MessageBox = () => {
  const selecteduser = useSelector(
    (state) => state.user.selecteduser
  );

  const currentUser = useSelector(
    (state) => state.user.userData
  );

  const { messages } = useSelector(
    (state) => state.message
  );

  const dispatch = useDispatch();

  const [input, setInput] = useState("");
  const [showpicker, setShowpicker] = useState(false);
  const [photo, setphoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);


  const Emojihandler = (emojiData) => {
    setInput((pre) => pre + emojiData.emoji)

  }

  const photoHandler = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setphoto(file);
    setPhotoPreview(URL.createObjectURL(file));

    console.log("Selected photo:", file);
  };

const messageEndRef = React.useRef(null);

  useEffect(() => {
    const handleNewMessage = (mess) => {
      if (!mess?._id) return;
      dispatch(addMessage(mess));
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [dispatch]);

  // Send message


  const sendmessage = async (e) => {
    e.preventDefault();

    const text = input.trim();


    if (!text && !photo) {
      console.log("Message ya photo select karein");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("message", text);

      if (photo instanceof File) {
        formData.append("image", photo);
      }


      const result = await axios.post(
        `${API}/message/send/${selecteduser._id}`,
        formData,
        { withCredentials: true }
      );

      // console.log("Server response:", result.data);

      const newMessage = result.data.newMessage;

      if (newMessage?._id) {
        dispatch(addMessage(newMessage));
        setInput("");
        setphoto(null);
        setPhotoPreview(null);
        setShowpicker(false);
      }
    } catch (error) {
      console.error("Full error:", error);
      
    }
  };

useEffect(() => {
  messageEndRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}, [messages],[selecteduser]);
  return (
    <div className="message-box">
      {selecteduser ? (
        <div className="chat-header">
          <div className="chat-user-info">
            <FaArrowLeft
              className="arrow-btn"
              onClick={() => dispatch(setselecteduser(null))}
            />

            <img
              src={
                selecteduser.image ||
                "https://cdn-icons-png.flaticon.com/128/149/149071.png"
              }
              alt="profile"
            />

            <h3>{selecteduser.name || "User"}</h3>
          </div>

          <div className="chat-actions">
            <FaPhone />
            <FaVideo />
            <FaEllipsisV />
          </div>

          <div className="msg">
            <div className="message-list">

              {Array.isArray(messages) &&
                messages.map((mess) => {
                  const senderId =
                    typeof mess.sender === "object"
                      ? mess.sender?._id
                      : mess.sender;

                  const isCurrentUser =
                    String(senderId) === String(currentUser?._id);

                  return isCurrentUser ? (
                    <SenderMessage
                      key={mess._id}
                      message={mess.message}
                      image={mess.image}
                    />
                  ) : (
                    <ReceiverMessage
                      key={mess._id}
                      message={mess.message}
                      image={mess.image}
                    />
                  );
                })}
                <span ref={messageEndRef}></span>

            </div>
          </div>

          {showpicker && (
            <div className="emoji-picker-container">
              <Emojipicker
                onEmojiClick={Emojihandler}
                height={350}
                width="100%"
              />
            </div>
          )}

          {photoPreview && (
            <div className="photo-preview">
              <img src={photoPreview} alt="Preview" />
            </div>
          )}
          <div className="messagearea">
            <form className="frm" onSubmit={sendmessage}>
              <div
                onClick={() =>
                  setShowpicker((prev) => !prev)
                }
              >
                <RiEmojiStickerLine className="emoji" />
              </div>

              <input
                id="message"
                name="message"
                type="text"
                placeholder="Message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoComplete="off"
              />

              <div className="icons">

                <label htmlFor="imageInput">
                  <IoIosImages className="e1" />

                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={photoHandler}

                  />
                </label>



                <button
                  type="submit"
                  className="send-btn"
                  disabled={!input.trim() && !photo}
                  aria-label="Send message"
                >
                  <IoSend className="e1" />
                </button>

              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="empty-div">
          <p>Welcome to chat App</p>
          <span>Chat Friendly!</span>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
