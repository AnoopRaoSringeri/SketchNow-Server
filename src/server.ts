import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import hbs from "hbs";
import https from "https";
import mongoose from "mongoose";
import path from "path";

import { AppConfig, corsOptions, serverOptions } from "./configs";
import { errorHandler } from "./middlewares/error-handler";
import isLoggedIn from "./middlewares/login";
import { authRouter, sketchRouter } from "./routes/v1";
import uploadRouter from "./routes/v1/visualize";
import { DuckDBService } from "./services/db";
import { RedisClient } from "./services/redis";

dotenv.config();
const port = process.env.PORT;
const app: Express = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(errorHandler);

app.set("view engine", "html");
app.set("views", path.join(__dirname, "views"));
app.engine("html", hbs.__express);

app.use("/", authRouter);

app.use(isLoggedIn);

app.use("/", sketchRouter);

app.use("/", uploadRouter);

const start = async () => {
  try {
    await DuckDBService.init();
    await mongoose.connect(
      `mongodb+srv://SketchNow:${process.env.MONGO_PASSWORD}@phoenix.jhaaso5.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
    );

    if (AppConfig.IsDevelopment()) {
      https.createServer(serverOptions, app).listen(port, () => {
        console.log(`Server started on port ${port}`);
      });
    } else {
      app.listen(port, () => {
        console.log(`App is Listening on PORT ${port}`);
      });
      await RedisClient.connect();
      const res = await DuckDBService.executeQuery("SHOW TABLES");
      const data = await res.getRowObjectsJson();

      console.log(data);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
try {
  start();
} catch (e) {
  console.error(e, "Restarting...");
  start();
}
