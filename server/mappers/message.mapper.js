const toAttachmentResponse = (attachment) => ({
  attachment_id: attachment._id.toString(),
  type: attachment.type,
  url: attachment.url,
  file_name: attachment.file_name,
  file_size: attachment.file_size,
  mime_type: attachment.mime_type,
  duration: attachment.duration,
});

const toReplyMessageResponse = (
  replyMessage,
  replySender,
  replyAttachments = [],
) => {
  if (!replyMessage) return null;

  return {
    message_id: replyMessage._id.toString(),
    sender_name: `${replySender.first_name} ${replySender.last_name}`,
    content: replyMessage.is_recalled ? null : replyMessage.content,
    attachments: replyMessage.is_recalled
      ? []
      : replyAttachments.map(toAttachmentResponse),
  };
};

const toSeenResponse = (seenEntry) => ({
  user_id: String(seenEntry.user.id),
  first_name: seenEntry.user.first_name,
  last_name: seenEntry.user.last_name,
  avatar_url: seenEntry.user.avatar_url,
});

const toMessageResponse = (
  message,
  sender,
  attachments = [],
  replyPayload,
  seenList = [],
  currentUserId,
) => {
  const isMe = String(message.sender_id) === String(currentUserId);
  const isSeenByMe = seenList.some(
    (s) => String(s.user.id) === String(currentUserId),
  );

  return {
    message_id: message._id.toString(),
    conversation_id: message.conversation_id.toString(),
    sender_id: String(message.sender_id),
    sender_name: `${sender.first_name} ${sender.last_name}`,
    sender_avatar_url: sender.avatar_url,
    content: message.is_recalled ? null : message.content,
    attachments: message.is_recalled
      ? []
      : attachments.map(toAttachmentResponse),
    reply_message: replyPayload
      ? toReplyMessageResponse(
          replyPayload.message,
          replyPayload.sender,
          replyPayload.attachments,
        )
      : null,
    seen_by: seenList.map(toSeenResponse),
    is_recalled: message.is_recalled,
    is_me: isMe,
    is_seen: isSeenByMe,
    created_at: message.created_at.toISOString(),
  };
};

module.exports = {
  toMessageResponse,
  toReplyMessageResponse,
  toAttachmentResponse,
  toSeenResponse,
};
