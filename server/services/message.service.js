const { toMessageResponse } = require("../mappers/message.mapper");
const Message = require("../models/message.model");
const MessageAttachment = require("../models/message-attachment.model");
const ConversationMember = require("../models/conversation-member.model");
const User = require("../entities/user.entity");
const { getIO } = require("../socket");
const {
  notifyNewMessage,
  notifyMessageRecalled,
} = require("../socket/message.socket");
const {
  uploadBufferToCloudinary,
  getConversationAttachmentsFolder,
  extractPublicIdFromUrl,
  deleteCloudinaryFile,
} = require("../utils/cloudinary.util");
const { ALLOWED_IMAGE_MIME_TYPES } = require("../constants/limit");
const AppError = require("../utils/app.error");
const {
  NOT_CONVERSATION_MEMBER,
  MESSAGE_CONTENT_REQUIRED,
  REPLY_MESSAGE_NOT_FOUND,
  USER_NOT_FOUND,
  MESSAGE_NOT_FOUND,
  NOT_MESSAGE_OWNER,
  MESSAGE_ALREADY_RECALLED,
} = require("../utils/error.code");

const resolveAttachmentType = (mimetype) => {
  if (ALLOWED_IMAGE_MIME_TYPES.includes(mimetype)) {
    return "image";
  }

  if (mimetype.startsWith("audio/")) {
    return "audio";
  }

  if (mimetype.startsWith("video/")) {
    return "video";
  }

  return "document";
};

const getMemberIds = async (conversationId) => {
  const members = await ConversationMember.find({
    conversation_id: conversationId,
  }).lean();
  return members.map((m) => m.user_id);
};

const assertIsMember = async (conversationId, userId) => {
  const member = await ConversationMember.findOne({
    conversation_id: conversationId,
    user_id: String(userId),
  }).lean();

  if (!member) {
    throw new AppError(NOT_CONVERSATION_MEMBER);
  }
};

const buildReplyPayload = async (replyMessageId, conversationId) => {
  if (!replyMessageId) return null;

  const replyMessage = await Message.findOne({
    _id: replyMessageId,
    conversation_id: conversationId,
  }).lean();

  if (!replyMessage) {
    throw new AppError(REPLY_MESSAGE_NOT_FOUND);
  }

  const [replySender, replyAttachments] = await Promise.all([
    User.findByPk(replyMessage.sender_id),
    MessageAttachment.find({ message_id: replyMessageId }).lean(),
  ]);

  return {
    message: replyMessage,
    sender: replySender,
    attachments: replyAttachments,
  };
};

const sendMessage = async (
  userId,
  conversationId,
  { content, reply_message_id },
  files = [],
) => {
  await assertIsMember(conversationId, userId);

  const trimmedContent = content?.trim();

  if (!trimmedContent && (!files || files.length === 0)) {
    throw new AppError(MESSAGE_CONTENT_REQUIRED);
  }

  const sender = await User.findByPk(userId);

  if (!sender) {
    throw new AppError(USER_NOT_FOUND);
  }

  const replyPayload = await buildReplyPayload(
    reply_message_id,
    conversationId,
  );

  const message = await Message.create({
    conversation_id: conversationId,
    sender_id: String(userId),
    content: trimmedContent || null,
    reply_msg_id: replyPayload ? replyPayload.message._id : null,
  });

  const uploaded = await Promise.all(
    files.map(async (file) => {
      const type = resolveAttachmentType(file.mimetype);

      const url = await uploadBufferToCloudinary(file.buffer, {
        folder: getConversationAttachmentsFolder(conversationId),
        publicId: `${message._id}_${crypto.randomUUID()}`,
        resourceType: "auto",
      });

      return {
        type,
        url,
        file,
      };
    }),
  );

  const attachmentDocs = uploaded.map(({ type, url, file }) => ({
    message_id: message._id,
    conversation_id: conversationId,
    type,
    url,
    file_name: file.originalname,
    file_size: file.size,
    mime_type: file.mimetype,
    duration: null,
  }));

  const savedAttachments =
    attachmentDocs.length > 0
      ? await MessageAttachment.insertMany(attachmentDocs)
      : [];

  const messageResponse = toMessageResponse(
    message,
    sender,
    savedAttachments,
    replyPayload,
    [],
    userId,
  );

  const memberIds = await getMemberIds(conversationId);

  notifyNewMessage(getIO(), memberIds, userId, messageResponse);

  return messageResponse;
};

const recallMessage = async (userId, messageId) => {
  const message = await Message.findById(messageId);
  if (!message) throw new AppError(MESSAGE_NOT_FOUND);

  if (String(message.sender_id) !== String(userId)) {
    throw new AppError(NOT_MESSAGE_OWNER);
  }

  if (message.is_recalled) {
    throw new AppError(MESSAGE_ALREADY_RECALLED);
  }

  const attachments = await MessageAttachment.find({
    message_id: messageId,
  }).lean();

  await Promise.all(
    attachments.map(async (file) => {
      let cloudinaryResourceType = file.type;
      if (file.type === "document") cloudinaryResourceType = "raw";
      if (file.type === "audio") cloudinaryResourceType = "video";

      const publicId =
        file.public_id ||
        extractPublicIdFromUrl(file.url, cloudinaryResourceType);

      if (publicId) {
        await deleteCloudinaryFile(publicId, cloudinaryResourceType);
      }
    }),
  );

  message.is_recalled = true;
  message.content = null;
  await message.save();

  await MessageAttachment.deleteMany({ message_id: messageId });

  const memberIds = await getMemberIds(message.conversation_id);
  const io = getIO();
  notifyMessageRecalled(io, memberIds, userId, {
    message_id: message._id.toString(),
    conversation_id: message.conversation_id.toString(),
    is_recalled: true,
  });

  return null;
};
module.exports = { sendMessage, recallMessage };
