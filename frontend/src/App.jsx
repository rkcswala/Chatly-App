
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setonlineusers } from "./redux/userSlice";
import socket from "./socket";

const App = () => {
  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userData?._id) {
      socket.disconnect();
      dispatch(setonlineusers([]));
      return;
    }

    socket.auth = {};
    socket.io.opts.query = {
      userId: String(userData._id),
    };

    socket.connect();

    const handleOnlineUsers = (users) => {
      dispatch(setonlineusers(users));
    };

    socket.on("onlineusers", handleOnlineUsers);

    return () => {
      socket.off("onlineusers", handleOnlineUsers);
      socket.disconnect();
    };
  }, [userData?._id, dispatch]);

  return (
    <Routes>
     
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/home" element={<Home />} />
     
    </Routes>
  );
};

export default App;
