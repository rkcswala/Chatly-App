import express from 'express';
import { signup,login,logout,getallusers,getcurrentuser,editProfile } from '../controller/usercontroller.js';
import isAuth from "../middleware/isAuth.js"
import {upload} from "../middleware/multer.js"

const router = express.Router();

router.post('/signup', signup)
router.post('/login',login)
router.post('/logout', logout)
router.put("/update",isAuth,upload.single("image"),editProfile);

router.get("/allusers",getallusers)

router.get("/current", isAuth, getcurrentuser)

export default router;