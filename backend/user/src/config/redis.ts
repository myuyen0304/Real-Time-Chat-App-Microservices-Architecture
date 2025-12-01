import { createClient } from "redis";

// Kiểm tra REDIS_URL
const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  console.error("REDIS_URL is not defined in .env");
}

export const redisClient = createClient({
  url: REDIS_URL || "redis://localhost:6379",
  socket: {
    tls: true, // Upstash yêu cầu TLS
    rejectUnauthorized: false,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Too many Redis connection retries");
        return new Error("Too many retries");
      }
      return Math.min(retries * 100, 3000); // Exponential backoff, max 3s
    },
  },
});

// Event listeners
redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("Connected to Redis");
});

redisClient.on("reconnecting", () => {
  console.log("Reconnecting to Redis...");
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

export const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error: any) {
    console.error("Failed to connect to Redis:", error.message);
    // Không throw để server vẫn chạy
  }
};
