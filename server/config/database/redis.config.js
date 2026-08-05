const { createClient } = require("redis");
const config = require("../app.config");

const redisClient = createClient({
  socket: {
    host: config.redis.host,
    port: config.redis.port,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis reconnecting fail");
      }
      return Math.min(retries * 100, 3000);
    },
  },
  password: config.redis.password,
  database: config.redis.database,
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err.message);
});

redisClient.on("reconnecting", () => {
  console.warn("Redis reconnecting...");
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error("Redis connection error:", error.message);
    throw error;
  }
};

module.exports = { redisClient, connectRedis };
