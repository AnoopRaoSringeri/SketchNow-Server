import multer from "multer";
import { AppConfig } from "../configs";
import path from "path";
import fs from "fs";
import { ObjectId } from "mongodb";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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
