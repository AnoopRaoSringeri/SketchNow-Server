/* eslint-disable no-console */

import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import https from "https";
import mongoose from "mongoose";

import { corsOptions, serverOptions } from "./configs";
import isLoggedIn from "./middlewares/login";
import { authRouter, sketchRouter } from "./routes/v1";

dotenv.config();
const port = process.env.PORT;
const app: Express = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/", authRouter);

app.use(isLoggedIn);

app.use("/", sketchRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://SketchNow:${process.env.MONGO_PASSWORD}@phoenix.jhaaso5.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
    );
    https.createServer(serverOptions, app).listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
