import { Router } from "express";

import {
  ForgotPassword,
  IsSessionValid,
  Login,
  Logout,
  Public,
  Register,
  ResetPassword,
  ResetPasswordPage,
} from "../../controllers/auth";
import isLoggedIn from "../../middlewares/login";

const authRouter = Router();

authRouter.get("/public", Public);

authRouter.get("/", isLoggedIn, IsSessionValid);

authRouter.post("/register", Register);

authRouter.post("/login", Login);

authRouter.get("/logout", isLoggedIn, Logout);

authRouter.post("/forgotPassword", ForgotPassword);

authRouter.get("/resetPasswordPage/:token", ResetPasswordPage);

authRouter.post("/resetPassword/:token", ResetPassword);

export default authRouter;
