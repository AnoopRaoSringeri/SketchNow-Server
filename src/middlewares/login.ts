import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

dotenv.config();

const SECRET = process.env.SECRET_JWT_CODE ?? "";

const isLoggedIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const payload = await jwt.verify(token, SECRET);
      if (payload) {
        next();
      } else {
        res.status(401).json({ error: "token verification failed" });
      }
    } else {
      res.status(401).json({ error: "No authorization header" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};
export default isLoggedIn;
