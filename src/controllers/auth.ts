import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { User } from "@/models/user-model";

dotenv.config();

const SECRET = process.env.SECRET_JWT_CODE ?? "";

const Register = async (req: Request, res: Response) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const Login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        const token = await jwt.sign({ username: user.username }, SECRET);
        res.cookie("token", token, {
          httpOnly: true,
          expires: new Date(Date.now() + 60 * 1000 * 60 * 100000),
        });
        res.status(200).json({ token });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
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

export { Login, Logout, Register };
