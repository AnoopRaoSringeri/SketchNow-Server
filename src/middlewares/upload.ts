import multer from "multer";

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${req.body.id}.csv`);
  },
});

// Create the multer instance
const upload = multer({ storage });

export { upload };
