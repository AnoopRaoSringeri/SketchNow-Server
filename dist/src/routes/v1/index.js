"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sketchRouter = exports.authRouter = void 0;
const auth_1 = __importDefault(require("./auth"));
exports.authRouter = auth_1.default;
const sketches_1 = __importDefault(require("./sketches"));
exports.sketchRouter = sketches_1.default;
