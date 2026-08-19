const toConversationListResponse = ({
  conversation,
  name,
  avatarUrl,
  isOnline,
  lastMessageText,
  isLastMessageMe,
  isLastMessageSeen,
}) => ({
  conversation_id: String(conversation._id),
  type: conversation.type,
  name,
  avatar_url: avatarUrl,
  last_message: lastMessageText,
  is_last_message_me: isLastMessageMe,
  is_last_message_seen: isLastMessageSeen,
  is_online: isOnline,
});

const toConversationDetailResponse = ({
  conversation,
  name,
  avatarUrl,
  isOnline,
  messagesPage,
}) => ({
  conversation_id: String(conversation._id),
  type: conversation.type,
  name,
  avatar_url: avatarUrl,
  is_online: isOnline,
  messages: messagesPage,
  created_at: conversation.created_at,
});

const toGroupMemberResponse = (member, user) => ({
  user_id: String(user.id),
  first_name: user.first_name,
  last_name: user.last_name,
  avatar_url: user.avatar_url,
  role: member.role,
  joined_at: member.joined_at,
});

module.exports = {
  toConversationListResponse,
  toConversationDetailResponse,
  toGroupMemberResponse,
};
