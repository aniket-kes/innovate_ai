import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/jwtToken.js";
import { ConfigureOpenAi } from "../config/openai-config.js";
import { OpenAI} from "openai";

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
      const user=await User.find();
      res.status(200).json({
          success:true,
          user,
      });
      // console.log(user);
      // console.log();
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
  // generating chat
  export const generateChatCompletion = catchAsyncErrors(async (req, res, next) =>  {
    const { message,unsafeQueries } = req.body;
    console.log(message);
    console.log(unsafeQueries);
    try {
      const user = req.user;
     
      if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });
      // grab chats of user
      const chats = user.chats.map(({ role, content }) => ({
      role,
      content,
      }));
      chats.push({ message: message, role: "user", unsafeQueries:unsafeQueries });
      user.chats.push({ message: message, role: "user",unsafeQueries:unsafeQueries });

      // console.log(user.chats);
  
      // send all chats with new one to openAI API
     // const config = ConfigureOpenAi();
     // const openai = new OpenAI(config);
      // get latest response
     /* const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: chats,
      });
      user.chats.push(chatResponse.data.choices[0].message);
      */
      await user.save();
      return res.status(200).json({ chats: user.chats });
      
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  });
  // sends chat to user
  export const sendChatsToUser = catchAsyncErrors(async (req, res, next) => {
    try {
      //user token check
      const user = req.user;
    // const user=localStorage.getItem("user");
      
     // console.log(user);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      /*if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }*/
      return res.status(200).json({ message: "OK", chats: user.chats });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR", cause: error.message });
    }
  });
  // delete chats
  export const deleteChats = async (req, res, next) => {
    try {
      //user token check
      const user=req.user;
    
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      /*if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
       }*/
      //@ts-ignore
      user.chats = [];
      await user.save();
      return res.status(200).json({ message: "OK" });
    } catch (error) {
      console.log(error);
      return res.status(200).json({ message: "ERROR couldn't delete", cause: error.message });
    }
  };

  //Apply timeout
export const applyTimeout = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    try {
      // Update the user's record in the database to indicate timeout
      // console.log(id);
      const newUser = await User.findById(id);
      if(newUser.timedOut){
        newUser.timedOut = false;
        await newUser.save();
        // console.log(newUser);
        return res.status(200).json({ message: "User removed from timedout"});
      }
      else{
        newUser.timedOut = true;
        await newUser.save();    
        // console.log(newUser);
        res.status(200).json({ message: "Timeout applied successfully"});
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to apply timeout", error: error.message });
    }
  });

  //Check timeout status
export const checkTimeoutStatus = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    try {
      const userId = req.user._id; // Assuming you can identify the user by their ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, isTimedOut: user.timedOut });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  });

  //Get Query Counts per day
export const queryCountsPerDay = catchAsyncErrors(async (req, res, next) => {
    const user = req.user;
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    try {
      const userId = req.user._id; // Assuming you can identify the user by their ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
    
      // Aggregate queries for all chats of the user combined
      const chats = user.chats;
      console.log(chats);
      const result = await chats.aggregate([
        {
          $match: { "_id": { $in: user.chats.map(chat => chat._id) } } // Match all chats of the user
        },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" }
            },
            totalQueries: { $sum: 1 }
          }
        }
      ]);
    
      res.json(result);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
    
  });
  