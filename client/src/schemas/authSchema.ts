import { z } from "zod";
import { validatePassword, validatePhone } from "../utils/validators";


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
    .refine(validatePhone, {
      message: "Số điện thoại không hợp lệ",
    }),

  password: z
    .string()
    .min(1, "Mật khẩu không để trống")
    .max(100, "Mật khẩu tối đa 100 ký tự")
    .refine(validatePassword, {
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }),
});

export type RegisterData = z.infer<typeof registerSchema>;
