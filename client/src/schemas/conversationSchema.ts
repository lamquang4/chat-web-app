import { z } from "zod";
import { MAX_GROUP_MEMBERS, MAX_GROUP_NAME_LENGTH } from "../constants/limit";
import { imageSchema } from "./uploadSchema";

const groupNameSchema = z
  .string()
  .trim()
  .min(1, "Tên nhóm không để trống")
  .max(MAX_GROUP_NAME_LENGTH, `Tên nhóm tối đa ${MAX_GROUP_NAME_LENGTH} ký tự`);

export const createGroupSchema = z.object({
  name: groupNameSchema,
  member_ids: z
    .array(z.string())
    .min(2, "Nhóm phải có ít nhất 2 thành viên")
    .max(MAX_GROUP_MEMBERS, `Nhóm tối đa ${MAX_GROUP_MEMBERS} thành viên`)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Danh sách thành viên bị trùng",
    }),
  avatar: imageSchema.optional(),
});
export type CreateGroupData = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = z.object({
  name: groupNameSchema,
  avatar: imageSchema.optional(),
});
export type UpdateGroupData = z.infer<typeof updateGroupSchema>;

export const addGroupMembersSchema = z.object({
  member_ids: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất 1 thành viên để thêm")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Danh sách thành viên bị trùng",
    }),
});

export type AddGroupMembersData = z.infer<typeof addGroupMembersSchema>;
