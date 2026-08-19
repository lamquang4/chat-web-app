const { Server } = require("socket.io");
const config = require("../config/app.config");
const socketMiddleware = require("./socket.middleware");
const registerPresenceHandlers = require("./presence.socket");
const registerMessageHandlers =
  require("./message.socket").registerMessageHandlers;

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.cors.allowedOrigins,
      credentials: true,
    },
  });

  io.use(socketMiddleware);

  io.on("connection", async (socket) => {
    await registerPresenceHandlers(io, socket);
    registerMessageHandlers(io, socket);
  });

  return io;
};

const getIO = () => {
  return io;
};

module.exports = { initSocket, getIO };
