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
exports.Register = exports.Logout = exports.Login = exports.IsSessionvValid = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("@/configs/cookie"));
const user_model_1 = require("@/models/user-model");
dotenv_1.default.config();
const SECRET = (_a = process.env.SECRET_JWT_CODE) !== null && _a !== void 0 ? _a : "";
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.password = yield bcryptjs_1.default.hash(req.body.password, 10);
        const { email, password, username } = req.body;
        const user = yield user_model_1.User.create({
            email,
            password,
            username,
        });
        res.json(user);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findOne({ username: req.body.username });
        if (user) {
            const result = yield bcryptjs_1.default.compare(req.body.password, user.password);
            if (result) {
                const token = jsonwebtoken_1.default.sign({ username: user.username }, SECRET, {
                    expiresIn: "24h",
                });
                res.cookie("token", token, cookie_1.default);
                res.status(200).json({ token });
            }
            else {
                res.status(400).json({ error: "password doesn't match" });
            }
        }
        else {
            res.status(400).json({ error: "User doesn't exist" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
});
exports.Login = Login;
const Logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("token");
        res.json(true);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.Logout = Logout;
const IsSessionvValid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.json(true);
    }
    catch (error) {
        res.status(400).json({ error });
    }
});
exports.IsSessionvValid = IsSessionvValid;
