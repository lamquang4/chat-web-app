const EVENTS = require("./events");

const notifyFriendRequestReceived = (io, receiverId, requestPayload) => {
  io.to(`user:${receiverId}`).emit(
    EVENTS.FRIEND_REQUEST_RECEIVED,
    requestPayload,
  );
};

const notifyFriendRequestAccepted = (io, requesterId, friendPayload) => {
  io.to(`user:${requesterId}`).emit(
    EVENTS.FRIEND_REQUEST_ACCEPTED,
    friendPayload,
  );
};

const notifyFriendRemoved = (io, otherUserId, removedByUserId) => {
  io.to(`user:${otherUserId}`).emit(EVENTS.FRIEND_REMOVED, {
    user_id: String(removedByUserId),
  });
};

const notifyFriendRequestRejected = (io, requesterId, rejectedByUserId) => {
  io.to(`user:${requesterId}`).emit(EVENTS.FRIEND_REQUEST_REJECTED, {
    user_id: String(rejectedByUserId),
  });
};

module.exports = {
  notifyFriendRequestReceived,
  notifyFriendRequestAccepted,
  notifyFriendRequestRejected,
  notifyFriendRemoved,
};
