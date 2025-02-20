"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordPage = exports.ResetPassword = exports.Register = exports.Public = exports.Logout = exports.Login = exports.IsSessionValid = exports.ForgotPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("../configs/cookie"));
const mailer_1 = require("../middlewares/mailer");
const session_1 = __importDefault(require("../middlewares/session"));
const user_model_1 = require("../models/user-model");
const try_catch_1 = require("../utils/try-catch");
dotenv_1.default.config();
const SECRET = (_a = process.env.SECRET_JWT_CODE) !== null && _a !== void 0 ? _a : "";
const Public = async (req, res) => {
    res.send("Hiii");
};
exports.Public = Public;
const Register = (0, try_catch_1.tryCatch)(async (req, res) => {
    req.body.password = await bcryptjs_1.default.hash(req.body.password, 10);
    const { email, password, username } = req.body;
    const user = await user_model_1.User.create({
        email,
        password,
        username,
    });
    await (0, mailer_1.sendEmailAsTemplate)({
        to: email,
        subject: "Welcome to SketchNow",
        template: "welcome",
        text: "Welcome to SketchNow",
        data: {
            username,
        },
    });
    res.json(user);
});
exports.Register = Register;
const Login = (0, try_catch_1.tryCatch)(async (req, res) => {
    const user = await user_model_1.User.findOne({ username: req.body.username });
    if (user) {
        const result = await bcryptjs_1.default.compare(req.body.password, user.password);
        if (result) {
            const { email, username, password, _id } = user;
            const token = jsonwebtoken_1.default.sign({ email, username, password, _id }, SECRET, {
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
});
exports.Login = Login;
const Logout = (0, try_catch_1.tryCatch)(async (req, res) => {
    res.clearCookie("token");
    res.json(true);
});
exports.Logout = Logout;
const ForgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await user_model_1.User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "User doesn't exist" });
    }
    try {
        const resetToken = user.createResetPasswordToken();
        user.save();
        const resetUrl = `${req.protocol}://${req.get("host")}/resetPasswordPage/${resetToken}`;
        const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}`;
        await (0, mailer_1.sendEmail)({
            to: email,
            subject: "Reset password request received",
            text: message,
        });
        return res.json(true);
    }
    catch (error) {
        res.status(400).json({ error });
        user.passwordResetToken = null;
        user.passwordResetTokenExpires = null;
        await user.save();
        return res.json(false);
    }
};
exports.ForgotPassword = ForgotPassword;
const ResetPasswordPage = (0, try_catch_1.tryCatch)(async (req, res) => {
    const { token } = req.params;
    const decodedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await user_model_1.User.findOne({
        passwordResetToken: decodedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(400).json({ error: "Token expired" });
    }
    return res.render("forgot-password", { token, error: "" });
});
exports.ResetPasswordPage = ResetPasswordPage;
const ResetPassword = (0, try_catch_1.tryCatch)(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.render("forgot-password", {
            token,
            error: "Password not matching",
        });
    }
    const decodedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await user_model_1.User.findOne({
        passwordResetToken: decodedToken,
        passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(400).json({ error: "Token expired" });
    }
    user.password = await bcryptjs_1.default.hash(password, 10);
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = Date.now();
    await user.save();
    return res.json(true);
});
exports.ResetPassword = ResetPassword;
const IsSessionValid = (0, try_catch_1.tryCatch)(async (req, res) => {
    const session = await (0, session_1.default)(req);
    res.json(session);
});
exports.IsSessionValid = IsSessionValid;
