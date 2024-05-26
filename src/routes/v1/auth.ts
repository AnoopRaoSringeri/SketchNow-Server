import { Router } from "express";

import { IsSessionvValid, Login, Logout, Register } from "@/controllers/auth";
import isLoggedIn from "@/middlewares/login";

const authRouter = Router();

authRouter.get("/", isLoggedIn, IsSessionvValid);

authRouter.post("/register", Register);

authRouter.post("/login", Login);

authRouter.get("/logout", isLoggedIn, Logout);

export default authRouter;
