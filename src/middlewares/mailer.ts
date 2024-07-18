import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import {
  SendEmailRequest,
  SendEmailWithTemplateRequest,
} from "src/models/helper-models/mail";
import transporter from "src/services/mailer";

dotenv.config();

const sendEmail = async ({ to, subject, text }: SendEmailRequest) => {
  try {
    // const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   auth: {
    //     user: "bette15@ethereal.email",
    //     pass: "Gk1xXps8km7R22ssPM",
    //   },
    // });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

const sendEmailAsTemplate = async ({
  to,
  subject,
  text,
  template,
}: SendEmailWithTemplateRequest) => {
  try {
    const p = path.join(
      "C:\\My-Projects\\Apps\\SketchNow\\SketchNow-Server\\src\\templates",
      `${template}.html`,
    );
    const htmlstream = fs.createReadStream(p);

    await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject,
      text,
      html: htmlstream,
    });

    console.log("email sent sucessfully");
  } catch (error) {
    console.log(error, "email not sent");
  }
};

export { sendEmail, sendEmailAsTemplate };
