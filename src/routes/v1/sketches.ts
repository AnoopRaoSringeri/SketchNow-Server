import { Router } from "express";

import { Create, Get } from "@/controllers/sketches";

const sketchRouter = Router();

sketchRouter.get("/sketces", Get);

sketchRouter.post("/create", Create);

export default sketchRouter;
