import express from "express";
import { dbConnection } from "./databse/dbConnection.js";
import cors from "cors";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js"
const app=express();
config({ path: "./config.env" });

app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      method: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp/",
    })
);

app.use("/api/v1/message",messageRouter);
app.use("/api/v1/user",userRouter);

dbConnection();

app.use(errorMiddleware);

export default app;