"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const file_upload_1 = require("../../controllers/file-upload");
const upload_1 = require("../../middlewares/upload");
const uploadRouter = (0, express_1.Router)();
uploadRouter.post("/upload", upload_1.upload.single("file"), file_upload_1.Upload);
uploadRouter.get("/data/:id", file_upload_1.GetData);
exports.default = uploadRouter;
