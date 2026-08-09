const Session = require("../entities/session.entity");
const Otp = require("../entities/otp.entity");
const User = require("../entities/user.entity");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const ms = require("ms");
const config = require("../config/app.config");
const transporter = require("../config/nodemailer.config");
const AppError = require("../utils/app.error");
const {
  REGISTRATION_ALREADY_PENDING,
  EMAIL_ALREADY_EXISTS,
  PHONE_ALREADY_EXISTS,
  INVALID_CREDENTIALS,
  REGISTRATION_SESSION_EXPIRED,
  OTP_MAX_ATTEMPTS_EXCEEDED,
  OTP_INVALID,
  OTP_RESEND_TOO_SOON,
  EMAIL_NOT_VERIFIED,
  INVALID_REFRESH_TOKEN,
  SESSION_REVOKED,
  SESSION_EXPIRED,
  SESSION_NOT_FOUND,
} = require("../utils/error.code");
const { generateOtpCode, hashOtp } = require("../utils/otp.util");
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
} = require("../utils/jwt.util");
const {
  OTP_EXPIRE_SECONDS,
  OTP_MAX_ATTEMPTS,
  OTP_RESEND_COOLDOWN_SECONDS,
} = require("../constants/limit");

const buildOtpEmailHtml = (otp_code) => `
  <div
    style="
      font-size: 16px;
      line-height: 20px;
      padding-top: 20px;
      text-align: center;
      font-family: Arial, sans-serif;
      color: black;
    "
  >
    <p>Mã xác minh của bạn:</p>

    <h2 style="letter-spacing: 8px; text-align: center;">
      ${otp_code}
    </h2>

    <p>Mã này chỉ dùng được một lần.</p>

    <p>
      Mã sẽ hết hạn sau ${OTP_EXPIRE_SECONDS / 60} phút.
    </p>
  </div>
`;

const sendOtpEmail = async (to, otp_code) => {
  await transporter.sendMail({
    from: config.nodemailer.from,
    to,
    subject: "Mã xác thực OTP",
    html: buildOtpEmailHtml(otp_code),
  });
};

const register = async ({ first_name, last_name, email, phone, password }) => {
  const existing_user = await User.findOne({
    where: {
      [Op.or]: [{ email }, { phone }],
    },
  });

  if (existing_user) {
    if (existing_user.email === email) {
      if (!existing_user.is_verified) {
        throw new AppError(REGISTRATION_ALREADY_PENDING);
      }

      throw new AppError(EMAIL_ALREADY_EXISTS);
    }

    if (existing_user.phone === phone) {
      throw new AppError(PHONE_ALREADY_EXISTS);
    }
  }

  const password_hash = await bcrypt.hash(password, config.bcryptSaltRounds);

  const otp_code = generateOtpCode();
  const otp_code_hash = hashOtp(otp_code);

  await User.create({
    first_name,
    last_name,
    email,
    phone,
    password_hash,
    is_verified: false,
  });

  await Otp.create({
    email,
    otp_code_hash,
    attempts: 0,
    expires_at: new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000),
  });

  await sendOtpEmail(email, otp_code);

  return null;
};

const verifyRegisterOtp = async ({ email, otp_code }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new AppError(INVALID_CREDENTIALS);
  }

  if (user.is_verified) {
    throw new AppError(EMAIL_ALREADY_EXISTS);
  }

  const otp = await Otp.findOne({
    where: { email },
    order: [["created_at", "DESC"]],
  });

  if (!otp) {
    throw new AppError(REGISTRATION_SESSION_EXPIRED);
  }

  if (otp.expires_at <= new Date()) {
    await otp.destroy();
    throw new AppError(REGISTRATION_SESSION_EXPIRED);
  }

  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    throw new AppError(OTP_MAX_ATTEMPTS_EXCEEDED);
  }

  const otp_code_hash = hashOtp(otp_code);

  if (otp.otp_code_hash !== otp_code_hash) {
    otp.attempts += 1;
    await otp.save();
    throw new AppError(OTP_INVALID);
  }

  user.is_verified = true;
  await user.save();

  await otp.destroy();

  return null;
};

const resendRegisterOtp = async (email) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new AppError(REGISTRATION_SESSION_EXPIRED);
  }

  if (user.is_verified) {
    throw new AppError(EMAIL_ALREADY_EXISTS);
  }

  const current_otp = await Otp.findOne({
    where: { email },
    order: [["created_at", "DESC"]],
  });

  if (current_otp) {
    const cooldown_expires_at =
      current_otp.created_at.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000;

    if (Date.now() < cooldown_expires_at) {
      throw new AppError(OTP_RESEND_TOO_SOON);
    }

    await current_otp.destroy();
  }

  const otp_code = generateOtpCode();
  const otp_code_hash = hashOtp(otp_code);

  await Otp.create({
    email,
    otp_code_hash,
    attempts: 0,
    expires_at: new Date(Date.now() + OTP_EXPIRE_SECONDS * 1000),
  });

  await sendOtpEmail(email, otp_code);

  return null;
};

const login = async ({ email, password, user_agent, ip_address }) => {
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    throw new AppError(INVALID_CREDENTIALS);
  }

  if (!user.is_verified) {
    throw new AppError(EMAIL_NOT_VERIFIED);
  }

  const is_password_valid = await bcrypt.compare(password, user.password_hash);

  if (!is_password_valid) {
    throw new AppError(INVALID_CREDENTIALS);
  }

  await Session.destroy({
    where: { user_id: user.id },
  });

  const refresh_token = generateRefreshToken(user.id);
  const refresh_token_hash = hashToken(refresh_token);
  const expires_at = new Date(Date.now() + ms(config.jwt.sessionExpiration));

  const session = await Session.create({
    user_id: user.id,
    refresh_token_hash,
    user_agent: user_agent || null,
    ip_address: ip_address || null,
    expires_at,
  });

  const access_token = generateAccessToken(user.id, session.id);

  return {
    user_id: String(user.id),
    access_token,
    refresh_token,
    expires_in: Math.floor(ms(config.jwt.accessExpiration) / 1000),
    session_id: String(session.id),
  };
};

const refreshToken = async (refresh_token) => {
  if (!refresh_token) {
    throw new AppError(INVALID_REFRESH_TOKEN);
  }

  let payload;

  try {
    payload = verifyRefreshToken(refresh_token);
  } catch (error) {
    throw new AppError(INVALID_REFRESH_TOKEN);
  }

  const refresh_token_hash = hashToken(refresh_token);

  const session = await Session.findOne({
    where: {
      refresh_token_hash,
      user_id: payload.sub,
    },
  });

  if (!session) {
    throw new AppError(INVALID_REFRESH_TOKEN);
  }

  if (session.is_revoked) {
    throw new AppError(SESSION_REVOKED);
  }

  if (session.expires_at <= new Date()) {
    await session.destroy();
    throw new AppError(SESSION_EXPIRED);
  }

  const user = await User.findByPk(payload.sub);

  if (!user) {
    throw new AppError(INVALID_REFRESH_TOKEN);
  }

  if (!user.is_verified) {
    throw new AppError(EMAIL_NOT_VERIFIED);
  }

  const access_token = generateAccessToken(user.id, session.id);

  session.last_active_at = new Date();
  await session.save();

  return {
    access_token,
    expires_in: Math.floor(ms(config.jwt.accessExpiration) / 1000),
  };
};

const logout = async (user_id, session_id) => {
  const session = await Session.findOne({
    where: { id: session_id, user_id },
  });

  if (!session) {
    throw new AppError(SESSION_NOT_FOUND);
  }

  session.is_revoked = true;
  await session.save();

  return null;
};

module.exports = {
  register,
  verifyRegisterOtp,
  resendRegisterOtp,
  login,
  refreshToken,
  logout,
};
