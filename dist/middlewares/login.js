"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET = (_a = process.env.SECRET_JWT_CODE) !== null && _a !== void 0 ? _a : "";
const isLoggedIn = async (req, res, next) => {
    try {
        // const { token } = req.cookies;
        // if (token) {
        //   const payload = await jwt.verify(token, SECRET);
        //   if (payload) {
        //     next();
        //   } else {
        //     res.status(401).json({ error: "token verification failed" });
        //   }
        // } else {
        //   res.status(401).json({ error: "No authorization header" });
        // }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
};
exports.default = isLoggedIn;
