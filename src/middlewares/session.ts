import dotenv from "dotenv";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserWithId } from "src/models/user-model";

dotenv.config();

const SECRET = process.env.SECRET_JWT_CODE ?? "";

const getCurrentSession = async (req: Request): Promise<UserWithId | null> => {
  try {
    const { token } = req.cookies;
    if (token) {
      const payload = await jwt.verify(token, SECRET);
      if (payload && typeof payload == "object") {
        const { email, username, password, _id } = payload;
        return { email, username, password, _id };
      }
      return null;
    }
    return null;
  } catch (error) {
    return null;
  }
};
export default getCurrentSession;
