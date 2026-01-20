import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors";

dotenv.config();
const app=express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());


const PORT=process.env.PORT||1510;

app.listen(PORT,()=>{
  console.log(`server start ${PORT}`);
})