import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();

const app: Express = express();

app.use(cors());

app.get("/sketces", (req: Request, res: Response) => {
  console.log("Request received");
  res.send("Express + TypeScript Server");
});

app.post("/create", (req: Request, res: Response) => {
  console.log("Request received");
  res.send("Express + TypeScript Server");
});
