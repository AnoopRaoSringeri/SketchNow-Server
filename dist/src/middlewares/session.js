"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const SECRET = (_a = process.env.SECRET_JWT_CODE) !== null && _a !== void 0 ? _a : "";
const getCurrentSession = async (req) => {
    try {
        const { token } = req.cookies;
        if (token) {
            const payload = await jsonwebtoken_1.default.verify(token, SECRET);
            if (payload && typeof payload == "object") {
                const { email, username, password, _id } = payload;
                return { email, username, password, _id };
            }
            return null;
        }
        return null;
    }
    catch (error) {
        return null;
    }
};
exports.default = getCurrentSession;
