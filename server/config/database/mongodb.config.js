const mongoose = require("mongoose");
const config = require("../app.config");

const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongodb.uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

module.exports = { mongoose, connectMongo };
