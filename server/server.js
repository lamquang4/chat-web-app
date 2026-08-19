require("dotenv").config();
const app = require("./app");
const http = require("http");
const config = require("./config/app.config");
const connectDatabases = require("./config/database/database.config");
const startSessionCleanupJob = require("./jobs/cleanup-sessions.job");
const startOtpCleanupJob = require("./jobs/cleanup-otps.job");
const { initSocket } = require("./socket");

async function startServer() {
  try {
    await connectDatabases();

    startSessionCleanupJob();
    startOtpCleanupJob();

    const server = http.createServer(app);
    initSocket(server);

    server.listen(config.port, () => {
      console.log(`[SERVER] Server chạy cổng ${config.port}`);
    });
  } catch (error) {
    console.error("[SERVER] Lỗi: ", error);
    process.exit(1);
  }
}

startServer();
