import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import cookieConfig from "../configs/cookie";
import { sendEmail, sendEmailAsTemplate } from "../middlewares/mailer";
import { User, UserType } from "../models/user-model";
import getCurrentSession from "../middlewares/session";

dotenv.config();

const SECRET = process.env.SECRET_JWT_CODE ?? "";

const Public = async (req: Request<{}, {}, UserType>, res: Response) => {
  res.send("Hiii");
};

const Register = async (req: Request<{}, {}, UserType>, res: Response) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const { email, password, username } = req.body;
    const user = await User.create({
      email,
      password,
      username,
    });
    await sendEmailAsTemplate({
      to: email,
      subject: "Welcome to SketchNow",
      template: "welcome",
      text: "Welcome to SketchNow",
      data: {
        username,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const Login = async (req: Request<{}, {}, UserType>, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const { email, username, password, _id } = user;
        const token = jwt.sign({ email, username, password, _id }, SECRET, {
          expiresIn: "24h",
        });
        res.cookie("token", token, cookieConfig);
        res.status(200).json({ token });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

const Logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.json(true);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const ForgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User doesn't exist" });
  }
  try {
    const resetToken = user.createResetPasswordToken();
    user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/resetPasswordPage/${resetToken}`;

    const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}`;

    await sendEmail({
      to: email,
      subject: "Reset password request received",
      text: message,
    });

    return res.json(true);
  } catch (error) {
    res.status(400).json({ error });
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    return res.json(false);
  }
};

const ResetPasswordPage = async (req: Request, res: Response) => {
  const { token } = req.params;
  const decodedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: decodedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ error: "Token expired" });
  }
  return res.render("forgot-password", { token, error: "" });
};

const ResetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.render("forgot-password", {
        token,
        error: "Password not matching",
      });
    }
    const decodedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: decodedToken,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ error: "Token expired" });
    }
    user.password = await bcrypt.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = Date.now();
    await user.save();
    return res.json(true);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error });
  }
};

const IsSessionValid = async (req: Request, res: Response) => {
  try {
    const session = await getCurrentSession(req);
    res.json(session);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export {
  ForgotPassword,
  IsSessionValid,
  Login,
  Logout,
  Public,
  Register,
  ResetPassword,
  ResetPasswordPage,
};
