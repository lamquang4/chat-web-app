const mongoose = require("mongoose");
const config = require("../app.config");

const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("[MONGODB] MongoDB đã kết nối");
  } catch (error) {
    console.error("[MONGODB] Lỗi: ", error.message);
    throw error;
  }
};

mongoose.connection.on("error", (err) => {
  console.error("[MONGODB] Lỗi: ", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("[MONGODB] MongoDB mất kết nối");
});

module.exports = { mongoose, connectMongo };
