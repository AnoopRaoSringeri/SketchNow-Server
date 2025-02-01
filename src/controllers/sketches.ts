import { Request, Response } from "express";
import fs from "fs";

import { AppConfig } from "../configs";
import getCurrentSession from "../middlewares/session";
import {
  Sketch,
  SketchType,
  SketchUpdateRequest,
} from "../models/sketch-model";
import { RedisClient } from "../services/redis";
import { tryCatch } from "../utils/try-catch";

const Get = tryCatch(async (req: Request, res: Response) => {
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
});

const GetById = tryCatch(async (req: Request, res: Response) => {
  const session = await getCurrentSession(req);
  if (session) {
    const sketch = await Sketch.findById(req.params.id);
    res.status(200).json(sketch);
  }
});

const GetImageData = tryCatch(async (req: Request, res: Response) => {
  const session = await getCurrentSession(req);
  if (session) {
    const dataUrl = await RedisClient.get(req.params.id.toString());
    res.status(200).json(dataUrl);
  }
});

const Create = tryCatch(
  async (req: Request<{}, {}, SketchType>, res: Response) => {
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
  },
);

const Update = tryCatch(
  async (
    req: Request<{ id: string }, {}, SketchUpdateRequest>,
    res: Response,
  ) => {
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
  },
);

const Delete = tryCatch(
  async (req: Request<{ id: string }, {}, SketchType>, res: Response) => {
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
  },
);

export { Create, Delete, Get, GetById, GetImageData, Update };
