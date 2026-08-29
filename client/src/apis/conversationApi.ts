import type {
  ApiResponse,
  PageResponse,
  ConversationListResponse,
  ConversationDetailResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  ConversationType,
  GroupMemberResponse,
  AddGroupMembersRequest,
  GetOrCreatePrivateConversationResponse,
  ConversationImageResponse,
} from "../types/types";
import { axiosInstance } from "./axiosInstance";

export interface GetConversationsParams {
  page?: number;
  size?: number;
  q?: string;
  type?: ConversationType;
}

export interface GetConversationDetailParams {
  page?: number;
  size?: number;
  q?: string;
}

const BASE = "/conversations";

const buildCreateGroupFormData = (data: CreateGroupRequest) => {
  const formData = new FormData();

  formData.append("name", data.name);

  data.member_ids.forEach((id) => {
    formData.append("member_ids", id);
  });

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }

  return formData;
};

const buildUpdateGroupFormData = (data: UpdateGroupRequest) => {
  const formData = new FormData();

  formData.append("name", data.name);

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }

  return formData;
};

export const conversationApi = {
  getConversationImages: (conversationId: string) =>
    axiosInstance
      .get<
        ApiResponse<ConversationImageResponse[]>
      >(`${BASE}/${conversationId}/images`)
      .then((r) => r.data),

  getConversationList: (params?: GetConversationsParams) =>
    axiosInstance
      .get<
        ApiResponse<PageResponse<ConversationListResponse>>
      >(BASE, { params })
      .then((r) => r.data),

  getConversationDetail: (
    conversationId: string,
    params?: GetConversationDetailParams,
  ) =>
    axiosInstance
      .get<
        ApiResponse<ConversationDetailResponse>
      >(`${BASE}/${conversationId}`, { params })
      .then((r) => r.data),

  getGroupMembers: (conversationId: string) =>
    axiosInstance
      .get<
        ApiResponse<GroupMemberResponse[]>
      >(`${BASE}/group/${conversationId}`)
      .then((r) => r.data),

  createGroup: (data: CreateGroupRequest) =>
    axiosInstance
      .post<ApiResponse<null>>(`${BASE}/group`, buildCreateGroupFormData(data))
      .then((r) => r.data),

  updateGroup: (conversationId: string, data: UpdateGroupRequest) =>
    axiosInstance
      .put<
        ApiResponse<null>
      >(`${BASE}/group/${conversationId}`, buildUpdateGroupFormData(data))
      .then((r) => r.data),

  deleteGroup: (conversationId: string) =>
    axiosInstance
      .delete<ApiResponse<null>>(`${BASE}/group/${conversationId}`)
      .then((r) => r.data),

  addGroupMembers: (conversationId: string, data: AddGroupMembersRequest) =>
    axiosInstance
      .post<ApiResponse<null>>(`${BASE}/${conversationId}/members`, data)
      .then((r) => r.data),

  removeGroupMember: (conversationId: string, userId: string) =>
    axiosInstance
      .delete<ApiResponse<null>>(`${BASE}/${conversationId}/members/${userId}`)
      .then((r) => r.data),

  promoteToAdmin: (conversationId: string, userId: string) =>
    axiosInstance
      .patch<
        ApiResponse<null>
      >(`${BASE}/${conversationId}/members/${userId}/promote`)
      .then((r) => r.data),

  demoteAdmin: (conversationId: string, userId: string) =>
    axiosInstance
      .patch<
        ApiResponse<null>
      >(`${BASE}/${conversationId}/members/${userId}/demote`)
      .then((r) => r.data),

  transferOwnership: (conversationId: string, userId: string) =>
    axiosInstance
      .patch<
        ApiResponse<null>
      >(`${BASE}/${conversationId}/members/${userId}/transfer-owner`)
      .then((r) => r.data),

  getOrCreatePrivateConversation: (targetUserId: string) =>
    axiosInstance
      .post<
        ApiResponse<GetOrCreatePrivateConversationResponse>
      >(`${BASE}/private/${targetUserId}`)
      .then((r) => r.data),
};
