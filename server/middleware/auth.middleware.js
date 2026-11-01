const {
  ACCESS_TOKEN_EXPIRED,
  INVALID_ACCESS_TOKEN,
  SESSION_EXPIRED,
  SESSION_REVOKED,
  UNAUTHORIZED,
} = require("../utils/error.code");
const jwtUtil = require("../utils/jwt.util");
const AppError = require("../utils/app.error");
const Session = require("../entities/session.entity");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Không có token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.substring(7);

  let decoded;
  try {
    decoded = jwtUtil.verifyAccessToken(token);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new AppError(ACCESS_TOKEN_EXPIRED));
    }

    return next(new AppError(INVALID_ACCESS_TOKEN));
  }

  const userId = jwtUtil.extractUserId(decoded);
  const sessionId = jwtUtil.extractSessionId(decoded);

  if (!userId || !sessionId) {
    return next(new AppError(INVALID_ACCESS_TOKEN));
  }

  try {
    const session = await Session.findOne({
      where: { id: sessionId, user_id: userId },
    });

    if (!session || session.is_revoked) {
      return next(new AppError(SESSION_REVOKED));
    }

    if (session.expires_at <= new Date()) {
      return next(new AppError(SESSION_EXPIRED));
    }

    req.user = {
      id: userId,
      session_id: sessionId,
    };

    return next();
  } catch (error) {
    return next(error);
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
