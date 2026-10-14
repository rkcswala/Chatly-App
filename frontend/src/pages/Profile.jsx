
import  { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateUserData } from "../redux/userSlice";
import "../style/profile.css"
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const defaultImage = "https://cdn-icons-png.flaticon.com/128/149/149071.png";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const currentUser = useSelector((state) => state.user.userData);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(defaultImage);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const fileInputRef = useRef(null);


  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPreview(currentUser.image || defaultImage);
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);

      if (image) {
        formData.append("image", image);
      }

      const response = await axios.put(
        `https://chatly-app-chi.vercel.app/users/update`,
        formData,
        {
          withCredentials: true,
        }
      );

      navigate("/home")
      const updatedUser = response.data.user;


      dispatch(updateUserData(updatedUser));


      setPreview(updatedUser.image || defaultImage);


      setImage(null);

      alert("Profile updated successfully");

    } catch (error) {
      console.log(error);

      setError(
        error.response?.data?.message ||
        "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile">

      <div className="profile-box">

        <div className="edit-part">

          <FaArrowLeft
            className="arrow"
            onClick={() => navigate("/home")}

          />
          <h2>Edit Profile</h2>
        </div>

        <div
          className="profile-image-box"
          onClick={handleImageClick}
        >
          <img
            src={preview}
            alt="Profile"
            className="profile-img"
          />

        </div>


        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <form
          className="proform"
          onSubmit={handleSubmit}
        >


          <input
            type="text"
            placeholder="Enter Name"
            value={name}
            onChange={(e) =>setName(e.target.value)}
          />


          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>setEmail(e.target.value)}
          />


          {error && (
            <p className="error">
              {error}
            </p>
          )}


          <button
            type="submit"
            disabled={loading}
          >
            {loading? "Updating...": "Save Changes"}
              
          </button>

        </form>

      </div>

    </div>
  );
};

export default Profile;

