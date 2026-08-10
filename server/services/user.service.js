const { USER_NOT_FOUND, PHONE_ALREADY_USED_BY_ANOTHER_USER } = require("../utils/error.code");
const {
  getAvatarFolder,
  uploadBufferToCloudinary,
} = require("../utils/cloudinary.util");
const User = require("../entities/user.entity");
const { Op } = require("sequelize");
const AppError = require("../utils/app.error");

const toUserResponse = (user) => ({
  user_id: String(user.id),
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  phone: user.phone,
  avatar_url: user.avatar_url,
});

const updateUser = async (
  userId,
  { first_name, last_name, phone },
  avatar,
) => {
  const user = await User.findByPk(userId);
  if (!user) throw new AppError(USER_NOT_FOUND);

  if (phone !== user.phone) {
    const phoneOwner = await User.findOne({
      where: { phone, id: { [Op.ne]: userId } },
    });
    if (phoneOwner) throw new AppError(PHONE_ALREADY_USED_BY_ANOTHER_USER);
  }

  if (avatar) {
    const avatarUrl = await uploadBufferToCloudinary(
      avatar.buffer,
      getAvatarFolder(userId),
      "image",
    );
    user.avatar_url = avatarUrl;
  }

  user.first_name = first_name;
  user.last_name = last_name;
  user.phone = phone;
  await user.save();

  return toUserResponse(user);
};

const getAccount = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError(USER_NOT_FOUND);
  }

  return toUserResponse(user);
};

module.exports = {
  updateUser,
  getAccount,
};
