const toFriendResponse = (friend, otherUser, isOnline) => ({
  user_id: String(otherUser.id),
  first_name: otherUser.first_name,
  last_name: otherUser.last_name,
  avatar_url: otherUser.avatar_url,
  is_online: isOnline,
  updated_at: friend.updated_at,
});

const toFriendRequestResponse = (friendRequest, requester) => ({
  requester_id: String(requester.id),
  first_name: requester.first_name,
  last_name: requester.last_name,
  avatar_url: requester.avatar_url,
  created_at: friendRequest.created_at,
});

const toSuggestedFriendResponse = (user) => ({
  user_id: String(user.id),
  first_name: user.first_name,
  last_name: user.last_name,
  avatar_url: user.avatar_url,
});

module.exports = {
  toFriendResponse,
  toFriendRequestResponse,
  toSuggestedFriendResponse,
};
