import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getcurrentuser } from "../controller/currentusercontroller.js"



const currentuserRouter = express.Router()
currentuserRouter.get("/current",isAuth,getcurrentuser)


export default currentuserRouter;