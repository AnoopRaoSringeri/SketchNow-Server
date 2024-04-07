import { Request, Response } from "express";

import Sketch from "@/models/sketch-model";

const Get = (req: Request, res: Response) => {
  res.send("Get all sketckes");
};

const Create = async (req: Request, res: Response) => {
  try {
    const sketch = await Sketch.create({
      name: "Sketch 1",
      metadata: req.body,
      createdBy: "grg",
    });
    res.status(200).json(sketch);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export { Create, Get };
