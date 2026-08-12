const { z } = require("zod");
const { MAX_CONTENT_LENGTH } = require("../constants/limit");
const ErrorCode = require("../utils/error.code");

const sendMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .max(MAX_CONTENT_LENGTH, ErrorCode.MESSAGE_CONTENT_TOO_LONG.message)
    .optional(),
  reply_message_id: z.string().optional(),
});

module.exports = {
  sendMessageSchema,
};
