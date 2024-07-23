import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import {
  SendEmailRequest,
  SendEmailWithTemplateRequest,
} from "../models/helper-models/mail";
import transporter from "../services/mailer";

dotenv.config();

const sendEmail = async ({ to, subject, text }: SendEmailRequest) => {
  try {
    await transporter.sendMail(
      {
        from: process.env.EMAIL,
        to,
        subject,
        text,
      },
      (err, info) => {
        console.log("Error: ", err);
        console.log("Info: ", info);
      },
    );

    console.log(`email sent sucessfully from ${process.env.EMAIL} to ${to}`);
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
