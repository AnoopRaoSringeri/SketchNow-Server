import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import cookieConfig from "@/configs/cookie";
import { User, UserType } from "@/models/user-model";

dotenv.config();

const SECRET = process.env.SECRET_JWT_CODE ?? "";

const Register = async (req: Request<{}, {}, UserType>, res: Response) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const { email, password, username } = req.body;
    const user = await User.create({
      email,
      password,
      username,
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
        const token = jwt.sign({ username: user.username }, SECRET, {
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

const IsSessionvValid = async (req: Request, res: Response) => {
  try {
    res.json(true);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export { IsSessionvValid, Login, Logout, Register };
