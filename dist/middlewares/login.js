"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const SECRET = (_a = process.env.SECRET_JWT_CODE) !== null && _a !== void 0 ? _a : "";
const isLoggedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.cookies;
        if (token) {
            const payload = yield jsonwebtoken_1.default.verify(token, SECRET);
            if (payload) {
                next();
            }
            else {
                res.status(401).json({ error: "token verification failed" });
            }
        }
        else {
            res.status(401).json({ error: "No authorization header" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});
exports.default = isLoggedIn;
