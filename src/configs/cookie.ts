import { CookieOptions } from "express";
import dotenv from "dotenv";

dotenv.config();

const cookieConfig: CookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 60 * 1000 * 60 * 100000),
  sameSite: process.env.SECURE === "True" ? "none" : "lax",
  secure: process.env.SECURE ? process.env.SECURE === "True" : false
};

export default cookieConfig;
