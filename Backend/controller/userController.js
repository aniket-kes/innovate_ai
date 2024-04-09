import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";

// registering user
export const userRegister=catchAsyncErrors(async(req,res,next)=>{
    const {firstName,lastName,email,password}=req.body;
    if(
        !firstName ||
        !lastName ||
        !email ||
        !password
    ){
        return next(new ErrorHandler("Please Fill Full Form!",400));
    }

    const isRegistered=await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler("User already Registered!", 400));
    }

    const user=await User.create({
        firstName,
        lastName,
        email,
        password,
    });
    
    generateToken(user,"User Registered",200,res);

});

export const login = catchAsyncErrors(async (req, res, next) => {
    const{email,password,confirmPassword}=req.body;
    if(!email || !password || !confirmPassword ){
        return next(new ErrorHandler("please fill full form",400));
    }
    if (password !== confirmPassword) {
        return next(
          new ErrorHandler("Password & Confirm Password Do Not Match!", 400)
        );
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid Email Or Password!", 400));
    }
    const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid Email Or Password!", 400));
  }
    generateToken(user,"Login Successfuly",201,res);

});

// for getting user details
export const getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,
    });
});

// logout function
export const logoutUser=catchAsyncErrors(async(req,res,next)=>{
    res
    .status(201)
    .cookie("userToken","",{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    .json({
        success: true,
        message: "User Logged Out Successfully.",
      });
});
