import { z } from "zod";
import { validatePhone } from "../utils/validators";

export const updateUserSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "Họ không để trống")
    .max(50, "Họ tối đa 50 ký tự"),

  last_name: z
    .string()
    .trim()
    .min(1, "Tên không để trống")
    .max(50, "Tên tối đa 50 ký tự"),

  email: z
    .string()
    .trim()
    .min(1, "Email không để trống")
    .email("Email không hợp lệ"),

  phone: z
    .string()
    .trim()
    .min(1, "Số điện thoại không để trống")
    .refine(validatePhone, "Số điện thoại không hợp lệ"),

  avatar_url: z.string().trim().url("Đường dẫn ảnh không hợp lệ").nullable(),
});

export type UpdateUserData = z.infer<typeof updateUserSchema>;
