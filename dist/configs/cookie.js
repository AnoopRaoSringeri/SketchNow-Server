"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cookieConfig = {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000 * 60 * 100000),
    sameSite: "none",
};
exports.default = cookieConfig;
