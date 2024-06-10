import dotenv from "dotenv";

dotenv.config();

const corsOptions = {
  origin: ["https://localhost:3000", "https://sketchnow-client.onrender.com/"],
};

export default corsOptions;
