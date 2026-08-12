const toUserResponse = (user) => ({
  user_id: String(user.id),
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  phone: user.phone,
  avatar_url: user.avatar_url,
});

module.exports = { toUserResponse };
