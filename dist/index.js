"use strict";
/* eslint-disable no-console */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const configs_1 = require("./configs");
const v1_1 = require("./routes/v1");
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(configs_1.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use("/", v1_1.authRouter);
// app.use(isLoggedIn);
app.use("/", v1_1.sketchRouter);
const start = async () => {
    try {
        await mongoose_1.default.connect(`mongodb+srv://SketchNow:${process.env.MONGO_PASSWORD}@phoenix.jhaaso5.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`);
        // https.createServer(serverOptions, app).listen(port, () => {
        //   console.log(`Server started on port ${port}`);
        // });
        app.listen(port, () => {
            console.log(`App is Listening on PORT ${port}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start();
