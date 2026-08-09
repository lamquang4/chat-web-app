const crypto = require("crypto");
const { OTP_LENGTH } = require("../constants/limit");
const config = require("../config/app.config");

const generateOtpCode = () => {
  const max = 10 ** OTP_LENGTH;
  const code = crypto.randomInt(0, max);
  return code.toString().padStart(OTP_LENGTH, "0");
};

const hashOtp = (otpCode) => {
  return crypto
    .createHmac("sha256", config.otpHashSecret)
    .update(otpCode)
    .digest("hex");
};

module.exports = { generateOtpCode, hashOtp };
