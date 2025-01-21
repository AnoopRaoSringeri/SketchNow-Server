import { Router } from "express";

import { GetData, UpdateData, Upload } from "../../controllers/visualize";
import { upload } from "../../middlewares/upload";

const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("file"), Upload);

uploadRouter.post("/update", upload.single("file"), UpdateData);

uploadRouter.post("/data", GetData);

export default uploadRouter;
