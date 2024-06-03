import { Request, Response } from "express";

import { Sketch, SketchType } from "@/models/sketch-model";

const Get = async (req: Request, res: Response) => {
  try {
    const sketches = await Sketch.find({});
    res.status(200).json(sketches);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const GetById = async (req: Request, res: Response) => {
  try {
    const sketch = await Sketch.findById(req.params.id);
    res.status(200).json(sketch);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const Create = async (req: Request<{}, {}, SketchType>, res: Response) => {
  try {
    const { name, createdBy, metadata } = req.body;
    const sketch = await Sketch.create({
      name,
      metadata,
      createdBy,
    });
    res.status(200).json(sketch);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const Update = async (
  req: Request<{ id: string }, {}, SketchType>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { name, createdBy, metadata } = req.body;
    await Sketch.updateOne(
      { _id: id },
      {
        name,
        metadata,
        createdBy,
      },
    );
    res.status(200).json(true);
  } catch (error) {
    res.status(400).json({ error });
  }
};

const Delete = async (
  req: Request<{ id: string }, {}, SketchType>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    await Sketch.deleteOne({ _id: id });
    res.status(200).json(true);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export { Create, Delete, Get, GetById, Update };
