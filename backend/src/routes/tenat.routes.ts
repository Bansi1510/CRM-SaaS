import express, { Router } from "express";
import isSuperAdmin from "../middlewares/isSuperAdmin.middleware.js";
import { CreateTenant } from "../controllers/tenat.controller.js";

const TenatRouter:Router=express.Router();

TenatRouter.post("/create",isSuperAdmin,CreateTenant)

export default TenatRouter;