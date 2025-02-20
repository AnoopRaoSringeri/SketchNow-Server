"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const mongodb_1 = require("mongodb");
const multer_1 = __importDefault(require("multer"));
const configs_1 = require("../configs");
// Set up storage for uploaded files
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        if (!fs_1.default.existsSync(configs_1.AppConfig.ChartsDataPath)) {
            fs_1.default.mkdirSync(configs_1.AppConfig.ChartsDataPath);
        }
        cb(null, configs_1.AppConfig.ChartsDataPath);
    },
    filename: (req, file, cb) => {
        const extension = ".csv";
        if (req.body.id == null) {
            req.body.id = new mongodb_1.ObjectId().toString("hex");
        }
        cb(null, `${req.body.id}-tmp${extension}`);
    },
});
// Create the multer instance
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
