import { CookieOptions } from "express";

const cookieConfig: CookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 60 * 1000 * 60 * 100000),
  sameSite: "none",
  secure: true,
};

export default cookieConfig;
