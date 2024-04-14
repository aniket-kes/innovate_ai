import express from "express";
import { 
addNewAdmin,
    deleteChats,
generateChatCompletion,
getUserDetails, 
login, 
logoutAdmin, 
logoutUser, 
sendChatsToUser, 
userRegister,
} from "../controller/userController.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../middlewares/auth.js";


const router=express.Router();

router.post("   ",userRegister);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);
router.get("/user/me",isUserAuthenticated,getUserDetails);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/user/logout",isUserAuthenticated,logoutUser);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);
router.post("/new",generateChatCompletion);
router.get("/allchats",sendChatsToUser);
router.delete("/delete",deleteChats);




export default router;