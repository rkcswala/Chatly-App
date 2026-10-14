import  { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'



const Signup = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const [showPassword, setShowPassword] = useState(false)
  const [loading, setloading] = useState(false)
  const [err, seterr] = useState("")

  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: ""
  });


  const handlechange = (e) => {

    setformdata({ ...formdata, [e.target.name]: e.target.value })

  }

  const handlesignup = async (e) => {
    e.preventDefault();
    setloading(true)
    seterr("");

    try {
      const Api = await axios.post(
        `https://chatly-app-chi.vercel.app/users/signup`,
       formdata,
        { withCredentials: true }
      );
      // console.log(Api.data);

     dispatch(setUser(Api.data.User || Api.data.User));
      setloading(false)
      alert(Api.data.message);
      navigate("/home")
      setformdata({
        name: "",
        email: "",
        password: ""
      });


    } catch (error) {
      setloading(false)
      seterr(error.response?.data?.message);

    }
  };

  return (
    <div className="signup">
      <div className="form">
        <div className="heading">
          <h1>Welcome to <span>Chatly</span></h1>
        </div>
        <form onSubmit={handlesignup}>
          <input type="text"
            placeholder='Enter Username.'
            value={formdata.name}
            onChange={handlechange}
            name='name'
          />
          <input type="email"
            placeholder='Enter Email.'
            value={formdata.email}
            onChange={handlechange}
            name='email'

          />

          <div className="input">
            <input type={showPassword ? 'text' : 'password'}
              placeholder='Enter password.'
              value={formdata.password}
              onChange={handlechange}
              name='password'

            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'hide' : 'show'}
            </span>
          </div>


          <button disabled={loading}>{loading ? "Loading..." : "Signup"}</button>
          <p >If you have already account go to <a onClick={() => navigate("/login")}>login</a> </p>

          {err && <p style={{ color: "red" }}> {err} </p>}

        </form>
      </div>
    </div>
  )
}

export default Signup