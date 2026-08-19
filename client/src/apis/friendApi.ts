import type {
  ApiResponse,
  PageResponse,
  FriendResponse,
  FriendRequestResponse,
  SuggestedFriendResponse,
} from "../types/types";
import { axiosInstance } from "./axiosInstance";

export interface GetFriendsParams {
  page?: number;
  size?: number;
  q?: string;
}

const BASE = "/friends";

export const friendApi = {
  getFriendList: (params?: GetFriendsParams) =>
    axiosInstance
      .get<ApiResponse<PageResponse<FriendResponse>>>(BASE, { params })
      .then((r) => r.data),

  getFriendRequestList: (params?: GetFriendsParams) =>
    axiosInstance
      .get<
        ApiResponse<PageResponse<FriendRequestResponse>>
      >(`${BASE}/requests`, { params })
      .then((r) => r.data),

  getSuggestedFriends: (params?: GetFriendsParams) =>
    axiosInstance
      .get<
        ApiResponse<PageResponse<SuggestedFriendResponse>>
      >(`${BASE}/suggestions`, { params })
      .then((r) => r.data),

  getFriendsNotInConversation: (
    conversationId: string,
    params?: GetFriendsParams,
  ) =>
    axiosInstance
      .get<
        ApiResponse<PageResponse<FriendResponse>>
      >(`${BASE}/${conversationId}/addable-friends`, { params })
      .then((r) => r.data),

  sendFriendRequest: (receiverId: string) =>
    axiosInstance
      .post<ApiResponse<null>>(`${BASE}/request/${receiverId}`)
      .then((r) => r.data),

  acceptFriendRequest: (requesterId: string) =>
    axiosInstance
      .put<ApiResponse<null>>(`${BASE}/request/${requesterId}`)
      .then((r) => r.data),

  rejectFriendRequest: (requesterId: string) =>
    axiosInstance
      .delete<ApiResponse<null>>(`${BASE}/request/${requesterId}`)
      .then((r) => r.data),

  removeFriend: (userId: string) =>
    axiosInstance
      .delete<ApiResponse<null>>(`${BASE}/${userId}`)
      .then((r) => r.data),
};
