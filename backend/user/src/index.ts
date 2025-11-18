import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import {createClient} from "redis";
import userRouter from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/v1", userRouter);

app.use(cors());
connectDB();
connectRabbitMQ();

export const redisClient = createClient({
  url: process.env.REDIS_URL as string,
});
redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch(console.error);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


