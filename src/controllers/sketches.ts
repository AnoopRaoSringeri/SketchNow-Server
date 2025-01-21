import { Request, Response } from "express";

import getCurrentSession from "../middlewares/session";
import {
  Sketch,
  SketchType,
  SketchUpdateRequest,
} from "../models/sketch-model";
import { RedisClient } from "../services/redis";
import fs from "fs";
import { AppConfig } from "../configs";

const Get = async (req: Request, res: Response) => {
  try {
    const session = await getCurrentSession(req);
    if (session) {
      const { _id } = session;
      const dbSketches = await Sketch.find({ createdBy: _id }).select([
        "_id",
        "name",
        "createdBy",
        "createdOn",
      ]);
      res.status(200).json(dbSketches);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const GetById = async (req: Request, res: Response) => {
  try {
    const session = await getCurrentSession(req);
    if (session) {
      const sketch = await Sketch.findById(req.params.id);
      res.status(200).json(sketch);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const GetImageData = async (req: Request, res: Response) => {
  try {
    const session = await getCurrentSession(req);
    if (session) {
      const dataUrl = await RedisClient.get(req.params.id.toString());
      res.status(200).json(dataUrl);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const Create = async (req: Request<{}, {}, SketchType>, res: Response) => {
  try {
    const { name, metadata, dataUrl } = req.body;
    const session = await getCurrentSession(req);
    if (session) {
      const { _id } = session;
      const sketch = await Sketch.create({
        name,
        metadata,
        createdBy: _id,
      });
      await RedisClient.set(sketch._id.toString(), dataUrl ?? "");
      res.status(200).json(sketch);
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

const Update = async (
  req: Request<{ id: string }, {}, SketchUpdateRequest>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const { name, metadata, dataUrl } = req.body;
    await Sketch.updateOne(
      { _id: id },
      {
        name,
        metadata,
      },
    );
    await RedisClient.set(id, dataUrl ?? "");
    metadata.deletedSources.forEach((deletedSource) => {
      fs.unlink(`${AppConfig.ChartsDataPath}/${deletedSource}.csv`, () => {
        //
      });
    });
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
    const sketch = await Sketch.findById<SketchType>(req.params.id);
    sketch?.metadata.elements.forEach((data) => {
      if (data.type == "chart") {
        const { metadata: chartMetadata } = data.value;
        if (chartMetadata.source.type == "File") {
          fs.unlink(
            `${AppConfig.ChartsDataPath}/${chartMetadata.source.id}.csv`,
            () => {
              //
            },
          );
        }
      }
    });
    await Sketch.deleteOne({ _id: id });
    res.status(200).json(true);
  } catch (error) {
    res.status(400).json({ error });
  }
};

export { Create, Delete, Get, GetById, GetImageData, Update };
