import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { conversationKeys } from "./queries/useConversations";
import { useSocketListener } from "./socket/useSocketListener";
import { SOCKET_EVENTS } from "./socket/events";

export function useConversationListSocket() {
  const queryClient = useQueryClient();

  const handleNewMessage = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: [...conversationKeys.all, "list"],
    });
  }, [queryClient]);

  useSocketListener(SOCKET_EVENTS.MESSAGE_NEW, handleNewMessage);
  useSocketListener(SOCKET_EVENTS.MESSAGE_SEEN, handleNewMessage);
}
