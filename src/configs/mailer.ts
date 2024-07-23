import dotenv from "dotenv";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dotenv.config();

const transportDev: SMTPTransport | SMTPTransport.Options = {
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "bette15@ethereal.email",
    pass: "Gk1xXps8km7R22ssPM",
  },
  // service: "Gmail",
};

const transportProd: SMTPTransport | SMTPTransport.Options = {
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  service: "Gmail",
};

export { transportDev, transportProd };
