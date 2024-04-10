import express from "express";
import { 
addNewAdmin,
getUserDetails, 
login, 
logoutAdmin, 
logoutUser, 
userRegister,
} from "../controller/userController.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../middlewares/auth.js";


const router=express.Router();

router.post("/user/register",userRegister);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);
router.get("/user/me",isUserAuthenticated,getUserDetails);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/user/logout",isUserAuthenticated,logoutUser);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);



export default router;