"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailer_1 = require("../configs/mailer");
dotenv_1.default.config();
const isProd = process.env.NODE_ENV === "production";
const transporter = nodemailer_1.default.createTransport(mailer_1.transportProd);
exports.default = transporter;
