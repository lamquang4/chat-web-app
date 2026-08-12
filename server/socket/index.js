// socket/index.js
const { Server } = require("socket.io");
const socketMiddleware = require("./socket.middleware");
const registerPresenceHandlers = require("./presence.socket");
const registerMessageHandlers = require("./message.socket");
const registerConversationHandlers = require("./conversation.socket");

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.use(socketMiddleware);

  io.on("connection", async (socket) => {
    await registerPresenceHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerConversationHandlers(io, socket);
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.IO chưa được khởi tạo");
  return io;
};

module.exports = { initSocket, getIO };