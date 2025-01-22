"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const mongodb_1 = require("mongodb");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
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
        const filePath = path_1.default.join(`${configs_1.AppConfig.ChartsDataPath}/${req.body.id}.csv`);
        if (req.body.id != null && fs_1.default.existsSync(filePath)) {
            cb(null, `${req.body.id}-tmp.csv`);
        }
        else {
            req.body.id = new mongodb_1.ObjectId().toString("hex");
            cb(null, `${req.body.id}.csv`);
        }
    },
});
// Create the multer instance
const upload = (0, multer_1.default)({ storage });
exports.upload = upload;
