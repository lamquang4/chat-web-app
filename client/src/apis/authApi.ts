import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyRegisterOtpRequest,
  ResendRegisterOtpRequest,
} from "../types/types";
import { axiosInstance, axiosPublic } from "./axiosInstance";

const BASE = "/auth";

export const authApi = {
  register: (data: RegisterRequest) =>
    axiosPublic
      .post<ApiResponse<null>>(`${BASE}/register`, data)
      .then((r) => r.data),

  verifyRegisterOtp: (data: VerifyRegisterOtpRequest) =>
    axiosPublic
      .post<ApiResponse<null>>(`${BASE}/register/otp/verify`, data)
      .then((r) => r.data),

  resendRegisterOtp: (data: ResendRegisterOtpRequest) =>
    axiosPublic
      .post<ApiResponse<null>>(`${BASE}/register/otp/resend`, data)
      .then((r) => r.data),

  login: (data: LoginRequest) =>
    axiosPublic
      .post<ApiResponse<LoginResponse>>(`${BASE}/login`, data)
      .then((r) => r.data),

  logout: () =>
    axiosInstance.post<ApiResponse<null>>(`${BASE}/logout`).then((r) => r.data),
};
