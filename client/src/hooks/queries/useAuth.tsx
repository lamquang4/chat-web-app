import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import type {
  ApiResponse,
  ErrorResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyRegisterOtpRequest,
  ResendRegisterOtpRequest,
} from "../../types/types";
import { authApi } from "../../apis/authApi";
import { jwtUtil } from "../../utils/jwtUtil";
import { connectSocket, disconnectSocket } from "../socket/socket";

export const authKeys = {
  all: ["auth"] as const,
};

export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<
    ApiResponse<LoginResponse>,
    AxiosError<ErrorResponse>,
    LoginRequest
  >({
    mutationFn: (data) => authApi.login(data),

    onSuccess: (res) => {
      const data = res.data;

      // Lưu Access Token
      jwtUtil.setAccessToken(data.access_token);

      // Lưu Refresh Token
      jwtUtil.setRefreshToken(data.refresh_token);

      toast.success(res.message || "Đăng nhập thành công");

      connectSocket();

      navigate("/messages", { replace: true });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Đăng nhập thất bại");
    },
  });
};

export const useRegister = () => {
  return useMutation<
    ApiResponse<null>,
    AxiosError<ErrorResponse>,
    RegisterRequest
  >({
    mutationFn: (data) => authApi.register(data),

    onSuccess: (res) => {
      toast.success(res.message || "Đăng ký thành công");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Đăng ký thất bại");
    },
  });
};

export const useVerifyRegisterOtp = () => {
  return useMutation<
    ApiResponse<null>,
    AxiosError<ErrorResponse>,
    VerifyRegisterOtpRequest
  >({
    mutationFn: (data) => authApi.verifyRegisterOtp(data),

    onSuccess: (res) => {
      toast.success(res.message || "Xác thực OTP thành công");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xác thực OTP thất bại");
    },
  });
};

export const useResendRegisterOtp = () => {
  return useMutation<
    ApiResponse<null>,
    AxiosError<ErrorResponse>,
    ResendRegisterOtpRequest
  >({
    mutationFn: (data) => authApi.resendRegisterOtp(data),

    onSuccess: (res) => {
      toast.success(res.message || "Đã gửi lại mã OTP");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Gửi lại OTP thất bại");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, void>({
    mutationFn: () => authApi.logout(),

    onSuccess: (res) => {
      jwtUtil.clearTokens();

      queryClient.clear();

      toast.success(res.message || "Đăng xuất thành công");

      disconnectSocket();

      navigate("/", {
        replace: true,
      });
    },

    onError: (error) => {
      jwtUtil.clearTokens();

      queryClient.clear();

      disconnectSocket();

      navigate("/", {
        replace: true,
      });

      toast.error(error.response?.data?.message ?? "Đăng xuất thất bại");
    },
  });
};
