const EVENTS = require("./events");
const ConversationMember = require("../models/conversation-member.model");
const MessageSeen = require("../models/message-seen.model");
const User = require("../entities/user.entity");

const notifyNewMessage = (io, memberIds, senderId, message) => {
  memberIds
    .filter((id) => String(id) !== String(senderId))
    .forEach((memberId) => {
      io.to(`user:${memberId}`).emit(EVENTS.MESSAGE_NEW, message);
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
  socket.on(EVENTS.MESSAGE_SEEN, async ({ conversation_id, message_id }) => {
    try {
      const userId = socket.userId;

      const existing = await MessageSeen.findOne({
        message_id,
        user_id: userId,
      });
      if (existing) return;

      await MessageSeen.create({
        message_id,
        user_id: userId,
        seen_at: new Date(),
      });

      await ConversationMember.updateOne(
        { conversation_id, user_id: userId },
        { last_read_at: new Date() },
      );

      const [members, seenEntries] = await Promise.all([
        ConversationMember.find({ conversation_id }).lean(),
        MessageSeen.find({ message_id }).lean(),
      ]);

      const seenUsers = await User.findAll({
        where: { id: seenEntries.map((entry) => entry.user_id) },
      });
      const usersById = new Map(
        seenUsers.map((user) => [String(user.id), user]),
      );

      const payload = {
        message_id,
        seen_by: seenEntries
          .map((entry) => usersById.get(String(entry.user_id)))
          .filter(Boolean)
          .map((user) => ({
            user_id: String(user.id),
            first_name: user.first_name,
            last_name: user.last_name,
            avatar_url: user.avatar_url,
          })),
      };

      // Cùng pattern per-user room, KHÔNG dùng conversation:${id} room
      members.forEach((m) => {
        io.to(`user:${m.user_id}`).emit(EVENTS.MESSAGE_SEEN, {
          ...payload,
          conversation_id: String(conversation_id),
        });
      });
    } catch (err) {
      console.error("[SOCKET] Lỗi:", err.message);
    }
  });
};

module.exports = {
  registerMessageHandlers,
  notifyNewMessage,
  notifyMessageRecalled,
};
