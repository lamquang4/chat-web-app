// socket/socket.middleware.js
const { Op } = require("sequelize");
const jwtUtil = require("../utils/jwt.util");
const Session = require("../entities/session.entity");
const {
  UNAUTHORIZED,
  INVALID_ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRED,
} = require("../utils/error.code");

const socketMiddleware = async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error(UNAUTHORIZED.message));
  }

  try {
    const decoded = jwtUtil.verifyAccessToken(token);
    const userId = jwtUtil.extractUserId(decoded);
    const sessionId = jwtUtil.extractSessionId(decoded);

    const session = await Session.findOne({
      where: {
        id: sessionId,
        user_id: userId,
        is_revoked: false,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!session) {
      return next(new Error(ACCESS_TOKEN_EXPIRED.message));
    }

    socket.userId = userId;
    socket.sessionId = sessionId;

    next();
  } catch (err) {
    return next(new Error(INVALID_ACCESS_TOKEN.message));
  }
};

module.exports = socketMiddleware;
