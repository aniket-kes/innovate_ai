import express from "express";
import { dbConnection } from "./databse/dbConnection.js";
import {config} from "dotenv";

const app=express();
config({ path: "./config.env" });

dbConnection();

export default app;