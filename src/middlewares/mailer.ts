import dotenv from "dotenv";
import fs from "fs";
import { handlebars } from "hbs";
import path from "path";

import {
  SendEmailRequest,
  SendEmailWithTemplateRequest,
} from "../models/helper-models/mail";
import transporter from "../services/mailer";

dotenv.config();

const readHTMLFile = function (
  contentPath: string,
  callback: (err: Error | null, html?: string) => unknown,
) {
  fs.readFile(contentPath, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

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
  data,
}: SendEmailWithTemplateRequest) => {
  try {
    const p = path.join(
      "C:\\My-Projects\\Apps\\SketchNow\\SketchNow-Server\\src\\templates",
      `${template}.html`,
    );
    readHTMLFile(p, async (err, html) => {
      if (err) {
        console.log("error reading file", err);
        return;
      }
      const compiledTemplate = handlebars.compile(html);
      const htmlToSend = compiledTemplate(data);
      await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html: htmlToSend,
      });

      console.log("email sent sucessfully");
    });
  } catch (error) {
    console.log(error, "email not sent");
  }
};

export { sendEmail, sendEmailAsTemplate };
