import express, { type Request, type Response } from "express";
import cookieParser from "cookie-parser"
import cors from "cors";
import AuthRouter from "./routes/auth.routes.js";
import TenatRouter from "./routes/tenat.routes.js";
const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

 

app.use("/api/auth",AuthRouter);
app.use("/api/tenat",TenatRouter);

export default app;
