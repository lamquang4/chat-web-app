import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  ApiResponse,
  ConversationDetailResponse,
  ConversationListResponse,
} from "../types/types";
import { conversationKeys } from "./queries/useConversations";
import { useSocketListener } from "./socket/useSocketListener";
import { SOCKET_EVENTS } from "./socket/events";
import { useNavigate } from "react-router-dom";

export function useConversationSocket() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Bị thêm vào 1 nhóm mới
  const handleCreatedGroup = useCallback(
    (conversation: ConversationListResponse) => {
      queryClient.setQueriesData<
        ApiResponse<{ content: ConversationListResponse[] }>
      >({ queryKey: [...conversationKeys.all, "list"] }, (old) => {
        if (!old) return old;
        const exists = old.data.content.some(
          (c) => c.conversation_id === conversation.conversation_id,
        );
        if (exists) return old;

        return {
          ...old,
          data: { ...old.data, content: [conversation, ...old.data.content] },
        };
      });
    },
    [queryClient],
  );

  // Nhóm bị sửa tên/avatar/thành viên bởi người khác
  const handleUpdatedGroup = useCallback(
    (conversation: ConversationListResponse) => {
      queryClient.setQueriesData<
        ApiResponse<{ content: ConversationListResponse[] }>
      >({ queryKey: [...conversationKeys.all, "list"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            content: old.data.content.map((c) =>
              c.conversation_id === conversation.conversation_id
                ? conversation
                : c,
            ),
          },
        };
      });

      queryClient.setQueriesData<ApiResponse<ConversationDetailResponse>>(
        {
          queryKey: [
            ...conversationKeys.all,
            "detail",
            conversation.conversation_id,
          ],
        },
        (old) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  name: conversation.name,
                  avatar_url: conversation.avatar_url,
                  is_online: conversation.is_online,
                },
              }
            : old,
      );
    },
    [queryClient],
  );

  // Nhóm bị giải tán bởi owner
  const handleDeletedGroup = useCallback(
    (conversation_id: string) => {
      queryClient.setQueriesData<
        ApiResponse<{ content: ConversationListResponse[] }>
      >({ queryKey: [...conversationKeys.all, "list"] }, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            content: old.data.content.filter(
              (c) => c.conversation_id !== conversation_id,
            ),
          },
        };
      });

      const wasViewingDeletedConversation = queryClient.getQueryData([
        ...conversationKeys.all,
        "detail",
        conversation_id,
      ]);

      queryClient.removeQueries({
        queryKey: [...conversationKeys.all, "detail", conversation_id],
      });

      // Nếu người dùng cố mở đúng conversation vừa bị xóa
      if (
        wasViewingDeletedConversation &&
        window.location.pathname.includes(conversation_id)
      ) {
        navigate("/");
      }
    },
    [queryClient, navigate],
  );

  const handleConversationActivity = useCallback(
    (payload: { conversation_id: string }) => {
      queryClient.invalidateQueries({
        queryKey: [...conversationKeys.all, "list"],
      });

      queryClient.invalidateQueries({
        queryKey: [...conversationKeys.all, "detail", payload.conversation_id],
      });
    },
    [queryClient],
  );

  useSocketListener(SOCKET_EVENTS.MESSAGE_NEW, handleConversationActivity);
  useSocketListener(SOCKET_EVENTS.MESSAGE_SEEN, handleConversationActivity);
  useSocketListener(SOCKET_EVENTS.CONVERSATION_CREATED, handleCreatedGroup);
  useSocketListener(SOCKET_EVENTS.CONVERSATION_UPDATED, handleUpdatedGroup);
  useSocketListener(SOCKET_EVENTS.CONVERSATION_DELETED, handleDeletedGroup);
}
