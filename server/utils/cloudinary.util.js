const cloudinary = require("../config/cloudinary.config");
const AppError = require("./app.error");
const ErrorCode = require("./error.code");

const CLOUDINARY_ROOT = "chatwebapp";

const getAvatarFolder = () => `${CLOUDINARY_ROOT}/avatars`;

const getConversationFolder = (conversationId) =>
  `${CLOUDINARY_ROOT}/conversations/${conversationId}`;

const getGroupAvatarFolder = (conversationId) =>
  `${CLOUDINARY_ROOT}/conversations/${conversationId}/avatar`;

const getConversationAttachmentsFolder = (conversationId) =>
  `${CLOUDINARY_ROOT}/conversations/${conversationId}/attachments`;

const uploadBufferToCloudinary = (
  buffer,
  { folder, publicId, resourceType = "image" },
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          return reject(new AppError(ErrorCode.UPLOAD_FAILED));
        }

        resolve(result.secure_url);
      },
    );

    stream.end(buffer);
  });
};

const deleteCloudinaryFolder = async (folder) => {
  const resourceTypes = ["image", "video", "raw"];

  // Xóa tất cả resources
  await Promise.all(
    resourceTypes.map(async (resourceType) => {
      try {
        await cloudinary.api.delete_resources_by_prefix(folder, {
          resource_type: resourceType,
        });
      } catch (err) {
        console.error(
          `[CLOUDINARY] Lỗi xóa resources:`,
          `resource_type=${resourceType}`,
          `folder=${folder}`,
          err.message,
        );
      }
    }),
  );

  // Xóa folder
  try {
    await cloudinary.api.delete_folder(folder);
  } catch (err) {
    console.error(`[CLOUDINARY] Lỗi xóa folder=${folder}:`, err.message);
  }
};

const deleteCloudinaryFile = async (publicId, resourceType = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (err) {
    console.error(
      `[CLOUDINARY] Lỗi xóa file public_id=${publicId}:`,
      err.message,
    );
  }
};

const extractPublicIdFromUrl = (url, resourceType) => {
  if (!url) return null;
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  const pathWithoutVersion = parts[1].replace(/^v\d+\//, "");

  if (resourceType === "raw") {
    return pathWithoutVersion;
  }

  return pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf("."));
};

module.exports = {
  getAvatarFolder,
  getGroupAvatarFolder,
  getConversationFolder,
  getConversationAttachmentsFolder,
  uploadBufferToCloudinary,
  deleteCloudinaryFolder,
  deleteCloudinaryFile,
  extractPublicIdFromUrl,
};
