import { z } from "zod";
import { validatePhone } from "../utils/validators";
import {
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
} from "../constants/limit";
import { imageSchema } from "./uploadSchema";

export const updateUserSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "Họ không để trống")
    .max(MAX_FIRST_NAME_LENGTH, `Họ tối đa ${MAX_FIRST_NAME_LENGTH} ký tự`),
  last_name: z
    .string()
    .trim()
    .min(1, "Tên không để trống")
    .max(MAX_LAST_NAME_LENGTH, `Tên tối đa ${MAX_LAST_NAME_LENGTH} ký tự`),
  phone: z
    .string()
    .trim()
    .min(1, "Số điện thoại không để trống")
    .refine(validatePhone, { message: "Số điện thoại không hợp lệ" }),
  avatar: imageSchema.optional(),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;
