import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";

// const apiCallSchema = new mongoose.Schema({
//   date: {
//       type: Date,
//       required: true,
//       unique: true
//   },
//   count: {
//       type: Number,
//       default: 0
//   }
// });

const chatSchema = new mongoose.Schema({
    id: {
      type: String,
      default: randomUUID(),
    },
    role: {
      type: String,
      required: true,
    },
    message: [{
      type: String,
      required:true,
    }],
    unsafeQueries:{
      type:Number,
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
});

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"],
        minLength: [3,"First Name must contain at least 3 characters"],
    },
    lastName:{
        type:String,
        required:[true,"First name is required"],
        minLength: [3,"First Name must contain at least 3 characters"],
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        validate: [validator.isEmail,"Provide A Valid Email"], 
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength: [8,"Password must contain at least 8 characters"],
        select:false,
    },
    role:{
      type: String,
      required: [true, "User Role Required!"],
      enum: ["User","Admin"],
    },
    chats:[chatSchema],
    timedOut: {
      type: Boolean,
      default: false,
    },
    // apiCalls: [apiCallSchema],
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
    this.password = await bcrypt.hash(this.password, 10);
  });
  // for comparing password 
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// for generating token when user log in
userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User=mongoose.model("User",userSchema);