import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import cookieParser from "cookie-parser"

import router from './Routes/userRoute.js'

import connectdb from './config/db.js'
import messagerouter from "./Routes/messageRoute.js"
import { app, server } from "./socket/socket.js"


app.use(cors({
  origin: "https://chat-friendly.netlify.app",
  credentials: true,
   methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
 
}));

const asynchandler = async()=>{
  try {
     await connectdb()
  } catch (error) {
    console.error("Database connection error:", error);
  }
 
}
asynchandler()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



app.use('/users', router)
app.use("/message",messagerouter)

app.get("/",(req,res)=>{
  res.send("Hi saini ji server is working... ")
})






const port = process.env.PORT || 4000

server.listen(port, () => {
   console.log(`Server is running on port ${port}`);

})