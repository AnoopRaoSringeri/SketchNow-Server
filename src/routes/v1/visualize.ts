import { Router } from "express";

import {
  GetData,
  GetSourceData,
  UpdateData,
  Upload,
} from "../../controllers/visualize";
import { upload } from "../../middlewares/upload";

const uploadRouter = Router();

uploadRouter.post("/upload", upload.single("file"), Upload);

uploadRouter.post("/update", upload.single("file"), UpdateData);

uploadRouter.post("/data", GetData);

uploadRouter.get("/sourceData/:sourceId", GetSourceData);

export default uploadRouter;
