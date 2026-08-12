const onlineUsers = new Map();

const addUser = (userId, socketId) => {
  const key = String(userId);
  if (!onlineUsers.has(key)) onlineUsers.set(key, new Set());
  onlineUsers.get(key).add(socketId);
};

const removeUser = (userId, socketId) => {
  const key = String(userId);
  const sockets = onlineUsers.get(key);
  if (!sockets) return false;

  sockets.delete(socketId);

  if (sockets.size === 0) {
    onlineUsers.delete(key);
    return true;
  }
  return false;
};

const isOnline = (userId) => onlineUsers.has(String(userId));

const getOnlineUserIds = () => Array.from(onlineUsers.keys());

module.exports = { addUser, removeUser, isOnline, getOnlineUserIds };
