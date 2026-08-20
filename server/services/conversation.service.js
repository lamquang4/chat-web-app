const { Op } = require("sequelize");
const Conversation = require("../models/conversation.model");
const ConversationMember = require("../models/conversation-member.model");
const Message = require("../models/message.model");
const MessageAttachment = require("../models/message-attachment.model");
const MessageSeen = require("../models/message-seen.model");
const User = require("../entities/user.entity");
const Friend = require("../entities/friend.entity");
const { isOnline } = require("../socket/online-users");
const { getIO } = require("../socket");
const {
  notifyConversationCreated,
  notifyConversationUpdated,
  notifyConversationDeleted,
} = require("../socket/conversation.socket");
const { toAttachmentResponse } = require("../mappers/message.mapper");
const {
  toConversationListResponse,
  toConversationDetailResponse,
  toGroupMemberResponse,
} = require("../mappers/conversation.mapper");
const {
  uploadBufferToCloudinary,
  getGroupAvatarFolder,
  deleteCloudinaryFolder,
  getConversationAttachmentsFolder,
  getConversationFolder,
} = require("../utils/cloudinary.util");
const AppError = require("../utils/app.error");
const {
  GROUP_MEMBER_NOT_FOUND,
  CONVERSATION_NOT_FOUND,
  NOT_CONVERSATION_MEMBER,
  NOT_GROUP_OWNER,
  NOT_GROUP_CONVERSATION,
  NOT_GROUP_ADMIN_OR_OWNER,
  GROUP_MEMBERS_LIMIT_EXCEEDED,
  MIN_GROUP_MEMBERS_REQUIRED,
  TARGET_NOT_GROUP_MEMBER,
  ALREADY_ADMIN,
  NOT_ADMIN,
  CANNOT_ACT_ON_OWNER,
  CANNOT_TRANSFER_TO_SELF,
  USER_NOT_FOUND,
  CANNOT_MESSAGE_SELF,
} = require("../utils/error.code");
const { MAX_GROUP_MEMBERS } = require("../constants/limit");
const { buildUserNameSearch } = require("../utils/search.util");

const findExistingPrivateConversation = async (userIdA, userIdB) => {
  const membershipsOfA = await ConversationMember.find({
    user_id: String(userIdA),
  })
    .select("conversation_id")
    .lean();

  const conversationIdsOfA = membershipsOfA.map((m) => m.conversation_id);
  if (conversationIdsOfA.length === 0) return null;

  const sharedMembership = await ConversationMember.findOne({
    conversation_id: { $in: conversationIdsOfA },
    user_id: String(userIdB),
  }).lean();

  if (!sharedMembership) return null;

  return Conversation.findOne({
    _id: sharedMembership.conversation_id,
    type: "private",
  });
};

const resolveMemberIds = async (memberIds, creatorId) => {
  const uniqueIds = [
    ...new Set(memberIds.filter((id) => String(id) !== String(creatorId))),
  ];
  if (uniqueIds.length === 0) return uniqueIds;

  const foundUsers = await User.findAll({ where: { id: uniqueIds } });
  if (foundUsers.length !== uniqueIds.length)
    throw new AppError(GROUP_MEMBER_NOT_FOUND);

  return uniqueIds;
};

const assertMember = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new AppError(CONVERSATION_NOT_FOUND);

  const membership = await ConversationMember.findOne({
    conversation_id: conversationId,
    user_id: userId,
  });
  if (!membership) throw new AppError(NOT_CONVERSATION_MEMBER);

  return { conversation, membership };
};

const assertGroupOwner = (membership, conversation) => {
  if (conversation.type !== "group") throw new AppError(NOT_GROUP_CONVERSATION);
  if (membership.role !== "owner") throw new AppError(NOT_GROUP_OWNER);
};

const assertGroupOwnerOrAdmin = (membership, conversation) => {
  if (conversation.type !== "group") throw new AppError(NOT_GROUP_CONVERSATION);
  if (membership.role !== "owner" && membership.role !== "admin") {
    throw new AppError(NOT_GROUP_ADMIN_OR_OWNER);
  }
};

const resolveDisplayInfo = async (conversation, currentUserId) => {
  if (conversation.type === "group") {
    return { name: conversation.name, avatarUrl: conversation.avatar_url };
  }

  const otherMembership = await ConversationMember.findOne({
    conversation_id: conversation._id,
    user_id: { $ne: currentUserId },
  }).lean();

  if (!otherMembership)
    return { name: "Người dùng đã rời đi", avatarUrl: null };

  const otherUser = await User.findByPk(otherMembership.user_id);
  return {
    name: `${otherUser.last_name} ${otherUser.first_name}`,
    avatarUrl: otherUser.avatar_url,
  };
};

const resolveIsOnline = async (conversation, currentUserId) => {
  const members = await ConversationMember.find({
    conversation_id: conversation._id,
    user_id: { $ne: currentUserId },
  }).lean();

  return members.some((m) => isOnline(m.user_id));
};

const resolveMatchingConversationIds = async (conversations, userId, q) => {
  if (!q?.trim()) {
    return new Set(conversations.map((c) => String(c._id)));
  }

  const keyword = q.trim().toLowerCase();
  const matched = new Set();

  conversations
    .filter(
      (c) => c.type === "group" && c.name?.toLowerCase().includes(keyword),
    )
    .forEach((c) => matched.add(String(c._id)));

  const privateConversations = conversations.filter(
    (c) => c.type === "private",
  );

  if (privateConversations.length === 0) {
    return matched;
  }

  const privateIds = privateConversations.map((c) => c._id);

  const otherMemberships = await ConversationMember.find({
    conversation_id: { $in: privateIds },
    user_id: { $ne: userId },
  }).lean();

  const conversationToOtherUser = new Map(
    otherMemberships.map((m) => [String(m.conversation_id), m.user_id]),
  );

  const otherUserIds = [...new Set(otherMemberships.map((m) => m.user_id))];

  if (otherUserIds.length === 0) {
    return matched;
  }

  const searchCondition = buildUserNameSearch(q);

  const matchingUsers = await User.findAll({
    where: {
      id: otherUserIds,
      ...searchCondition,
    },
    attributes: ["id"],
  });

  const matchingUserIds = new Set(matchingUsers.map((u) => String(u.id)));

  conversationToOtherUser.forEach((otherUserId, conversationId) => {
    if (matchingUserIds.has(String(otherUserId))) {
      matched.add(conversationId);
    }
  });

  return matched;
};

const buildAndNotifyListUpdate = async (conversation, userId, memberIds) => {
  const { name: displayName, avatarUrl } = await resolveDisplayInfo(
    conversation,
    userId,
  );
  const isOnlineFlag = await resolveIsOnline(conversation, userId);

  notifyConversationUpdated(
    getIO(),
    memberIds,
    userId,
    toConversationListResponse({
      conversation,
      name: displayName,
      avatarUrl,
      isOnline: isOnlineFlag,
      lastMessageText: "",
      isLastMessageMe: false,
      isLastMessageSeen: true,
    }),
  );
};

const getOrCreatePrivateConversation = async (userId, targetUserId) => {
  if (String(userId) === String(targetUserId)) {
    throw new AppError(CANNOT_MESSAGE_SELF);
  }

  const targetUser = await User.findByPk(targetUserId);
  if (!targetUser) throw new AppError(USER_NOT_FOUND);

  let conversation = await findExistingPrivateConversation(
    userId,
    targetUserId,
  );

  if (!conversation) {
    conversation = await Conversation.create({
      type: "private",
      created_by: userId,
    });

    await ConversationMember.insertMany([
      { conversation_id: conversation._id, user_id: userId, role: "member" },
      {
        conversation_id: conversation._id,
        user_id: targetUserId,
        role: "member",
      },
    ]);

    // Báo cho người kia biết có conversation mới (họ chưa từng thấy trong sidebar)
    const { name: displayName, avatarUrl } = await resolveDisplayInfo(
      conversation,
      targetUserId,
    );
    const isOnlineFlag = await resolveIsOnline(conversation, targetUserId);

    notifyConversationCreated(
      getIO(),
      [userId, targetUserId],
      userId,
      toConversationListResponse({
        conversation,
        name: displayName,
        avatarUrl,
        isOnline: isOnlineFlag,
        lastMessageText: "",
        isLastMessageMe: false,
        isLastMessageSeen: true,
      }),
    );
  }

  return { conversation_id: String(conversation._id) };
};

const createGroup = async (userId, { name, member_ids }, avatarFile) => {
  const memberIds = await resolveMemberIds(member_ids, userId);

  const conversation = await Conversation.create({
    type: "group",
    name,
    created_by: userId,
  });

  if (avatarFile) {
    const url = await uploadBufferToCloudinary(avatarFile.buffer, {
      folder: getGroupAvatarFolder(conversation.id),
      publicId: "avatar-group",
      resourceType: "image",
    });

    conversation.avatar_url = url;
    await conversation.save();
  }

  await ConversationMember.insertMany([
    { conversation_id: conversation._id, user_id: userId, role: "owner" },
    ...memberIds.map((id) => ({
      conversation_id: conversation._id,
      user_id: id,
      role: "member",
    })),
  ]);

  const { name: displayName, avatarUrl } = await resolveDisplayInfo(
    conversation,
    userId,
  );
  const isOnlineFlag = await resolveIsOnline(conversation, userId);

  notifyConversationCreated(
    getIO(),
    [userId, ...memberIds],
    userId,
    toConversationListResponse({
      conversation,
      name: displayName,
      avatarUrl,
      isOnline: isOnlineFlag,
      lastMessageText: "",
      isLastMessageMe: false,
      isLastMessageSeen: true,
    }),
  );

  return null;
};

const updateGroup = async (userId, conversationId, { name }, avatarFile) => {
  const { conversation, membership } = await assertMember(
    conversationId,
    userId,
  );
  assertGroupOwnerOrAdmin(membership, conversation);

  conversation.name = name;

  if (avatarFile) {
    const url = await uploadBufferToCloudinary(avatarFile.buffer, {
      folder: getGroupAvatarFolder(conversation.id),
      publicId: "avatar-group",
      resourceType: "image",
      overwrite: true,
    });

    conversation.avatar_url = url;
  }
  await conversation.save();

  const members = await ConversationMember.find({
    conversation_id: conversationId,
  }).lean();
  const memberIds = members.map((m) => String(m.user_id));

  await buildAndNotifyListUpdate(conversation, userId, memberIds);

  return null;
};

const addGroupMembers = async (userId, conversationId, member_ids) => {
  const { conversation, membership } = await assertMember(
    conversationId,
    userId,
  );
  assertGroupOwnerOrAdmin(membership, conversation);

  const currentMembers = await ConversationMember.find({
    conversation_id: conversationId,
  }).lean();
  const currentMemberIds = new Set(
    currentMembers.map((m) => String(m.user_id)),
  );

  const newIds = [...new Set(member_ids.map(String))].filter(
    (id) => !currentMemberIds.has(id),
  );

  if (newIds.length === 0) return null;

  const foundUsers = await User.findAll({ where: { id: newIds } });
  if (foundUsers.length !== newIds.length)
    throw new AppError(GROUP_MEMBER_NOT_FOUND);

  const totalAfterAdd = currentMembers.length + newIds.length;
  if (totalAfterAdd > MAX_GROUP_MEMBERS) {
    throw new AppError(GROUP_MEMBERS_LIMIT_EXCEEDED);
  }

  await ConversationMember.insertMany(
    newIds.map((id) => ({
      conversation_id: conversationId,
      user_id: id,
      role: "member",
    })),
  );

  const allMemberIds = [...currentMemberIds, ...newIds];
  await buildAndNotifyListUpdate(conversation, userId, allMemberIds);

  return null;
};

const removeGroupMember = async (userId, conversationId, targetUserId) => {
  const { conversation, membership } = await assertMember(
    conversationId,
    userId,
  );
  assertGroupOwnerOrAdmin(membership, conversation);

  const targetMembership = await ConversationMember.findOne({
    conversation_id: conversationId,
    user_id: targetUserId,
  });
  if (!targetMembership) throw new AppError(TARGET_NOT_GROUP_MEMBER);

  if (targetMembership.role === "owner") {
    throw new AppError(CANNOT_ACT_ON_OWNER);
  }

  if (membership.role === "admin" && targetMembership.role === "admin") {
    throw new AppError(NOT_GROUP_ADMIN_OR_OWNER);
  }

  const totalMembers = await ConversationMember.countDocuments({
    conversation_id: conversationId,
  });
  if (totalMembers - 1 < 2) {
    throw new AppError(MIN_GROUP_MEMBERS_REQUIRED);
  }

  await ConversationMember.deleteOne({
    conversation_id: conversationId,
    user_id: targetUserId,
  });

  const remainingMembers = await ConversationMember.find({
    conversation_id: conversationId,
  }).lean();
  const remainingIds = remainingMembers.map((m) => String(m.user_id));

  await buildAndNotifyListUpdate(conversation, userId, [
    ...remainingIds,
    String(targetUserId),
  ]);

  return null;
};

const promoteToAdmin = async (userId, conversationId, targetUserId) => {
  const { conversation, membership } = await assertMember(
    conversationId,
    userId,
  );
  assertGroupOwner(membership, conversation);

  const targetMembership = await ConversationMember.findOne({
    conversation_id: conversationId,
    user_id: targetUserId,
  });
  if (!targetMembership) throw new AppError(TARGET_NOT_GROUP_MEMBER);

  if (targetMembership.role === "owner")
    throw new AppError(CANNOT_ACT_ON_OWNER);
  if (targetMembership.role === "admin") throw new AppError(ALREADY_ADMIN);

  targetMembership.role = "admin";
  await targetMembership.save();

  const members = await ConversationMember.find({
    conversation_id: conversationId,
  }).lean();
  const memberIds = members.map((m) => String(m.user_id));

  await buildAndNotifyListUpdate(conversation, userId, memberIds);

  return null;
};

const demoteAdmin = async (userId, conversationId, targetUserId) => {
  const { conversation, membership } = await assertMember(
    conversationId,
    userId,
  );
  assertGroupOwner(membership, conversation);

  const targetMembership = await ConversationMember.findOne({
    conversation_id: conversationId,
    user_id: targetUserId,
  });
  if (!targetMembership) throw new AppError(TARGET_NOT_GROUP_MEMBER);

  if (targetMembership.role !== "admin") throw new AppError(NOT_ADMIN);

  targetMembership.role = "member";
  await targetMembership.save();

  const members = await ConversationMember.find({
    conversation_id: conversationId,
  }).lean();
  const memberIds = members.map((m) => String(m.user_id));

  await buildAndNotifyListUpdate(conversation, userId, memberIds);

  return null;
};

const transferOwnership = async (userId, conversationId, targetUserId) => {
  const { conversation, membership } = await assertMember(
    conversationId,
    userId,
  );
  assertGroupOwner(membership, conversation);

  if (String(targetUserId) === String(userId)) {
    throw new AppError(CANNOT_TRANSFER_TO_SELF);
  }

  const targetMembership = await ConversationMember.findOne({
    conversation_id: conversationId,
    user_id: targetUserId,
  });
  if (!targetMembership) throw new AppError(TARGET_NOT_GROUP_MEMBER);

  // Owner cũ trở thành admin
  membership.role = "admin";
  targetMembership.role = "owner";

  await Promise.all([membership.save(), targetMembership.save()]);

  const members = await ConversationMember.find({
    conversation_id: conversationId,
  }).lean();
  const memberIds = members.map((m) => String(m.user_id));

  await buildAndNotifyListUpdate(conversation, userId, memberIds);

  return null;
};

const deleteGroup = async (userId, conversationId) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new AppError(CONVERSATION_NOT_FOUND);

  const membership = await ConversationMember.findOne({
    conversation_id: conversationId,
    user_id: userId,
  });
  if (!membership) throw new AppError(NOT_CONVERSATION_MEMBER);

  assertGroupOwner(membership, conversation);

  const members = await ConversationMember.find({
    conversation_id: conversationId,
  }).lean();
  const memberIds = members.map((m) => m.user_id);

  const messages = await Message.find(
    { conversation_id: conversationId },
    { _id: 1 },
  ).lean();
  const messageIds = messages.map((m) => m._id);

  await Promise.all([
    MessageAttachment.deleteMany({ conversation_id: conversationId }),
    MessageSeen.deleteMany({ message_id: { $in: messageIds } }),
  ]);
  await Message.deleteMany({ conversation_id: conversationId });
  await ConversationMember.deleteMany({ conversation_id: conversationId });
  await conversation.deleteOne();

  await Promise.all([
    deleteCloudinaryFolder(getGroupAvatarFolder(conversationId)),
    deleteCloudinaryFolder(getConversationAttachmentsFolder(conversationId)),
  ]);

  await deleteCloudinaryFolder(getConversationFolder(conversationId));

  notifyConversationDeleted(getIO(), memberIds, userId, {
    conversation_id: String(conversationId),
  });

  return null;
};

const getConversationList = async (userId, { page, size, type, q }) => {
  const memberships = await ConversationMember.find({ user_id: userId }).lean();
  const conversationIds = memberships.map((m) => m.conversation_id);

  if (conversationIds.length === 0)
    return { content: [], page, size, totalElements: 0 };

  const filter = { _id: { $in: conversationIds } };
  if (type) filter.type = type;

  const allMatchedTypeConversations = await Conversation.find(filter).lean();
  const matchingIds = await resolveMatchingConversationIds(
    allMatchedTypeConversations,
    userId,
    q,
  );
  const finalConversations = allMatchedTypeConversations.filter((c) =>
    matchingIds.has(String(c._id)),
  );

  if (finalConversations.length === 0)
    return { content: [], page, size, totalElements: 0 };

  const totalElements = finalConversations.length;
  const finalIds = finalConversations.map((c) => c._id);

  const conversations = await Conversation.find({ _id: { $in: finalIds } })
    .sort({ last_message_at: -1, created_at: -1 })
    .skip(page * size)
    .limit(size)
    .lean();

  const membershipMap = new Map(
    memberships.map((m) => [String(m.conversation_id), m]),
  );

  const content = await Promise.all(
    conversations.map(async (conversation) => {
      const { name, avatarUrl } = await resolveDisplayInfo(
        conversation,
        userId,
      );
      const isOnlineFlag = await resolveIsOnline(conversation, userId);

      const lastMessage = await Message.findOne({
        conversation_id: conversation._id,
      })
        .sort({ created_at: -1 })
        .lean();

      let lastMessageText = "";
      let isLastMessageMe = false;
      let isLastMessageSeen = true;

      if (lastMessage) {
        isLastMessageMe = String(lastMessage.sender_id) === String(userId);

        if (lastMessage.is_recalled) {
          lastMessageText = "Tin nhắn đã bị thu hồi";
        } else if (lastMessage.content) {
          lastMessageText = lastMessage.content;
        } else {
          const firstAttachment = await MessageAttachment.findOne({
            message_id: lastMessage._id,
          }).lean();
          lastMessageText = firstAttachment
            ? {
                image: "[Hình ảnh]",
                document: "[Tệp đính kèm]",
                audio: "[Tin nhắn thoại]",
              }[firstAttachment.type]
            : "";
        }

        if (isLastMessageMe) {
          const otherMembers = await ConversationMember.find({
            conversation_id: conversation._id,
            user_id: { $ne: userId },
          }).lean();
          isLastMessageSeen = otherMembers.some(
            (m) => m.last_read_at && m.last_read_at >= lastMessage.created_at,
          );
        } else {
          isLastMessageSeen =
            membershipMap.get(String(conversation._id))?.last_read_at >=
            lastMessage.created_at;
        }
      }

      return toConversationListResponse({
        conversation,
        name,
        avatarUrl,
        isOnline: isOnlineFlag,
        lastMessageText,
        isLastMessageMe,
        isLastMessageSeen: Boolean(isLastMessageSeen),
      });
    }),
  );

  return { content, page, size, totalElements };
};

const getConversationDetail = async (
  userId,
  conversationId,
  { page, size },
) => {
  const { conversation } = await assertMember(conversationId, userId);
  const { name, avatarUrl } = await resolveDisplayInfo(conversation, userId);
  const isOnlineFlag = await resolveIsOnline(conversation, userId);
  const messagesPage = await buildMessagesPage(
    conversationId,
    userId,
    page,
    size,
  );

  return toConversationDetailResponse({
    conversation,
    name,
    avatarUrl,
    isOnline: isOnlineFlag,
    messagesPage,
  });
};

const buildMessagesPage = async (conversationId, currentUserId, page, size) => {
  const totalElements = await Message.countDocuments({
    conversation_id: conversationId,
  });
  const totalPages = Math.ceil(totalElements / size);

  const messages = await Message.find({ conversation_id: conversationId })
    .sort({ created_at: -1 })
    .skip(page * size)
    .limit(size)
    .lean();

  if (messages.length === 0) {
    return { content: [], page, size, totalElements, totalPages };
  }

  const messageIds = messages.map((m) => m._id);
  const replyIds = messages
    .filter((m) => m.reply_msg_id)
    .map((m) => m.reply_msg_id);

  const [attachments, seenList, originals] = await Promise.all([
    MessageAttachment.find({ message_id: { $in: messageIds } }).lean(),
    MessageSeen.find({ message_id: { $in: messageIds } }).lean(),
    replyIds.length ? Message.find({ _id: { $in: replyIds } }).lean() : [],
  ]);

  const originalIds = originals.map((o) => o._id);
  const originalAttachments = originalIds.length
    ? await MessageAttachment.find({ message_id: { $in: originalIds } }).lean()
    : [];

  const senderIds = messages.map((m) => m.sender_id);
  const originalSenderIds = originals.map((o) => o.sender_id);
  const seenUserIds = seenList.map((s) => s.user_id);
  const allUserIds = [
    ...new Set([...senderIds, ...originalSenderIds, ...seenUserIds]),
  ];

  const users = await User.findAll({ where: { id: allUserIds } });
  const userMap = new Map(users.map((u) => [String(u.id), u]));
  const originalMap = new Map(originals.map((o) => [o._id.toString(), o]));

  const content = messages.map((msg) => {
    const sender = userMap.get(String(msg.sender_id));
    const msgAttachments = attachments.filter((a) =>
      a.message_id.equals(msg._id),
    );
    const msgSeen = seenList.filter((s) => s.message_id.equals(msg._id));

    let replyMessage = null;
    if (msg.reply_msg_id) {
      const original = originalMap.get(msg.reply_msg_id.toString());
      if (original) {
        const originalSender = userMap.get(String(original.sender_id));
        const origAttachments = originalAttachments.filter((a) =>
          a.message_id.equals(original._id),
        );
        replyMessage = {
          message_id: String(original._id),
          sender_name: `${originalSender.last_name} ${originalSender.first_name}`,
          content: original.is_recalled ? null : original.content,
          attachments: original.is_recalled
            ? []
            : origAttachments.map(toAttachmentResponse),
        };
      }
    }

    return {
      message_id: String(msg._id),
      conversation_id: String(msg.conversation_id),
      sender_id: String(msg.sender_id),
      sender_name: `${sender.last_name} ${sender.first_name}`,
      sender_avatar_url: sender.avatar_url,
      content: msg.is_recalled ? null : msg.content,
      attachments: msg.is_recalled
        ? []
        : msgAttachments.map(toAttachmentResponse),
      reply_message: replyMessage,
      seen_by: msgSeen.map((s) => {
        const u = userMap.get(String(s.user_id));
        return {
          user_id: String(u.id),
          first_name: u.first_name,
          last_name: u.last_name,
          avatar_url: u.avatar_url,
        };
      }),
      is_recalled: msg.is_recalled,
      is_me: String(msg.sender_id) === String(currentUserId),
      is_seen: msgSeen.some((s) => String(s.user_id) !== String(currentUserId)),
      created_at: msg.created_at,
    };
  });

  return { content, page, size, totalElements, totalPages };
};

const getGroupMembers = async (userId, conversationId) => {
  await assertMember(conversationId, userId);

  const members = await ConversationMember.find({
    conversation_id: conversationId,
  })
    .sort({ joined_at: 1 })
    .lean();

  const userIds = members.map((m) => m.user_id);
  const users = await User.findAll({ where: { id: userIds } });
  const userMap = new Map(users.map((u) => [String(u.id), u]));

  return members
    .map((member) => {
      const user = userMap.get(String(member.user_id));
      if (!user) return null;
      return toGroupMemberResponse(member, user);
    })
    .filter(Boolean);
};

module.exports = {
  createGroup,
  updateGroup,
  deleteGroup,
  addGroupMembers,
  removeGroupMember,
  promoteToAdmin,
  demoteAdmin,
  transferOwnership,
  getConversationList,
  getConversationDetail,
  getGroupMembers,
  getOrCreatePrivateConversation,
};
