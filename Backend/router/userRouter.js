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
applyTimeout,
checkTimeoutStatus,
queryCountsPerDay
} from "../controller/userController.js";
import { isAdminAuthenticated, isUserAuthenticated } from "../middlewares/auth.js";


const router=express.Router();

router.post("/user/register",userRegister);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addNewAdmin);
router.get("/user/me",isAdminAuthenticated,getUserDetails);
router.get("/admin/me",isAdminAuthenticated,getUserDetails);
router.get("/user/logout",isUserAuthenticated,logoutUser);
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin);
router.post("/new",isUserAuthenticated,generateChatCompletion);
router.get("/allchats",isUserAuthenticated,sendChatsToUser);
router.delete("/delete",isUserAuthenticated,deleteChats);
router.post("/admin/apply-timeout", isAdminAuthenticated, applyTimeout);
router.get("/timeout-status", isUserAuthenticated, checkTimeoutStatus);
router.get("/queryCountsPerDay",isUserAuthenticated,queryCountsPerDay);

export default router;