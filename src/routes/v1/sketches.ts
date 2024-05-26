import { Router } from "express";

import { Create, Get, GetById, Update } from "@/controllers/sketches";

const sketchRouter = Router();

sketchRouter.get("/sketches", Get);

sketchRouter.get("/sketch/:id", GetById);

sketchRouter.post("/create", Create);

sketchRouter.post("/update/:id", Update);

export default sketchRouter;
