const jwtUtil = require("../utils/jwt.util");
const AppError = require("../utils/app.error");
const ErrorCode = require("../utils/error.code");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Không có token thì cho qua, để requireAuth (nếu có) xử lý tiếp
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwtUtil.verifyAccessToken(token);
    req.user = {
      id: jwtUtil.extractUserId(decoded), // đúng: decoded.sub, không phải decoded.id
    };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError(ErrorCode.TOKEN_EXPIRED));
    }
    return next(new AppError(ErrorCode.INVALID_TOKEN));
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return next(new AppError(ErrorCode.UNAUTHORIZED));
  }
  next();
};

module.exports = { authMiddleware, requireAuth };
