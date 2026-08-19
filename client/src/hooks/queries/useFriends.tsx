import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import type { ApiResponse, ErrorResponse } from "../../types/types";
import { friendApi } from "../../apis/friendApi";
import { conversationKeys } from "./useConversations";

export const friendKeys = {
  all: ["friends"] as const,
  list: (q?: string) => [...friendKeys.all, "list", q] as const,
  requests: (q?: string) => [...friendKeys.all, "requests", q] as const,
  suggestions: (q?: string) => [...friendKeys.all, "suggestions", q] as const,
  addable: (conversationId: string, q?: string) =>
    [...friendKeys.all, "addable", conversationId, q] as const,
};

export const useGetFriendList = (q?: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: friendKeys.list(q),

    queryFn: ({ pageParam }) =>
      friendApi.getFriendList({
        page: pageParam,
        size: 20,
        q,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.page + 1;
      return nextPage < lastPage.data.totalPages ? nextPage : undefined;
    },

    select: (data) => ({
      pages: data.pages.map((p) => p.data),
      content: data.pages.flatMap((p) => p.data.content),
      totalElements: data.pages[0]?.data.totalElements ?? 0,
    }),

    enabled,
  });
};

export const useGetFriendRequestList = (q?: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: friendKeys.requests(q),

    queryFn: ({ pageParam }) =>
      friendApi.getFriendRequestList({
        page: pageParam,
        size: 20,
        q,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.page + 1;

      return nextPage < lastPage.data.totalPages ? nextPage : undefined;
    },

    select: (data) => ({
      content: data.pages.flatMap((p) => p.data.content),
      totalElements: data.pages[0]?.data.totalElements ?? 0,
    }),

    enabled,
  });
};

export const useGetSuggestedFriends = (q?: string, enabled = true) => {
  const size = 20;

  return useInfiniteQuery({
    queryKey: friendKeys.suggestions(q),

    queryFn: ({ pageParam }) =>
      friendApi.getSuggestedFriends({
        page: pageParam,
        size,
        q,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const { page, totalElements } = lastPage.data;

      const nextPage = page + 1;

      return nextPage * size < totalElements ? nextPage : undefined;
    },

    select: (data) => ({
      content: data.pages.flatMap((p) => p.data.content),
      totalElements: data.pages[0]?.data.totalElements ?? 0,
    }),

    enabled,
  });
};

export const useGetFriendsNotInConversation = (
  conversationId: string,
  q?: string,
) => {
  return useInfiniteQuery({
    queryKey: friendKeys.addable(conversationId, q),
    queryFn: ({ pageParam }) =>
      friendApi.getFriendsNotInConversation(conversationId, {
        page: pageParam,
        size: 20,
        q,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.data.page + 1;
      return nextPage < lastPage.data.totalPages ? nextPage : undefined;
    },
    select: (data) => ({
      content: data.pages.flatMap((p) => p.data.content),
      totalElements: data.pages[0]?.data.totalElements ?? 0,
    }),
    enabled: Boolean(conversationId),
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (receiverId) => friendApi.sendFriendRequest(receiverId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
      toast.success(res.message || "Đã gửi lời mời kết bạn");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Gửi lời mời thất bại");
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (requesterId) => friendApi.acceptFriendRequest(requesterId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
      toast.success(res.message || "Đã chấp nhận lời mời kết bạn");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Chấp nhận lời mời thất bại",
      );
    },
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (requesterId) => friendApi.rejectFriendRequest(requesterId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
      toast.success(res.message || "Đã từ chối lời mời kết bạn");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Từ chối lời mời thất bại");
    },
  });
};

export const useRemoveFriend = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (userId) => friendApi.removeFriend(userId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: friendKeys.all });
      toast.success(res.message || "Đã hủy kết bạn");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Hủy kết bạn thất bại");
    },
  });
};
