import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import type {
  ApiResponse,
  ErrorResponse,
  MessageResponse,
  SendMessageRequest,
} from "../../types/types";
import { messageApi } from "../../apis/messageApi";
import { conversationKeys } from "./useConversations";

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<MessageResponse>,
    AxiosError<ErrorResponse>,
    SendMessageRequest
  >({
    mutationFn: (data) => messageApi.sendMessage(conversationId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Gửi tin nhắn thất bại");
    },
  });
};

export const useRecallMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (messageId) => messageApi.recallMessage(messageId),

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
      toast.success(res.message || "Đã thu hồi tin nhắn");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Thu hồi tin nhắn thất bại");
    },
  });
};
