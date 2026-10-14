import express from "express"
import { sendMessage,getMessages } from '../controller/messagecontroller.js';
import isAuth from "../middleware/isAuth.js"


const messagerouter = express.Router()

messagerouter.post("/send/:receiver",isAuth,sendMessage)
messagerouter.get("/get/:receiver",isAuth,getMessages)


export default messagerouter