const cloudinary = require("../config/cloudinary.config");
const AppError = require("./app.error");
const ErrorCode = require("./error.code");

const CLOUDINARY_ROOT = "chatwebapp";

const getAvatarFolder = (userId) => `${CLOUDINARY_ROOT}/avatars/${userId}`;

const getConversationFolder = (conversationId) =>
  `${CLOUDINARY_ROOT}/conversations/${conversationId}`;

const uploadBufferToCloudinary = (buffer, folder, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(new AppError(ErrorCode.UPLOAD_FAILED));
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};

module.exports = {
  getAvatarFolder,
  getConversationFolder,
  uploadBufferToCloudinary,
};
