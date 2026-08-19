const { Op } = require("sequelize");
const Friend = require("../entities/friend.entity");
const User = require("../entities/user.entity");
const ConversationMember = require("../models/conversation-member.model");
const { isOnline } = require("../socket/online-users");
const { getIO } = require("../socket");
const {
  notifyFriendRequestReceived,
  notifyFriendRequestAccepted,
  notifyFriendRequestRejected,
  notifyFriendRemoved,
} = require("../socket/friend.socket");
const AppError = require("../utils/app.error");
const {
  USER_NOT_FOUND,
  CANNOT_FRIEND_SELF,
  FRIEND_REQUEST_ALREADY_EXISTS,
  ALREADY_FRIENDS,
  FRIEND_REQUEST_NOT_FOUND,
  FRIEND_NOT_FOUND,
} = require("../utils/error.code");
const {
  toFriendResponse,
  toFriendRequestResponse,
  toSuggestedFriendResponse,
} = require("../mappers/friend.mapper");
const { buildUserNameSearch } = require("../utils/search.util");

const getFriendsNotInConversation = async (
  userId,
  conversationId,
  { page, size, q },
) => {
  const friends = await Friend.findAll({
    where: {
      status: "accepted",
      [Op.or]: [{ requester_id: userId }, { receiver_id: userId }],
    },
  });

  if (friends.length === 0) {
    return { content: [], page, size, totalElements: 0 };
  }

  const otherUserIds = friends.map((f) =>
    String(f.requester_id) === String(userId) ? f.receiver_id : f.requester_id,
  );

  const existingMembers = await ConversationMember.find({
    conversation_id: conversationId,
  })
    .select("user_id")
    .lean();
  const existingMemberIds = new Set(
    existingMembers.map((m) => String(m.user_id)),
  );

  const candidateIds = otherUserIds.filter(
    (id) => !existingMemberIds.has(String(id)),
  );

  if (candidateIds.length === 0) {
    return { content: [], page, size, totalElements: 0 };
  }

  const searchCondition = buildUserNameSearch(q);

  const { rows: users, count } = await User.findAndCountAll({
    where: { id: candidateIds, ...searchCondition },
    offset: page * size,
    limit: size,
    order: [["first_name", "ASC"]],
  });

  const friendMap = new Map(
    friends.map((f) => [
      String(f.requester_id) === String(userId)
        ? f.receiver_id
        : f.requester_id,
      f,
    ]),
  );

  const content = users.map((u) =>
    toFriendResponse(friendMap.get(u.id), u, isOnline(u.id), null),
  );

  return { content, page, size, totalElements: count };
};

const sendFriendRequest = async (userId, receiverId) => {
  if (String(userId) === String(receiverId)) {
    throw new AppError(CANNOT_FRIEND_SELF);
  }

  const receiver = await User.findByPk(receiverId);
  if (!receiver) throw new AppError(USER_NOT_FOUND);

  const existing = await Friend.findOne({
    where: {
      [Op.or]: [
        { requester_id: userId, receiver_id: receiverId },
        { requester_id: receiverId, receiver_id: userId },
      ],
    },
  });

  if (existing) {
    if (existing.status === "accepted") throw new AppError(ALREADY_FRIENDS);
    throw new AppError(FRIEND_REQUEST_ALREADY_EXISTS);
  }

  const requester = await User.findByPk(userId);
  const friendRequest = await Friend.create({
    requester_id: userId,
    receiver_id: receiverId,
    status: "pending",
  });

  const io = getIO();
  notifyFriendRequestReceived(
    io,
    receiverId,
    toFriendRequestResponse(friendRequest, requester),
  );

  return null;
};

const acceptFriendRequest = async (userId, requesterId) => {
  const friend = await Friend.findOne({
    where: {
      requester_id: requesterId,
      receiver_id: userId,
      status: "pending",
    },
  });

  if (!friend) throw new AppError(FRIEND_REQUEST_NOT_FOUND);

  friend.status = "accepted";
  await friend.save();

  const receiver = await User.findByPk(friend.receiver_id);

  const io = getIO();
  notifyFriendRequestAccepted(
    io,
    friend.requester_id,
    toFriendResponse(friend, receiver, isOnline(friend.receiver_id), null),
  );

  return null;
};

const rejectFriendRequest = async (userId, requesterId) => {
  const friend = await Friend.findOne({
    where: {
      requester_id: requesterId,
      receiver_id: userId,
      status: "pending",
    },
  });

  if (!friend) throw new AppError(FRIEND_REQUEST_NOT_FOUND);

  await friend.destroy();
  const io = getIO();
  notifyFriendRequestRejected(io, requesterId, userId);
  return null;
};

const removeFriend = async (userId, friendUserId) => {
  const friend = await Friend.findOne({
    where: {
      status: "accepted",
      [Op.or]: [
        { requester_id: userId, receiver_id: friendUserId },
        { requester_id: friendUserId, receiver_id: userId },
      ],
    },
  });

  if (!friend) throw new AppError(FRIEND_NOT_FOUND);

  await friend.destroy();

  const io = getIO();
  notifyFriendRemoved(io, friendUserId, userId);

  return null;
};

const getFriendList = async (userId, { page, size, q }) => {
  const friends = await Friend.findAll({
    where: {
      status: "accepted",
      [Op.or]: [{ requester_id: userId }, { receiver_id: userId }],
    },
  });

  if (friends.length === 0) {
    return { content: [], page, size, totalElements: 0 };
  }

  const otherUserIds = friends.map((f) =>
    String(f.requester_id) === String(userId) ? f.receiver_id : f.requester_id,
  );

  const searchCondition = buildUserNameSearch(q);

  const { rows: users, count } = await User.findAndCountAll({
    where: { id: otherUserIds, ...searchCondition },
    offset: page * size,
    limit: size,
    order: [["first_name", "ASC"]],
  });

  const friendMap = new Map(
    friends.map((f) => [
      String(f.requester_id) === String(userId)
        ? f.receiver_id
        : f.requester_id,
      f,
    ]),
  );

  const content = users.map((u) =>
    toFriendResponse(friendMap.get(u.id), u, isOnline(u.id)),
  );

  return { content, page, size, totalElements: count };
};

const getFriendRequestList = async (userId, { page, size, q }) => {
  const requests = await Friend.findAll({
    where: { receiver_id: userId, status: "pending" },
  });

  if (requests.length === 0) {
    return { content: [], page, size, totalElements: 0 };
  }

  const requesterIds = requests.map((r) => r.requester_id);
  const searchCondition = buildUserNameSearch(q);

  const { rows: requesters, count } = await User.findAndCountAll({
    where: { id: requesterIds, ...searchCondition },
    offset: page * size,
    limit: size,
    order: [["created_at", "DESC"]],
  });

  const requestMap = new Map(requests.map((r) => [r.requester_id, r]));

  const content = requesters.map((u) =>
    toFriendRequestResponse(requestMap.get(u.id), u),
  );

  return { content, page, size, totalElements: count };
};

const getSuggestedFriends = async (userId, { page, size, q }) => {
  const relatedFriends = await Friend.findAll({
    where: {
      [Op.or]: [{ requester_id: userId }, { receiver_id: userId }],
    },
    attributes: ["requester_id", "receiver_id"],
  });

  const excludedIds = new Set([String(userId)]);
  relatedFriends.forEach((f) => {
    excludedIds.add(String(f.requester_id));
    excludedIds.add(String(f.receiver_id));
  });

  const searchCondition = buildUserNameSearch(q);

  const { rows: users, count } = await User.findAndCountAll({
    where: {
      id: { [Op.notIn]: Array.from(excludedIds) },
      is_verified: true,
      ...searchCondition,
    },
    offset: page * size,
    limit: size,
    order: [["created_at", "DESC"]],
  });

  const content = users.map((u) => toSuggestedFriendResponse(u));

  return { content, page, size, totalElements: count };
};

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
  getFriendList,
  getFriendRequestList,
  getSuggestedFriends,
  getFriendsNotInConversation,
};
