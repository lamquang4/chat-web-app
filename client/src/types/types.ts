export type ConversationType = "private" | "group";
export type AttachmentType = "image" | "document" | "audio";
export type MemberRole = "owner" | "admin" | "member";

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ErrorResponse {
  status: number;
  message: string;
  path?: string;
  timestamp: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

// Request
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface VerifyRegisterOtpRequest {
  email: string;
  otp_code: string;
}

export interface ResendRegisterOtpRequest {
  email: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface CreateGroupRequest {
  name: string;
  member_ids: string[];
  avatar?: File;
}

export interface UpdateGroupRequest {
  name: string;
  avatar?: File;
}

export interface AddGroupMembersRequest {
  member_ids: string[];
}

export interface SendMessageRequest {
  content?: string;
  attachments?: File[];
  reply_message_id?: string;
}

export interface UpdateUserRequest {
  first_name: string;
  last_name: string;
  phone: string;
  avatar?: File;
}

// Response
export interface LoginResponse {
  user_id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  avatar_url: string | null;
}

export interface ConversationImageResponse {
  attachment_id: string;
  message_id: string;
  url: string;
  created_at: string;
}

export interface GetOrCreatePrivateConversationResponse {
  conversation_id: string;
}

// cần phân trang
export interface ConversationListResponse {
  conversation_id: string;
  type: ConversationType;
  name: string;
  avatar_url: string | null;
  last_message: string;
  is_last_message_me: boolean;
  is_last_message_seen: boolean;
  is_online: boolean;
}

export interface ConversationDetailResponse {
  conversation_id: string;
  type: ConversationType;
  name: string; // tên group hoặc tên mình
  avatar_url: string | null; // avatar group hoặc của mình
  is_online: boolean; // group online có ít nhất 1 member online trừ bản thân
  messages: PageResponse<MessageResponse>; // phân trang
  created_at: string;
}

export interface MessageResponse {
  message_id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar_url: string | null;
  content: string | null;
  link_preview: LinkPreviewResponse | null;
  attachments: MessageAttachmentResponse[];
  reply_message: ReplyMessageResponse | null;
  seen_by: MessageSeenResponse[];
  is_recalled: boolean;
  is_me: boolean;
  is_seen: boolean;
  created_at: string;
}

export interface LinkPreviewResponse {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
  site_name: string | null;
}

export interface MessageSeenResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface MessageAttachmentResponse {
  attachment_id: string;
  type: AttachmentType;
  url: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  duration: number | null;
}

export interface ReplyMessageResponse {
  message_id: string;
  sender_name: string;
  content: string | null;
  link_preview: LinkPreviewResponse | null;
  attachments: MessageAttachmentResponse[] | null;
}

// Không cần phân trang

export interface GroupMemberResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: MemberRole; // private thì cả 2 đều là member
  joined_at: string;
}

export interface FriendResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_online: boolean;
  updated_at: string; // khi status = accepted
}

export interface FriendRequestResponse {
  requester_id: string; // người ta gửi yêu cầu cho mình
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface SuggestedFriendResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

// JWT
export interface AccessTokenPayload {
  sub: string; // user_id
  session_id: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string; // user_id
  iat: number;
  exp: number;
}
