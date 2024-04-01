import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import api from "./apis/index";
import { User } from "./models/user-model";

dotenv.config();

const port = process.env.PORT;

const app: Express = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", api);
app.get("/", async (req: Request, res: Response) => {
  // const data = await User.create({
  //   name: "Anoop",
  //   email: "anoopginigini@gmail.com",
  //   password: "Anoop",
  // });
  // console.log("Request received");
  // console.log("User created: ", data);
  res.send("Express + TypeScript Server");
});

const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://SketchNow:${process.env.MONGO_PASSWORD}@phoenix.jhaaso5.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
    );
    app.listen(port, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
