import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email không để trống")
    .email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không để trống"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
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
    .regex(
      /^(03[2-9]|05[689]|07[06-9]|08[0-689]|09[0-46-9])[0-9]{7}$/,
      "Số điện thoại không hợp lệ",
    ),

  password: z
    .string()
    .min(1, "Mật khẩu không để trống")
    .min(6, "Mật khẩu tối thiểu 6 ký tự")
    .max(100, "Mật khẩu tối đa 100 ký tự"),
});

export type RegisterData = z.infer<typeof registerSchema>;
