
import React, { useState, useEffect } from "react";
import { FaSearch, FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {setselecteduser,clearUser,} from "../redux/userSlice";
const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const user = useSelector((state) => state.user.userData);

  const [result, setResult] = useState([]);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `https://chatly-app-chi.vercel.app/users/logout`,
        {},
        { withCredentials: true }
      );

     
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {

      alert(error.response?.data?.message || "Logout failed" );
        
    }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `https://chatly-app-chi.vercel.app/users/allusers`,
        {
          withCredentials: true,
        }
      );

      const allUsers = response.data.users || [];

      const otherUsers = allUsers.filter(
        (item) =>
          item._id?.toString() !== user?._id?.toString()
      );

      setResult(otherUsers);
    } catch (error) {
      console.log(error);
      
    }
  };

  useEffect(() => {
   
    getUsers();
  }, [user?._id]);

  return (
    <div className="sidebar">

      <div className="app-name">
        <h2>ChatApp</h2>

        <h3>
          Hi, {user?.name || "User"}
        </h3>

        <img
          src={user?.image || "https://cdn-icons-png.flaticon.com/128/17287/17287005.png"}
          alt="profile"
          className="user-img"
          onClick={() => navigate("/profile")}
        />

        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search users..."
          />
        </div>
      </div>

      <div className="chat-list">
        {result.map((item) => (
          <div
            className="chat-user"
            key={item._id}
            onClick={() =>
              dispatch(setselecteduser(item))
            }
          >
            <img
              
              src={item.image || "https://cdn-icons-png.flaticon.com/128/149/149071.png"}
              alt="user"
            />

            <h4>{item.name}</h4>
          </div>
        ))}
      </div>

      <div className="logout-container">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
