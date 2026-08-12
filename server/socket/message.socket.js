const EVENTS = require("./events");

const notifyNewMessage = (io, memberIds, senderId, messagePayload) => {
  memberIds
    .filter((id) => String(id) !== String(senderId))
    .forEach((memberId) => {
      io.to(`user:${memberId}`).emit(EVENTS.MESSAGE_NEW, messagePayload);
    });
};

const notifyMessageRecalled = (io, memberIds, actorId, payload) => {
  memberIds
    .filter((id) => String(id) !== String(actorId))
    .forEach((memberId) => {
      io.to(`user:${memberId}`).emit(EVENTS.MESSAGE_RECALLED, payload);
    });
};

const registerMessageHandlers = (io, socket) => {
  socket.on("message:typing", ({ conversation_id }) => {
    socket.to(`conversation:${conversation_id}`).emit("message:typing", {
      user_id: socket.userId,
      conversation_id,
    });
  });

  socket.on("message:typing:stop", ({ conversation_id }) => {
    socket.to(`conversation:${conversation_id}`).emit("message:typing:stop", {
      user_id: socket.userId,
      conversation_id,
    });
  });
};

module.exports = {
  notifyNewMessage,
  notifyMessageRecalled,
  registerMessageHandlers,
};
