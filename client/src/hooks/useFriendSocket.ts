import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { friendKeys } from "./queries/useFriends";
import { conversationKeys } from "./queries/useConversations";
import { useSocketListener } from "./socket/useSocketListener";
import { SOCKET_EVENTS } from "./socket/events";

export function useFriendSocket() {
  const queryClient = useQueryClient();

  const invalidateFriendData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: friendKeys.all });
    queryClient.invalidateQueries({ queryKey: conversationKeys.all });
  }, [queryClient]);

  useSocketListener(
    SOCKET_EVENTS.FRIEND_REQUEST_RECEIVED,
    invalidateFriendData,
  );
  useSocketListener(
    SOCKET_EVENTS.FRIEND_REQUEST_ACCEPTED,
    invalidateFriendData,
  );
  useSocketListener(
    SOCKET_EVENTS.FRIEND_REQUEST_REJECTED,
    invalidateFriendData,
  );
  useSocketListener(SOCKET_EVENTS.FRIEND_REMOVED, invalidateFriendData);
}
