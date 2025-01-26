"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const serverOptions = {
    key: fs_1.default.existsSync("../../cert/key.pem")
        ? fs_1.default.readFileSync("../../cert/key.pem")
        : "",
    cert: fs_1.default.existsSync("../../cert/cert.pem")
        ? fs_1.default.readFileSync("../../cert/cert.pem")
        : "",
};
exports.default = serverOptions;
