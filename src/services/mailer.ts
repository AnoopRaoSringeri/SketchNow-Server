import dotenv from "dotenv";
import nodemailer from "nodemailer";

import { transportDev, transportProd } from "../configs/mailer";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport(
  isProd ? transportProd : transportDev,
);

export default transporter;
