import dotenv from "dotenv";

dotenv.config();

const corsOptions = {
  origin: [
    process.env.APPLICATION_URL ?? "*",
    "https://localhost:3000",
    "https://sketchnow-client.onrender.com/",
  ],
  credentials: true,
};

export default corsOptions;
