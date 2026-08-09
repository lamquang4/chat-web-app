const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const corsOptions = require("./config/cors.config");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", require("./routes"));

app.use(errorMiddleware);

module.exports = app;
