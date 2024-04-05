import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express } from "express";
import fs from "fs";
import https from "https";
import mongoose from "mongoose";

import userRouter from "@/apis/controllers/users";

import sketcRouter from "./apis/routes/sketches";
import isLoggedIn from "./middlewares/login";

dotenv.config();

const port = process.env.PORT;
// const SECRET = process.env.SECRET_JWT_CODE ?? "";

const options = {
  key: fs.readFileSync("../cert/key.pem"), // replace it with your key path
  cert: fs.readFileSync("../cert/cert.pem"), // replace it with your certificate path
};

const app: Express = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://localhost:3000",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/", userRouter);
app.use(isLoggedIn);
app.use("/", sketcRouter);

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://SketchNow:${process.env.MONGO_PASSWORD}@phoenix.jhaaso5.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
    );
    https
      .createServer(options, app)
      .listen(port, () => console.log(`Server started on port ${port}`));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
