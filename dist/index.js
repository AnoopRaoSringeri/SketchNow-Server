"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const https_1 = __importDefault(require("https"));
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("@/configs");
const server_1 = __importDefault(require("@/configs/server"));
const v1_1 = require("@/routes/v1");
const login_1 = __importDefault(require("./middlewares/login"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(configs_1.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use("/", v1_1.authRouter);
app.use(login_1.default);
app.use("/", v1_1.sketchRouter);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(`mongodb+srv://SketchNow:${process.env.MONGO_PASSWORD}@phoenix.jhaaso5.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`);
        https_1.default.createServer(server_1.default, app).listen(port, () => {
            console.log(`Server started on port ${port}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
start();
