const multer = require("multer");
const response = require("../utils/response.util");
const AppError = require("../utils/app.error");
const ErrorCode = require("../utils/error.code");

const errorMiddleware = (err, req, res, next) => {
  // đồng bộ lỗi multer định nghĩa vào hệ thống xử lý lỗi tập trung
  if (err instanceof multer.MulterError) {
    let ec = ErrorCode.UPLOAD_FAILED;

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        ec = ErrorCode.FILE_TOO_LARGE;
        break;
      case "LIMIT_FILE_COUNT":
        ec = ErrorCode.TOO_MANY_ATTACHMENTS;
        break;
      case "LIMIT_UNEXPECTED_FILE":
        ec = ErrorCode.INVALID_ATTACHMENT_TYPE;
        break;
    }

    return response.error(res, {
      status: ec.status,
      message: ec.message,
      path: req.originalUrl,
    });
  }

  // Lỗi app (nghiệp vụ)
  if (err instanceof AppError) {
    return response.error(res, {
      status: err.status,
      message: err.message,
      path: req.originalUrl,
    });
  }

  // Lỗi không lường trước
  console.error("[UNEXPECTED ERROR]", err);
  return response.error(res, {
    status: ErrorCode.INTERNAL_ERROR.status,
    message: ErrorCode.INTERNAL_ERROR.message,
    path: req.originalUrl,
  });
};

module.exports = errorMiddleware;
