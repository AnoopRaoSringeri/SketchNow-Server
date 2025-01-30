import fs from "fs";
import { ObjectId } from "mongodb";
import multer from "multer";

import { AppConfig } from "../configs";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(AppConfig.ChartsDataPath)) {
      fs.mkdirSync(AppConfig.ChartsDataPath);
    }
    cb(null, AppConfig.ChartsDataPath);
  },
  filename: (req, file, cb) => {
    const extension = ".csv";
    if (req.body.id == null) {
      req.body.id = new ObjectId().toString("hex");
    }
    cb(null, `${req.body.id}-tmp${extension}`);
  },
});

// Create the multer instance
const upload = multer({ storage });

export { upload };
