import express from "express";
import { 
getUserDetails, 
login, 
logoutUser, 
userRegister 
} from "../controller/userController.js";


const router=express.Router();

router.post("/user/register",userRegister);
router.post("/login",login);
router.get("/user/me",getUserDetails);
router.get("/user/logout",logoutUser);


export default router;