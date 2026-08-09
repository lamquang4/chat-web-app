const jwt = require("jsonwebtoken");
const config = require("../config/app.config");
const crypto = require("crypto");

const generateAccessToken = (userId, sessionId) => {
  return jwt.sign(
    { sub: String(userId), session_id: String(sessionId) },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiration },
  );
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ sub: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiration,
  });
};

const verifyAccessToken = (token) => jwt.verify(token, config.jwt.accessSecret);
const verifyRefreshToken = (token) =>
  jwt.verify(token, config.jwt.refreshSecret);

const extractUserId = (decoded) => decoded.sub;
const extractSessionId = (decoded) => decoded.session_id;

const hashToken = (token) => {
  return crypto
    .createHmac("sha256", config.secret.refreshTokenHashSecret)
    .update(token)
    .digest("hex");
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractUserId,
  extractSessionId,
  hashToken,
};
