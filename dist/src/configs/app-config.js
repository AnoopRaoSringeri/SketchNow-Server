"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const appsettings_developmnet_json_1 = __importDefault(require("../../appsettings.developmnet.json"));
const appsettings_json_1 = __importDefault(require("../../appsettings.json"));
dotenv_1.default.config();
const Config = process.env.NODE_ENV == "development" ? appsettings_developmnet_json_1.default : appsettings_json_1.default;
class AppConfig {
    static IsDevelopment() {
        return process.env.NODE_ENV == "development";
    }
}
exports.AppConfig = AppConfig;
AppConfig.ChartsDataPath = Config.ChartsDataPath;
