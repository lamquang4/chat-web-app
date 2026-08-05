require("dotenv").config();

const app = require("./app");
const config = require("./config/app.config");
const connectDatabases = require("./config/database/database.config");

async function startServer() {
  try {
    await connectDatabases();

    app.listen(config.port, () => {
      console.log(`Server running on ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
