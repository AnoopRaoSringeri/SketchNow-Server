import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "bette15@ethereal.email",
    pass: "Gk1xXps8km7R22ssPM",
  },
  // service: "Gmail",
});
export default transporter;
