import type {
  ApiResponse,
  UserResponse,
  UpdateUserRequest,
} from "../types/types";
import { axiosInstance } from "./axiosInstance";

const BASE = "/users";

const buildUpdateUserFormData = (data: UpdateUserRequest) => {
  const formData = new FormData();
  formData.append("first_name", data.first_name);
  formData.append("last_name", data.last_name);
  formData.append("phone", data.phone);
  if (data.avatar) formData.append("avatar", data.avatar);
  return formData;
};

export const userApi = {
  getAccount: () =>
    axiosInstance
      .get<ApiResponse<UserResponse>>(`${BASE}/me`)
      .then((r) => r.data),

  updateUser: (data: UpdateUserRequest) =>
    axiosInstance
      .put<
        ApiResponse<UserResponse>
      >(`${BASE}/me`, buildUpdateUserFormData(data))
      .then((r) => r.data),
};
