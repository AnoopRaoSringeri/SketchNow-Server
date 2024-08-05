import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 14628,
  },
});

export { client as RedisClient };
