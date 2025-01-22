import fs from "fs";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";

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
    const filePath = path.join(
      `${AppConfig.ChartsDataPath}/${req.body.id}.csv`,
    );
    if (req.body.id != null && fs.existsSync(filePath)) {
      cb(null, `${req.body.id}-tmp.csv`);
    } else {
      req.body.id = new ObjectId().toString("hex");
      cb(null, `${req.body.id}.csv`);
    }
  },
});

// Create the multer instance
const upload = multer({ storage });

export { upload };
