"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corsOptions = {
    origin: [
        "https://sketchnow-client.onrender.com",
        "https://localhost:3000",
        "https://localhost:4200",
        "http://localhost:4200",
        "http://localhost:8000",
    ],
    credentials: true,
};
exports.default = corsOptions;
