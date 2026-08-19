import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";
import type {
  ApiResponse,
  ErrorResponse,
  CreateGroupRequest,
  UpdateGroupRequest,
  ConversationType,
  AddGroupMembersRequest,
  GetOrCreatePrivateConversationResponse,
} from "../../types/types";
import {
  conversationApi,
  type GetConversationDetailParams,
} from "../../apis/conversationApi";

export const conversationKeys = {
  all: ["conversations"] as const,

  list: (type?: ConversationType | null, q?: string) =>
    [...conversationKeys.all, "list", type, q] as const,

  detail: (id: string, params: GetConversationDetailParams) =>
    [...conversationKeys.all, "detail", id, params] as const,

  members: (conversationId: string) =>
    [...conversationKeys.all, "members", conversationId] as const,
};

export const useGetConversationList = (
  type?: ConversationType | null,
  q?: string,
) => {
  return useInfiniteQuery({
    queryKey: conversationKeys.list(type, q),
    queryFn: ({ pageParam }) =>
      conversationApi.getConversationList({
        page: pageParam,
        size: 20,
        type: type ?? undefined,
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
  });
};

export const useGetConversationDetail = (conversationId: string, size = 20) => {
  return useInfiniteQuery({
    queryKey: conversationKeys.detail(conversationId, { size }),

    queryFn: ({ pageParam }) =>
      conversationApi.getConversationDetail(conversationId, {
        page: pageParam,
        size,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const { page, size, totalElements, totalPages } = lastPage.data.messages;
      const pageCount = totalPages ?? Math.ceil(totalElements / size);

      return page + 1 < pageCount ? page + 1 : undefined;
    },

    select: (data) => ({
      conversation: data.pages[0]?.data
        ? {
            conversation_id: data.pages[0].data.conversation_id,
            type: data.pages[0].data.type,
            name: data.pages[0].data.name,
            avatar_url: data.pages[0].data.avatar_url,
            is_online: data.pages[0].data.is_online,
            created_at: data.pages[0].data.created_at,
          }
        : undefined,

      // Server phân trang từ tin mới nhất về tin cũ hơn; UI hiển thị cũ -> mới.
      messages: data.pages
        .flatMap((page) => page.data.messages.content)
        .reverse(),

      totalElements: data.pages[0]?.data.messages.totalElements ?? 0,
    }),
  });
};

export const useGetGroupMembers = (conversationId: string) => {
  return useQuery({
    queryKey: conversationKeys.members(conversationId),
    queryFn: () => conversationApi.getGroupMembers(conversationId),
    select: (res) => res.data,
    enabled: Boolean(conversationId),
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    AxiosError<ErrorResponse>,
    CreateGroupRequest
  >({
    mutationFn: (data) => conversationApi.createGroup(data),

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.all,
      });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Tạo nhóm thất bại");
    },
  });
};

export const useUpdateGroup = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    AxiosError<ErrorResponse>,
    UpdateGroupRequest
  >({
    mutationFn: (data) => conversationApi.updateGroup(conversationId, data),

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.all,
      });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Cập nhật nhóm thất bại");
    },
  });
};

export const useDeleteGroup = (conversationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>>({
    mutationFn: () => conversationApi.deleteGroup(conversationId),

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.all,
      });

      toast.success(res.message);
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xóa nhóm thất bại");
    },
  });
};

export const useRemoveGroupMember = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (userId) =>
      conversationApi.removeGroupMember(conversationId, userId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
      toast.success(res.message || "Đã xóa thành viên");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Xóa thành viên thất bại");
    },
  });
};

export const usePromoteToAdmin = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (userId) =>
      conversationApi.promoteToAdmin(conversationId, userId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
      toast.success(res.message || "Đã đặt làm quản trị viên");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Thao tác thất bại");
    },
  });
};

export const useDemoteAdmin = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (userId) => conversationApi.demoteAdmin(conversationId, userId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.all });
      toast.success(res.message || "Đã gỡ quyền quản trị");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Thao tác thất bại");
    },
  });
};

export const useAddGroupMembers = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<null>,
    AxiosError<ErrorResponse>,
    AddGroupMembersRequest
  >({
    mutationFn: (data) => conversationApi.addGroupMembers(conversationId, data),

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.all,
      });

      toast.success(res.message || "Đã thêm thành viên");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Thêm thành viên thất bại");
    },
  });
};

export const useTransferOwnership = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: (userId) =>
      conversationApi.transferOwnership(conversationId, userId),

    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: conversationKeys.all,
      });

      toast.success(res.message || "Đã chuyển quyền trưởng nhóm");
    },

    onError: (error) => {
      toast.error(error.response?.data?.message ?? "Thao tác thất bại");
    },
  });
};

export const useGetOrCreatePrivateConversation = () => {
  return useMutation<
    ApiResponse<GetOrCreatePrivateConversationResponse>,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationFn: (targetUserId) =>
      conversationApi.getOrCreatePrivateConversation(targetUserId),

    onError: (error) => {
      toast.error(
        error.response?.data?.message ?? "Không thể mở cuộc trò chuyện",
      );
    },
  });
};
