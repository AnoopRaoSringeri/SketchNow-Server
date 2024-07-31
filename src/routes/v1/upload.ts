import { Router } from "express";

import { GetData, Upload } from "../../controllers/file-upload";
import { upload } from "../../middlewares/upload";

const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("file"), Upload);

uploadRouter.get("/data/:id", GetData);

export default uploadRouter;
