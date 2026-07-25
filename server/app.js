require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
import connectMongo from "./config/mongodb.config";
import errorMiddleware from "./middleware/error.middleware";
const { connectMySQL } = require("./config/mysql.config");
const corsOptions = require("./config/cors.config");

const app = express();

// Kết nối DB
connectMongo();
connectMySQL();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api", require("./routes/index"));

// Error middleware
app.use(errorMiddleware);

module.exports = app;
