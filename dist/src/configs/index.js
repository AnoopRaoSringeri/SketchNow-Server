"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = exports.serverOptions = exports.corsOptions = void 0;
const cors_1 = __importDefault(require("./cors"));
exports.corsOptions = cors_1.default;
const server_1 = __importDefault(require("./server"));
exports.serverOptions = server_1.default;
const app_config_1 = require("./app-config");
Object.defineProperty(exports, "AppConfig", { enumerable: true, get: function () { return app_config_1.AppConfig; } });
