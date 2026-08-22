const multer = require("multer");
const {
  ALLOWED_IMAGE_MIME_TYPES,
  ALLOWED_FILE_MIME_TYPES,
  MAX_IMAGE_SIZE,
  MAX_FILE_SIZE,
  MAX_UPLOAD,
} = require("../constants/limit");
const AppError = require("../utils/app.error");
const ErrorCode = require("../utils/error.code");

const storage = multer.memoryStorage();

const isImageType = (mimetype) => ALLOWED_IMAGE_MIME_TYPES.includes(mimetype);
const isFileType = (mimetype) => ALLOWED_FILE_MIME_TYPES.includes(mimetype);

const uploadAvatar = multer({
  storage,
  limits: {
    files: 1,
    fileSize: Math.max(MAX_IMAGE_SIZE, MAX_FILE_SIZE),
  },
  fileFilter: (req, file, cb) => {
    if (!isImageType(file.mimetype)) {
      return cb(new AppError(ErrorCode.INVALID_IMAGE_TYPE));
    }
    cb(null, true);
  },
});

const validateImageSize = (req, res, next) => {
  if (req.file && req.file.size > MAX_IMAGE_SIZE) {
    return next(new AppError(ErrorCode.IMAGE_TOO_LARGE));
  }
  next();
};

const uploadAttachments = multer({
  storage,
  limits: {
    files: MAX_UPLOAD,
    fileSize: Math.max(MAX_IMAGE_SIZE, MAX_FILE_SIZE), // Giới hạn cứng bảo vệ server
  },
  fileFilter: (req, file, cb) => {
    if (isImageType(file.mimetype)) return cb(null, true);
    if (isFileType(file.mimetype)) return cb(null, true);
    return cb(new AppError(ErrorCode.INVALID_ATTACHMENT_TYPE));
  },
});

const validateAttachmentSize = (req, res, next) => {
  const attachments = req.files || [];

  for (const file of attachments) {
    if (isImageType(file.mimetype) && file.size > MAX_IMAGE_SIZE) {
      return next(new AppError(ErrorCode.IMAGE_TOO_LARGE));
    }
    if (isFileType(file.mimetype) && file.size > MAX_FILE_SIZE) {
      return next(new AppError(ErrorCode.FILE_TOO_LARGE));
    }
  }

  next();
};

module.exports = {
  uploadAvatar: uploadAvatar.single("avatar"),
  validateImageSize,
  uploadAttachments: uploadAttachments.array("attachments", MAX_UPLOAD),
  validateAttachmentSize,
};
