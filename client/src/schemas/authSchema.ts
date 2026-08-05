import { z } from "zod";
import {
  validateOtp,
  validatePassword,
  validatePhone,
} from "../utils/validators";
import { OTP_LENGTH } from "../constants/otp";
import { MAX_PASSWORD_LENGTH } from "../constants/limit";

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
    .max(MAX_PASSWORD_LENGTH, `Mật khẩu tối đa ${MAX_PASSWORD_LENGTH} ký tự`)
    .refine(validatePassword, {
      message:
        "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
    }),
});

export type RegisterData = z.infer<typeof registerSchema>;

export const sendOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email không để trống")
    .email("Email không hợp lệ"),
});

export type SendOtpData = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email không để trống")
    .email("Email không hợp lệ"),
  otp_code: z
    .string()
    .trim()
    .length(OTP_LENGTH, `Mã OTP gồm ${OTP_LENGTH} chữ số`)
    .refine(validateOtp, "Mã OTP không hợp lệ"),
});

export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;
