import { io, type Socket } from "socket.io-client";
import { jwtUtil } from "../../utils/jwtUtil";
import { performRefresh } from "../../apis/axiosInstance";

let socket: Socket | null = null;
let readyCallbacks: Array<() => void> = [];
let connectPromise: Promise<void> | null = null;

export const connectSocket = async (): Promise<void> => {
  if (socket?.connected || socket?.active)
    return connectPromise ?? Promise.resolve();
  if (connectPromise) return connectPromise;

  connectPromise = (async () => {
    if (!jwtUtil.hasValidLocalRefreshToken()) return;

    try {
      if (jwtUtil.isAccessTokenExpired()) {
        await performRefresh();
      }
    } catch {
      jwtUtil.clearTokens();
      return;
    }

    const token = jwtUtil.getAccessTokenRaw();
    if (!token) return;

    const nextSocket = io(import.meta.env.VITE_BACKEND_URL, {
      auth: { token },
      autoConnect: false,
    });
    socket = nextSocket;

    nextSocket.on("connect", () => {
      readyCallbacks.forEach((callback) => callback());
      readyCallbacks = [];
    });

    nextSocket.on("connect_error", (error) => {
      console.error("Lỗi kết nối socket:", error.message);
    });

    nextSocket.connect();
  })().finally(() => {
    connectPromise = null;
  });

  return connectPromise;
};

export const onSocketReady = (callback: () => void): (() => void) => {
  if (socket?.connected) {
    callback();
    return () => {};
  }
  readyCallbacks.push(callback);
  return () => {
    readyCallbacks = readyCallbacks.filter((cb) => cb !== callback);
  };
};

export const getSocket = (): Socket => {
  if (!socket) throw new Error("Socket chưa được khởi tạo");
  return socket;
};

export const disconnectSocket = (): void => {
  socket?.disconnect();
  socket = null;
  connectPromise = null;
  readyCallbacks = [];
};
