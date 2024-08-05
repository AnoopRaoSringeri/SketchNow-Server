import { Router } from "express";

import {
  Create,
  Delete,
  Get,
  GetById,
  GetImageData,
  Update,
} from "../../controllers/sketches";

const sketchRouter = Router();

sketchRouter.get("/sketches", Get);

sketchRouter.get("/sketch/:id", GetById);

sketchRouter.get("/imageData/:id", GetImageData);

sketchRouter.post("/create", Create);

sketchRouter.post("/update/:id", Update);

sketchRouter.delete("/delete/:id", Delete);

export default sketchRouter;
