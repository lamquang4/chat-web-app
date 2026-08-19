const EVENTS = require("./events");

const notifyConversationCreated = (
  io,
  memberIds,
  creatorId,
  conversationPayload,
) => {
  memberIds
    .filter((id) => String(id) !== String(creatorId))
    .forEach((memberId) => {
      io.to(`user:${memberId}`).emit(
        EVENTS.CONVERSATION_CREATED,
        conversationPayload,
      );
    });
};

const notifyConversationUpdated = (io, memberIds, actorId, payload) => {
  memberIds
    .filter((id) => String(id) !== String(actorId))
    .forEach((memberId) => {
      io.to(`user:${memberId}`).emit(EVENTS.CONVERSATION_UPDATED, payload);
    });
};

const notifyConversationDeleted = (io, memberIds, actorId, payload) => {
  memberIds
    .filter((id) => String(id) !== String(actorId))
    .forEach((memberId) => {
      io.to(`user:${memberId}`).emit(EVENTS.CONVERSATION_DELETED, payload);
    });
};

module.exports = {
  notifyConversationCreated,
  notifyConversationUpdated,
  notifyConversationDeleted,
};
