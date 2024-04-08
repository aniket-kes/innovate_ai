import express from "express";
import { dbConnection } from "./databse/dbConnection.js";
import cors from "cors";
import {config} from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app=express();
config({ path: "./config.env" });

app.use(
    cors({
      origin: process.env.FRONTEND_URL,
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

dbConnection();

export default app;