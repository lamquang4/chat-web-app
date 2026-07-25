const mongoose = require("mongoose");
const config = require("./app.config");

const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      maxPoolSize: 10, // số connection tối đa
      serverSelectionTimeoutMS: 5000, // timeout khi không connect được server
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

module.exports = connectMongo;
