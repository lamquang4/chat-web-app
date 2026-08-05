export type ConversationType = "private" | "group";
export type AttachmentType = "image" | "document" | "audio";
export type MemberRole = "owner" | "admin" | "member";

// ============ Request ============
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

export interface LogoutRequest {
  session_id: string;
}

export interface SendOtpRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp_code: string;
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
  member_ids: string[];
  avatar?: File;
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

// ============ Response ============
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  session_id: string;
}

export interface AccountResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
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
  attachments: MessageAttachmentResponse[];
  reply_message: ReplyMessageResponse | null;
  seen_by: MessageSeenResponse[];
  is_recalled: boolean;
  is_me: boolean;
  is_seen: boolean;
  created_at: string;
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
  attachments: MessageAttachmentResponse[];
}

// Không cần phân trang
export interface ConversationMembersGroupResponse {
  conversation_id: string; // kiểm tra lấy đúng conversation không
  members: ConversationMemberResponse[];
}

export interface ConversationMemberResponse {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  role: MemberRole; // private thì cả 2 đều là member
  joined_at: string;
}

export interface FriendResponse {
  user_id: string;
  conversation_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_online: boolean;
  updated_at: string; // khi status = accepted
}

export interface FriendRequestResponse {
  request_id: string;
  requester_id: string; // người yêu cầu
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  created_at: string;
}

// ============ Token ============
export interface AccessTokenPayload {
  sub: string; // userId
  sessionId: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  sub: string; // userId
  iat: number;
  exp: number;
}

export interface CookieOptions {
  expires?: number; // ngày
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
}
