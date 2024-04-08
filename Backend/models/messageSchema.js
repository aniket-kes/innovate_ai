import mongoose from "mongoose";

const messageSchema=new mongoose.model({
    firstName: {
        type: String,
        required: true,
        minLength: [3, "First Name Must Contain At Least 3 Characters!"],
      },
      lastName: {
        type: String,
        required: true,
        minLength: [3, "Last Name Must Contain At Least 3 Characters!"],
      },
      email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Pls Provide A Valid Email!"],
      },
      message: {
        type: String,
        required: true,
        minLength: [10, "Message Must Contain At Least 10 Characters!"],
      },
});

export const Message=mongoose.model("Message",messageSchema);

