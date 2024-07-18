"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
const path_1 = __importDefault(require("path"));
const getView = (view, obj) => {
    const p = path_1.default.join("C:\\My-Projects\\Apps\\SketchNow\\SketchNow-Server\\src\\views", `${view}.html`);
    const htmlstream = fs_1.default.createReadStream(p);
    const template = handlebars_1.default.compile(htmlstream);
    return template(obj);
};
exports.default = getView;
