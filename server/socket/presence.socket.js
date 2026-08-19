const { addUser, removeUser } = require("./online-users");
const Friend = require("../entities/friend.entity");
const { Op } = require("sequelize");
const EVENTS = require("./events");

// Lấy danh sách userId là bạn bè của 1 user
const getFriendIds = async (userId) => {
  const friends = await Friend.findAll({
    where: {
      status: "accepted",
      [Op.or]: [{ requester_id: userId }, { receiver_id: userId }],
    },
  });

  return friends.map((f) =>
    String(f.requester_id) === String(userId) ? f.receiver_id : f.requester_id,
  );
};

const registerPresenceHandlers = async (io, socket) => {
  const userId = socket.userId;

  addUser(userId, socket.id);
  socket.join(`user:${userId}`);

  const friendIds = await getFriendIds(userId);
  friendIds.forEach((friendId) => {
    io.to(`user:${friendId}`).emit(EVENTS.USER_ONLINE, {
      user_id: String(userId),
    });
  });

  socket.on("disconnect", async () => {
    const isFullyOffline = removeUser(userId, socket.id);
    if (isFullyOffline) {
      const friendIds = await getFriendIds(userId);
      friendIds.forEach((friendId) => {
        io.to(`user:${friendId}`).emit(EVENTS.USER_OFFLINE, {
          user_id: String(userId),
        });
      });
    }
  });
};

module.exports = registerPresenceHandlers;
