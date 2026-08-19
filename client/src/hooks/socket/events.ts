export const SOCKET_EVENTS = {
  USER_ONLINE: "user:online",
  USER_OFFLINE: "user:offline",

  FRIEND_REQUEST_RECEIVED: "friend:request_received",
  FRIEND_REQUEST_ACCEPTED: "friend:request_accepted",
  FRIEND_REQUEST_REJECTED: "friend:request_rejected",
  FRIEND_REMOVED: "friend:removed",

  MESSAGE_NEW: "message:new",
  MESSAGE_RECALLED: "message:recalled",
  MESSAGE_SEEN: "message:seen",

  CONVERSATION_CREATED: "conversation:created",
  CONVERSATION_UPDATED: "conversation:updated",
  CONVERSATION_DELETED: "conversation:deleted",
} as const;
