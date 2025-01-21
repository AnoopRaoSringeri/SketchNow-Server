import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const client = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

export { client as RedisClient };
