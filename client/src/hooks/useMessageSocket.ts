import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type {
  ApiResponse,
  ConversationDetailResponse,
  MessageResponse,
} from "../types/types";
import { conversationKeys } from "./queries/useConversations";
import { useSocketListener } from "./socket/useSocketListener";
import { SOCKET_EVENTS } from "./socket/events";

const conversationDetailQueryKey = (conversationId: string) => [
  ...conversationKeys.all,
  "detail",
  conversationId,
];

interface ConversationDetailQueryData {
  pages: Array<ApiResponse<ConversationDetailResponse>>;
  pageParams: unknown[];
}

export function useMessageSocket(conversationId: string) {
  const queryClient = useQueryClient();

  const handleNewMessage = useCallback(
    (message: MessageResponse) => {
      if (message.conversation_id !== conversationId) return;

      queryClient.invalidateQueries({
        queryKey: conversationDetailQueryKey(conversationId),
      });

      // Cập nhật luôn last_message ở sidebar, khỏi cần gọi lại REST
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
    },
    [conversationId, queryClient],
  );

  const handleRecalled = useCallback(
    ({ message_id }: { message_id: string }) => {
      void message_id;
      queryClient.invalidateQueries({
        queryKey: conversationDetailQueryKey(conversationId),
      });
    },
    [conversationId, queryClient],
  );

  useSocketListener(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
  useSocketListener(SOCKET_EVENTS.MESSAGE_RECALLED, handleRecalled);
  useSocketListener(
    SOCKET_EVENTS.MESSAGE_SEEN,
    ({
      conversation_id,
      message_id,
      seen_by,
    }: {
      conversation_id: string;
      message_id: string;
      seen_by: MessageResponse["seen_by"];
    }) => {
      if (conversation_id !== conversationId) return;
      queryClient.setQueriesData<ConversationDetailQueryData>(
        { queryKey: conversationDetailQueryKey(conversationId) },
        (old) => {
          if (!old?.pages) return old;

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                messages: {
                  ...page.data.messages,
                  content: page.data.messages.content.map(
                    (message: MessageResponse) =>
                      message.message_id === message_id
                        ? {
                            ...message,
                            seen_by,
                            is_seen: seen_by.some(
                              (user) => user.user_id !== message.sender_id,
                            ),
                          }
                        : message,
                  ),
                },
              },
            })),
          };
        },
      );
    },
  );
}
