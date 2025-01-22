"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transportProd = exports.transportDev = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transportDev = {
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "bette15@ethereal.email",
        pass: "Gk1xXps8km7R22ssPM",
    },
    // service: "Gmail",
};
exports.transportDev = transportDev;
const transportProd = {
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    service: "Gmail",
};
exports.transportProd = transportProd;
