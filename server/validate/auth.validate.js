const {
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MAX_PASSWORD_LENGTH,
} = require("../constants/limit");
const { z } = require("zod");
const ErrorCode = require("../utils/error.code");
const {
  validateOtp,
  validatePassword,
  validatePhone,
} = require("../utils/validators");
const { OTP_LENGTH } = require("../constants/limit");

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, ErrorCode.EMAIL_REQUIRED.message)
    .email(ErrorCode.EMAIL_INVALID.message),
  password: z.string().min(1, ErrorCode.PASSWORD_REQUIRED.message),
});

const registerSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, ErrorCode.FIRST_NAME_REQUIRED.message)
    .max(MAX_FIRST_NAME_LENGTH, ErrorCode.FIRST_NAME_TOO_LONG.message),
  last_name: z
    .string()
    .trim()
    .min(1, ErrorCode.LAST_NAME_REQUIRED.message)
    .max(MAX_LAST_NAME_LENGTH, ErrorCode.LAST_NAME_TOO_LONG.message),
  email: z
    .string()
    .trim()
    .min(1, ErrorCode.EMAIL_REQUIRED.message)
    .email(ErrorCode.EMAIL_INVALID.message),
  phone: z
    .string()
    .trim()
    .min(1, ErrorCode.PHONE_REQUIRED.message)
    .refine(validatePhone, { message: ErrorCode.PHONE_INVALID.message }),
  password: z
    .string()
    .min(1, ErrorCode.PASSWORD_REQUIRED.message)
    .max(MAX_PASSWORD_LENGTH, ErrorCode.PASSWORD_TOO_LONG.message)
    .refine(validatePassword, { message: ErrorCode.PASSWORD_WEAK.message }),
});

const sendRegisterOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, ErrorCode.EMAIL_REQUIRED.message)
    .email(ErrorCode.EMAIL_INVALID.message),
});

const verifyRegisterOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, ErrorCode.EMAIL_REQUIRED.message)
    .email(ErrorCode.EMAIL_INVALID.message),
  otp_code: z
    .string()
    .trim()
    .length(OTP_LENGTH, ErrorCode.OTP_LENGTH_INVALID.message)
    .refine(validateOtp, { message: ErrorCode.OTP_INVALID.message }),
});

const refreshTokenSchema = z.object({
  refresh_token: z.string().min(1, ErrorCode.INVALID_REFRESH_TOKEN?.message),
});

module.exports = {
  loginSchema,
  registerSchema,
  sendRegisterOtpSchema,
  verifyRegisterOtpSchema,
  refreshTokenSchema
};
