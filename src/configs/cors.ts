import dotenv from "dotenv";

dotenv.config();

const corsOptions = {
  origin: process.env.APPLICATION_URL,
  credentials: true,
};

export default corsOptions;
