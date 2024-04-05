import cors from "cors";
import dotenv from "dotenv";
import { Request, Response, Router } from "express";

import Sketch from "@/models/sketch-model";

dotenv.config();

const sketcRouter = Router();

sketcRouter.use(cors());

sketcRouter.get("/sketces", (req: Request, res: Response) => {
  console.log("Request received");
  res.send("Express + TypeScript Server");
});

sketcRouter.post("/create", async (req: Request, res: Response) => {
  try {
    console.log("Request received", req.body);

    const sketch = await Sketch.create({
      name: "Sketch 1",
      metadata: req.body,
      createdBy: "grg",
    });
    res.status(200).json(sketch);
  } catch (error) {
    console.log(error);

    res.status(400).json({ error });
  }
});

export default sketcRouter;
