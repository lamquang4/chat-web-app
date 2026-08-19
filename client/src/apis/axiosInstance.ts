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

let refreshPromise: Promise<string> | null = null;

export const performRefresh = (): Promise<string> => {
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

axiosInstance.interceptors.request.use(async (config) => {
  let accessToken = jwtUtil.getAccessTokenRaw();

  if (
    jwtUtil.hasValidLocalRefreshToken() &&
    (!accessToken || jwtUtil.isAccessTokenExpiringSoon())
  ) {
    try {
      accessToken = await performRefresh();
    } catch {
      accessToken = undefined;
    }
  }

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Response interceptor
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
      originalRequest._retry = true;

      try {
        const newToken = await performRefresh();
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch {
        jwtUtil.clearTokens();
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
