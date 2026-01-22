import express from "express";
import { LoginSuperAdmin } from "../controllers/auth.controller.js";

const AuthRouter=express.Router();

AuthRouter.post("/super-admin/login",LoginSuperAdmin);

export default AuthRouter;