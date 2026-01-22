import express from "express";
import { Login, LoginSuperAdmin, Logout, RegisterTenantAdmin } from "../controllers/auth.controller.js";
import isSuperAdmin from "../middlewares/isSuperAdmin.middleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/super-admin/login", LoginSuperAdmin);
AuthRouter.post("/tenant-admin/create", isSuperAdmin, RegisterTenantAdmin);
AuthRouter.post("/tenant-admin/login", Login);
AuthRouter.get("/logout", Logout);

export default AuthRouter;