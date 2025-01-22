"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../controllers/auth");
const login_1 = __importDefault(require("../../middlewares/login"));
const authRouter = (0, express_1.Router)();
authRouter.get("/public", auth_1.Public);
authRouter.get("/", login_1.default, auth_1.IsSessionValid);
authRouter.post("/register", auth_1.Register);
authRouter.post("/login", auth_1.Login);
authRouter.get("/logout", login_1.default, auth_1.Logout);
authRouter.post("/forgotPassword", auth_1.ForgotPassword);
authRouter.get("/resetPasswordPage/:token", auth_1.ResetPasswordPage);
authRouter.post("/resetPassword/:token", auth_1.ResetPassword);
exports.default = authRouter;
