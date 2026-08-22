import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { jwtUtil } from "../utils/jwtUtil";
import type { ApiResponse, RefreshTokenResponse } from "../types/types";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Dùng cho route không cần token
export const axiosPublic = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 10000,
});

// Dùng cho route cần token
export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 10000,
});

// Nếu có nhiều request cùng lúc phát hiện accessToken hết hạn
// Chỉ gọi 1 API refresh token duy nhất
// Các request còn lại sẽ chờ kết quả refresh của 1 refresh thôi
let refreshPromise: Promise<string> | null = null;

// Khi refresh token hết hạn hoặc không hợp lệ thì xóa access token + refresh token
const handleInvalidRefreshToken = (error: unknown): void => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    jwtUtil.clearTokens();
    window.location.href = "/";
  }
};

// Hàm gọi API để lấy access token mới bằng refresh token
export const refreshAccessToken = (): Promise<string> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = jwtUtil.getRefreshTokenRaw();
    if (!refreshToken) throw new Error("Không có refresh token");

    const { data } = await axiosPublic.post<ApiResponse<RefreshTokenResponse>>(
      "/auth/refresh-token",
      { refresh_token: refreshToken },
    );

    jwtUtil.setAccessToken(data.data.access_token);
    return data.data.access_token;
  })();

  refreshPromise.then(
    () => {
      refreshPromise = null;
    },
    () => {
      refreshPromise = null;
    },
  );

  return refreshPromise;
};

// chủ động kiểm tra và refresh token TRƯỚC khi nó thực sự hết hạn  (để hạn chế tối đa việc request bị BE trả về lỗi 401)
axiosInstance.interceptors.request.use(async (config) => {
  let accessToken = jwtUtil.getAccessTokenRaw();

  if (
    jwtUtil.hasValidLocalRefreshToken() &&
    (!accessToken || jwtUtil.isAccessTokenExpiringSoon())
  ) {
    try {
      accessToken = await refreshAccessToken();
    } catch (error) {
      handleInvalidRefreshToken(error);
      return Promise.reject(error);
    }
  }

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Khi BE trả về response nếu accessToken vẫn bị BE từ chối vì hết hạn
// thì refresh lại và retry request đó đúng 1 lần duy nhất
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ code?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const errorCode = error.response?.data?.code;

    const isAccessTokenExpired =
      status === 401 && errorCode === "ACCESS_TOKEN_EXPIRED";

    if (
      isAccessTokenExpired &&
      originalRequest &&
      !originalRequest._retry &&
      jwtUtil.hasValidLocalRefreshToken()
    ) {
      originalRequest._retry = true; // Đánh dấu đã retry, tránh lặp vô hạn nếu vẫn lỗi

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        handleInvalidRefreshToken(refreshError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
