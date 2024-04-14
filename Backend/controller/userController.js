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
        role:"User",
    });
    
    generateToken(user,"User Registered",200,res);

});

// login

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

// adding new admin
export const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
    const { firstName, lastName, email, password } =
      req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return next(new ErrorHandler("Please Fill Full Form!", 400));
    }
    const isRegistered=await User.findOne({email});
    if(isRegistered){
        return next(new ErrorHandler("Admin With This Email Already Exists!", 400));
    }

    const admin=await User.create({
    firstName,
    lastName,
    email,
    password,
    role:"Admin",

    });
    res.status(200).json({
        success: true,
        message: "New Admin Registered",
        admin,
      });
});

// for getting user details
export const getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=req.user;
    res.status(200).json({
        success:true,
        user,
    });
});

// logout function for user
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
// logout function for admin
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res
      .status(201)
      .cookie("adminToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "Admin Logged Out Successfully.",
      });
  });

  export const generateChatCompletion = async (req, res, next) => {
    const { message } = req.body;
    try {
     // const userId = req.user;
     
      if (!user)
        return res
          .status(401)
          .json({ message: "User not registered OR Token malfunctioned" });
      // grab chats of user
      const chats = user.chats.map(({ role, content }) => ({
        role,
        content,
      }));
      chats.push({ content: message, role: "user" });
      user.chats.push({ content: message, role: "user" });
  
      // send all chats with new one to openAI API
      const config = ConfigureOpenAi();
      const openai = new OpenAI(config);
      // get latest response
      const chatResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chats,
      });
      user.chats.push(chatResponse.data.choices[0].message);
      await user.save();
      return res.status(200).json({ chats: user.chats });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };

