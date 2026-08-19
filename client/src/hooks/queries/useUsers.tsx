import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import type {
  ApiResponse,
  ErrorResponse,
  UserResponse,
  UpdateUserRequest,
} from "../../types/types";
import { userApi } from "../../apis/userApi";

export const userKeys = {
  all: ["users"] as const,
  me: () => [...userKeys.all, "me"] as const,
};

export const useGetAccount = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: () => userApi.getAccount(),
    select: (res) => res.data,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<UserResponse>,
    AxiosError<ErrorResponse>,
    UpdateUserRequest
  >({
    mutationFn: (data) => userApi.updateUser(data),

    onSuccess: (res) => {
      queryClient.setQueryData(userKeys.me(), res);
      toast.success(res.message || "Cập nhật thông tin thành công");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Cập nhật thất bại");
    },
  });
};
