const jwt = require("jsonwebtoken");
const config = require("../config/app.config");

const generateAccessToken = (userId) => {
  return jwt.sign({ sub: userId }, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiration,
  });
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

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractUserId,
};
