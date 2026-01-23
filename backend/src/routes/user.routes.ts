import express, { Router } from "express";
import isAdmin from "../middlewares/isAdmin.middleware.js";
import { createUser, getUserById, getUsers } from "../controllers/user.controller.js";

const UserRouter: Router = express.Router();

UserRouter.post("/create", isAdmin, createUser);
UserRouter.get("/all", isAdmin, getUsers);
UserRouter.get("/:user_id", isAdmin, getUserById);

export default UserRouter;