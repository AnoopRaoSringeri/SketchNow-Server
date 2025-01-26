"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Number,
}, {
    methods: {
        createResetPasswordToken() {
            const resetToken = crypto_1.default.randomBytes(32).toString("hex");
            this.passwordResetToken = crypto_1.default
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");
            this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
            return resetToken;
        },
    },
});
// UserSchema.methods.createResetPasswordToken = function () {
//   const resetToken = crypto.randomBytes(32).toString("hex");
//   this.passwordResetTokenExpires = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");
//   this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
//   return resetToken;
// };
const User = (0, mongoose_1.model)("user", UserSchema);
exports.User = User;
