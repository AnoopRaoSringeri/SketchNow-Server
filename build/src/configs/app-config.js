"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const appsettings_developmnet_json_1 = __importDefault(require("../../appsettings.developmnet.json"));
const appsettings_docker_json_1 = __importDefault(require("../../appsettings.docker.json"));
const appsettings_json_1 = __importDefault(require("../../appsettings.json"));
dotenv_1.default.config();
let Config;
if (process.env.NODE_ENV == "development") {
    Config = appsettings_developmnet_json_1.default;
}
else if (process.env.NODE_ENV == "docker") {
    Config = appsettings_docker_json_1.default;
}
else {
    Config = appsettings_json_1.default;
}
class AppConfig {
    static Environment() {
        return process.env.NODE_ENV;
    }
    static IsDevelopment() {
        return process.env.NODE_ENV == "development";
    }
    static IsDocker() {
        return process.env.NODE_ENV == "docker";
    }
}
exports.AppConfig = AppConfig;
AppConfig.ChartsDataPath = Config.ChartsDataPath;
