const redis = require("redis");

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis✅");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis", err);
  });

process.on("SIGINT", async () => {
  await redisClient.quit();
  console.log("Redis connection closed");
  process.exit(0);
});

module.exports = { redisClient };
