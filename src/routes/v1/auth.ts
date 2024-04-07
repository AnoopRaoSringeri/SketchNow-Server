import { Router } from "express";

import { Login, Logout, Register } from "@/controllers/auth";
import isLoggedIn from "@/middlewares/login";

const authRouter = Router();

authRouter.post("/register", Register);

authRouter.post("/login", Login);

authRouter.get("/logout", isLoggedIn, Logout);

authRouter.get("/", isLoggedIn);

export default authRouter;
