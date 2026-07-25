const multer = require("multer");
const AppError = require("../utils/app.error");
const ErrorCode = require("../utils/error.code");

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOC_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
];

const storage = multer.memoryStorage();

// Upload hình — giới hạn 5MB
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError(ErrorCode.INVALID_IMAGE_TYPE));
    }
    cb(null, true);
  },
});

// Upload file — giới hạn 10MB
const uploadDoc = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_DOC_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError(ErrorCode.INVALID_DOC_TYPE));
    }
    cb(null, true);
  },
});

module.exports = { uploadImage, uploadDoc };
