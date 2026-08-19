import { useEffect } from "react";
import { getSocket, onSocketReady } from "./socket";

export function useSocketListener<T>(
  event: string,
  handler: (payload: T) => void,
) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const unsubscribeReady = onSocketReady(() => {
      const socket = getSocket();
      socket.on(event, handler);
      cleanup = () => socket.off(event, handler);
    });

    return () => {
      unsubscribeReady();
      cleanup?.();
    };
  }, [event, handler]);
}
