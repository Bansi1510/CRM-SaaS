import express, { Router } from "express";
import isSuperAdmin from "../middlewares/isSuperAdmin.middleware.js";
import { CreateTenant, getTenantById } from "../controllers/tenat.controller.js";

const TenatRouter: Router = express.Router();

TenatRouter.post("/create", isSuperAdmin, CreateTenant)
TenatRouter.get("/:tenant_id", isSuperAdmin, getTenantById);
export default TenatRouter;