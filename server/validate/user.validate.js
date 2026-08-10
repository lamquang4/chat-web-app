const { z } = require("zod");
const {
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
} = require("../constants/limit");
const ErrorCode = require("../utils/error.code");
const { validatePhone } = require("../utils/validators");

const updateUserSchema = z.object({
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

  phone: z
    .string()
    .trim()
    .min(1, ErrorCode.PHONE_REQUIRED.message)
    .refine(validatePhone, { message: ErrorCode.PHONE_INVALID.message }),

  avatar_url: z.string().trim().nullable(),
});

module.exports = {
  updateUserSchema,
};
