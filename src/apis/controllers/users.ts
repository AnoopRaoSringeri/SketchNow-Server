import bcrypt from "bcryptjs";
import { Router } from "express";
import jwt from "jsonwebtoken";

import isLoggedIn from "@/middlewares/login";
import { User } from "@/models/user-model";

const userRouter = Router();

const SECRET = process.env.SECRET_JWT_CODE ?? "";

userRouter.post("/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error });
  }
});

userRouter.post("/login", async (req, res) => {
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
});

userRouter.get("/logout", isLoggedIn, async (req, res) => {
  try {
    res.clearCookie("token");
    res.json(true);
  } catch (error) {
    res.status(400).json({ error });
  }
});

userRouter.get("/", isLoggedIn, async (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    res.status(400).json({ error });
  }
});

export default userRouter;
