"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const hbs_1 = __importDefault(require("hbs"));
const https_1 = __importDefault(require("https"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const configs_1 = require("./configs");
const error_handler_1 = require("./middlewares/error-handler");
const login_1 = __importDefault(require("./middlewares/login"));
const v1_1 = require("./routes/v1");
const visualize_1 = __importDefault(require("./routes/v1/visualize"));
const db_1 = require("./services/db");
const redis_1 = require("./services/redis");
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "100mb" }));
app.use(express_1.default.urlencoded({ limit: "100mb", extended: true }));
app.use((0, cors_1.default)(configs_1.corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(error_handler_1.errorHandler);
app.set("view engine", "html");
app.set("views", path_1.default.join(__dirname, "views"));
app.engine("html", hbs_1.default.__express);
app.use("/", v1_1.authRouter);
app.use(login_1.default);
app.use("/", v1_1.sketchRouter);
app.use("/", visualize_1.default);
const start = async () => {
    try {
        await db_1.DuckDBService.init();
        await mongoose_1.default.connect(`mongodb+srv://SketchNow:${process.env.MONGO_PASSWORD}@phoenix.jhaaso5.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`);
        if (configs_1.AppConfig.IsDevelopment()) {
            https_1.default.createServer(configs_1.serverOptions, app).listen(port, () => {
                console.log(`Server started on port ${port}`);
            });
            await redis_1.RedisClient.connect();
            const res = await db_1.DuckDBService.executeQuery("SHOW TABLES");
            const data = await res.getRowObjectsJson();
            console.log(data);
        }
        else {
            app.listen(port, () => {
                console.log(`App is Listening on PORT ${port}`);
            });
        }
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
try {
    start();
}
catch (e) {
    console.error(e, "Restarting...");
    start();
}
