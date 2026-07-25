const multer = require("multer");
const response = require("../utils/response.util");
const AppError = require("../utils/app.error");
const ErrorCode = require("../utils/error.code");

const errorMiddleware = (err, req, res, next) => {
  // Multer errors
  if (err instanceof multer.MulterError) {
    let ec = ErrorCode.UPLOAD_FAILED;

    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        ec = ErrorCode.FILE_TOO_LARGE;
        break;
      case "LIMIT_UNEXPECTED_FILE":
        ec = ErrorCode.INVALID_IMAGE_TYPE;
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
    status: 500,
    message: ErrorCode.INTERNAL_ERROR.message,
    path: req.originalUrl,
  });
};

module.exports = errorMiddleware;
