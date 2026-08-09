const {
  ACCESS_TOKEN_EXPIRED,
  INVALID_ACCESS_TOKEN,
  UNAUTHORIZED,
} = require("../utils/error.code");
const jwtUtil = require("../utils/jwt.util");
const AppError = require("../utils/app.error");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Không có token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwtUtil.verifyAccessToken(token);

    req.user = {
      id: jwtUtil.extractUserId(decoded),
      session_id: decoded.session_id,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError(ACCESS_TOKEN_EXPIRED));
    }

    return next(new AppError(INVALID_ACCESS_TOKEN));
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return next(new AppError(UNAUTHORIZED));
  }

  next();
};

module.exports = {
  authMiddleware,
  requireAuth,
};
