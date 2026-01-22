import express, { Router } from "express";
import isSuperAdmin from "../middlewares/isSuperAdmin.middleware.js";
import { CreateTenant, getTenantById, updateTenant } from "../controllers/tenat.controller.js";

const TenatRouter: Router = express.Router();

TenatRouter.post("/create", isSuperAdmin, CreateTenant)
TenatRouter.get("/:tenant_id", isSuperAdmin, getTenantById);
TenatRouter.put("/:tenant_id/update", isSuperAdmin, updateTenant);

export default TenatRouter;