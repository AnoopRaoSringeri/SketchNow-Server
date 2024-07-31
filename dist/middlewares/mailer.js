"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailAsTemplate = exports.sendEmail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mailer_1 = __importDefault(require("../services/mailer"));
dotenv_1.default.config();
const sendEmail = async ({ to, subject, text }) => {
    try {
        await mailer_1.default.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
        }, (err, info) => {
            console.log("Error: ", err);
            console.log("Info: ", info);
        });
        console.log(`email sent sucessfully from ${process.env.EMAIL} to ${to}`);
    }
    catch (error) {
        console.log(error, "email not sent");
    }
};
exports.sendEmail = sendEmail;
const sendEmailAsTemplate = async ({ to, subject, text, template, }) => {
    try {
        const p = path_1.default.join("C:\\My-Projects\\Apps\\SketchNow\\SketchNow-Server\\src\\templates", `${template}.html`);
        const htmlstream = fs_1.default.createReadStream(p);
        await mailer_1.default.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            text,
            html: htmlstream,
        });
        console.log("email sent sucessfully");
    }
    catch (error) {
        console.log(error, "email not sent");
    }
};
exports.sendEmailAsTemplate = sendEmailAsTemplate;
