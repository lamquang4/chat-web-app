import type {
  ApiResponse,
  MessageResponse,
  SendMessageRequest,
} from "../types/types";
import { axiosInstance } from "./axiosInstance";

const BASE = "/messages";

const buildSendMessageFormData = (data: SendMessageRequest) => {
  const formData = new FormData();
  if (data.content) formData.append("content", data.content);
  if (data.reply_message_id)
    formData.append("reply_message_id", data.reply_message_id);
  data.attachments?.forEach((file) => formData.append("attachments", file));
  return formData;
};

export const messageApi = {
  sendMessage: (conversationId: string, data: SendMessageRequest) =>
    axiosInstance
      .post<
        ApiResponse<MessageResponse>
      >(`${BASE}/${conversationId}`, buildSendMessageFormData(data))
      .then((r) => r.data),

  recallMessage: (messageId: string) =>
    axiosInstance
      .patch<ApiResponse<null>>(`${BASE}/${messageId}/recall`)
      .then((r) => r.data),
};
