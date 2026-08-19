const { z } = require("zod");
const {
  MAX_GROUP_MEMBERS,
  MAX_GROUP_NAME_LENGTH,
} = require("../constants/limit");
const ErrorCode = require("../utils/error.code");

const groupNameSchema = z
  .string()
  .trim()
  .min(1, ErrorCode.GROUP_NAME_REQUIRED.message)
  .max(MAX_GROUP_NAME_LENGTH, ErrorCode.GROUP_NAME_TOO_LONG.message);

const createGroupSchema = z.object({
  name: groupNameSchema,
  member_ids: z
    .array(z.string())
    .min(2, ErrorCode.GROUP_MEMBERS_REQUIRED.message)
    .max(MAX_GROUP_MEMBERS, ErrorCode.GROUP_MEMBERS_TOO_MANY.message)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: ErrorCode.GROUP_MEMBERS_DUPLICATE.message,
    }),
});

const updateGroupSchema = z.object({
  name: groupNameSchema,
});

const addGroupMembersSchema = z.object({
  member_ids: z
    .array(z.string())
    .min(1, ErrorCode.GROUP_MEMBERS_REQUIRED.message)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: ErrorCode.GROUP_MEMBERS_DUPLICATE.message,
    }),
});

module.exports = {
  createGroupSchema,
  updateGroupSchema,
  addGroupMembersSchema,
};
