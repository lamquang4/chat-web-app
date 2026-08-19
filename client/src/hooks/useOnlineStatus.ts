import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket, onSocketReady } from "./socket/socket";
import { SOCKET_EVENTS } from "./socket/events";
import { conversationKeys } from "./queries/useConversations";
import { friendKeys } from "./queries/useFriends";

export function useOnlineStatus(initialOnlineIds: string[] = []) {
  const queryClient = useQueryClient();
  const [onlineIds, setOnlineIds] = useState(new Set(initialOnlineIds));

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const unsubscribeReady = onSocketReady(() => {
      const socket = getSocket();

      const handleOnline = ({ user_id }: { user_id: string }) => {
        setOnlineIds((prev) => new Set(prev).add(user_id));
        queryClient.invalidateQueries({ queryKey: conversationKeys.all });
        queryClient.invalidateQueries({ queryKey: friendKeys.all });
      };
      const handleOffline = ({ user_id }: { user_id: string }) => {
        setOnlineIds((prev) => {
          const next = new Set(prev);
          next.delete(user_id);
          return next;
        });
        queryClient.invalidateQueries({ queryKey: conversationKeys.all });
        queryClient.invalidateQueries({ queryKey: friendKeys.all });
      };

      socket.on(SOCKET_EVENTS.USER_ONLINE, handleOnline);
      socket.on(SOCKET_EVENTS.USER_OFFLINE, handleOffline);

      cleanup = () => {
        socket.off(SOCKET_EVENTS.USER_ONLINE, handleOnline);
        socket.off(SOCKET_EVENTS.USER_OFFLINE, handleOffline);
      };
    });

    return () => {
      unsubscribeReady();
      cleanup?.();
    };
  }, [queryClient]);

  return onlineIds;
}
