import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";

export const sendMessage=catchAsyncErrors(async(req,res,next)=>{
    const{firstName, lastName,email,message}=req.body;
    if(!firstName || !lastName || !email || !message){
        return next(new ErrorHandler("Please fill form",400));
    }
    await Message.create({firstName, lastName,email,message});
    res.status(200).json({
        success: true,
        message: "Message Sent!",
      });
});
// for getting all messages that exist
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
      success: true,
      messages,
    });
  });
