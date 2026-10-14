import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const Login = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch()

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setloading] = useState(false);

  const [err, seterr] = useState("");

  const [formdata, setformdata] = useState({
    email: "",
    password: ""
  });

  const handlechange = (e) => {
    setformdata({
      ...formdata,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {

    e.preventDefault();

    setloading(true);
    seterr("");

    try {

      const Api = await axios.post(
        `https://chatly-app-chi.vercel.app/users/login`,
        formdata,
        {
          withCredentials: true
        }
      );
    dispatch(setUser(Api.data.user|| Api.data.User));
      // console.log(Api.data.User);

      alert(Api.data.message);
      navigate("/home")
      setformdata({
        email: "",
        password: ""
      });

      setloading(false)

    } catch (error) {

      console.log(error);

      setloading(false);

      seterr(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="signup">

      <div className="form">

        <div className="heading">
          <h1>
            Welcome to <span>Chatly</span>
          </h1>
        </div>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Enter Email."
            value={formdata.email}
            onChange={handlechange}
            name="email"
          />

          <div className="input">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password."
              value={formdata.password}
              onChange={handlechange}
              name="password"
            />

            <span
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? "hide" : "show"}
            </span>

          </div>

         
         {err &&  <p style={{color:'red'}}> {err} </p>  }

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>

          <p>
            Don't have an account?{" "}
            <a onClick={() => navigate("/")}>
              Signup
            </a>
          </p>

        </form>

      </div>

    </div>
  );
};

export default Login;