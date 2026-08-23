const {
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
  MAX_UPLOAD,
  MAX_FIRST_NAME_LENGTH,
  MAX_LAST_NAME_LENGTH,
  MAX_GROUP_NAME_LENGTH,
  MAX_GROUP_MEMBERS,
  MAX_CONTENT_LENGTH,
  MAX_PASSWORD_LENGTH,
  OTP_LENGTH,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_EXPIRE_SECONDS,
} = require("../constants/limit");

const ErrorCode = {
  // System
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    status: 500,
    message: "Lỗi hệ thống",
  },
  UNCATEGORIZED_EXCEPTION: {
    code: "UNCATEGORIZED_EXCEPTION",
    status: 500,
    message: "Lỗi chưa phân loại",
  },
  VALIDATION_ERROR: {
    code: "VALIDATION_ERROR",
    status: 400,
    message: "Dữ liệu không hợp lệ",
  },
  NOT_FOUND: {
    code: "NOT_FOUND",
    status: 404,
    message: "Không tìm thấy tài nguyên",
  },

  // Auth
  EMAIL_ALREADY_EXISTS: {
    code: "EMAIL_ALREADY_EXISTS",
    status: 409,
    message: "Email đã tồn tại",
  },
  PHONE_ALREADY_EXISTS: {
    code: "PHONE_ALREADY_EXISTS",
    status: 409,
    message: "Số điện thoại đã tồn tại",
  },
  REGISTRATION_SESSION_EXPIRED: {
    code: "REGISTRATION_SESSION_EXPIRED",
    status: 400,
    message: "Phiên đăng ký đã xóa, vui vòng đăng ký lại",
  },
  INVALID_CREDENTIALS: {
    code: "INVALID_CREDENTIALS",
    status: 401,
    message: "Email hoặc mật khẩu không đúng",
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    status: 401,
    message: "Chưa đăng nhập",
  },
  FORBIDDEN: {
    code: "FORBIDDEN",
    status: 403,
    message: "Không có quyền thực hiện thao tác này",
  },
  INVALID_ACCESS_TOKEN: {
    code: "INVALID_ACCESS_TOKEN",
    status: 401,
    message: "Access token không hợp lệ",
  },
  ACCESS_TOKEN_EXPIRED: {
    code: "ACCESS_TOKEN_EXPIRED",
    status: 401,
    message: "Access token đã hết hạn",
  },
  INVALID_REFRESH_TOKEN: {
    code: "INVALID_REFRESH_TOKEN",
    status: 401,
    message: "Refresh token không hợp lệ",
  },
  REFRESH_TOKEN_EXPIRED: {
    code: "REFRESH_TOKEN_EXPIRED",
    status: 401,
    message: "Refresh token đã hết hạn",
  },
  EMAIL_NOT_VERIFIED: {
    code: "EMAIL_NOT_VERIFIED",
    status: 403,
    message: "Email chưa được xác thực",
  },
  SESSION_REVOKED: {
    code: "SESSION_REVOKED",
    status: 401,
    message: "Phiên đăng nhập đã bị thu hồi",
  },
  SESSION_EXPIRED: {
    code: "SESSION_EXPIRED",
    status: 401,
    message: "Phiên đăng nhập đã hết hạn",
  },
  SESSION_NOT_FOUND: {
    code: "SESSION_NOT_FOUND",
    status: 404,
    message: "Không tìm thấy phiên đăng nhập",
  },
  EMAIL_REQUIRED: {
    code: "EMAIL_REQUIRED",
    status: 400,
    message: "Email không để trống",
  },
  EMAIL_INVALID: {
    code: "EMAIL_INVALID",
    status: 400,
    message: "Email không hợp lệ",
  },
  PASSWORD_REQUIRED: {
    code: "PASSWORD_REQUIRED",
    status: 400,
    message: "Mật khẩu không để trống",
  },
  PASSWORD_TOO_LONG: {
    code: "PASSWORD_TOO_LONG",
    status: 400,
    message: `Mật khẩu tối đa ${MAX_PASSWORD_LENGTH} ký tự`,
  },
  PASSWORD_WEAK: {
    code: "PASSWORD_WEAK",
    status: 400,
    message:
      "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
  },
  FIRST_NAME_REQUIRED: {
    code: "FIRST_NAME_REQUIRED",
    status: 400,
    message: "Họ không để trống",
  },
  FIRST_NAME_TOO_LONG: {
    code: "FIRST_NAME_TOO_LONG",
    status: 400,
    message: `Họ tối đa ${MAX_FIRST_NAME_LENGTH} ký tự`,
  },
  LAST_NAME_REQUIRED: {
    code: "LAST_NAME_REQUIRED",
    status: 400,
    message: "Tên không để trống",
  },
  LAST_NAME_TOO_LONG: {
    code: "LAST_NAME_TOO_LONG",
    status: 400,
    message: `Tên tối đa ${MAX_LAST_NAME_LENGTH} ký tự`,
  },
  PHONE_REQUIRED: {
    code: "PHONE_REQUIRED",
    status: 400,
    message: "Số điện thoại không để trống",
  },
  PHONE_INVALID: {
    code: "PHONE_INVALID",
    status: 400,
    message: "Số điện thoại không hợp lệ",
  },
  OTP_INVALID: {
    code: "OTP_INVALID",
    status: 400,
    message: "Mã OTP không hợp lệ",
  },
  OTP_LENGTH_INVALID: {
    code: "OTP_LENGTH_INVALID",
    status: 400,
    message: `Mã OTP gồm ${OTP_LENGTH} chữ số`,
  },
  OTP_RESEND_TOO_SOON: {
    code: "OTP_RESEND_TOO_SOON",
    status: 429,
    message: `Vui lòng chờ ${OTP_RESEND_COOLDOWN_SECONDS} giây trước khi yêu cầu mã OTP mới`,
  },
  OTP_MAX_ATTEMPTS_EXCEEDED: {
    code: "OTP_MAX_ATTEMPTS_EXCEEDED",
    status: 429,
    message: "Bạn đã nhập sai mã OTP quá nhiều lần, vui lòng đăng ký lại",
  },
  REGISTRATION_ALREADY_PENDING: {
    code: "REGISTRATION_ALREADY_PENDING",
    status: 409,
    message: `Email này đang chờ xác thực OTP. Vui lòng kiểm tra email hoặc thử lại sau ${OTP_EXPIRE_SECONDS / 60} phút.`,
  },

  // User
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    status: 404,
    message: "Người dùng không tồn tại",
  },
  EMAIL_ALREADY_USED_BY_ANOTHER_USER: {
    code: "EMAIL_ALREADY_USED_BY_ANOTHER_USER",
    status: 409,
    message: "Email đã được sử dụng bởi tài khoản khác",
  },
  PHONE_ALREADY_USED_BY_ANOTHER_USER: {
    code: "PHONE_ALREADY_USED_BY_ANOTHER_USER",
    status: 409,
    message: "Số điện thoại đã được sử dụng bởi tài khoản khác",
  },

  // friend
  CANNOT_FRIEND_SELF: {
    code: "CANNOT_FRIEND_SELF",
    status: 400, // sửa từ statusCode → status
    message: "Không thể tự kết bạn với chính mình",
  },
  FRIEND_REQUEST_ALREADY_EXISTS: {
    code: "FRIEND_REQUEST_ALREADY_EXISTS",
    status: 409,
    message: "Lời mời kết bạn đã được gửi trước đó",
  },
  ALREADY_FRIENDS: {
    code: "ALREADY_FRIENDS",
    status: 409,
    message: "Hai người đã là bạn bè",
  },
  FRIEND_REQUEST_NOT_FOUND: {
    code: "FRIEND_REQUEST_NOT_FOUND",
    status: 404,
    message: "Không tìm thấy lời mời kết bạn",
  },
  NOT_FRIEND_REQUEST_OWNER: {
    code: "NOT_FRIEND_REQUEST_OWNER",
    status: 403,
    message: "Bạn không có quyền thao tác với lời mời này",
  },
  FRIEND_NOT_FOUND: {
    code: "FRIEND_NOT_FOUND",
    status: 404,
    message: "Không tìm thấy quan hệ bạn bè",
  },

  // File / Image upload
  FILE_TOO_LARGE: {
    code: "FILE_TOO_LARGE",
    status: 400,
    message: `File không được vượt quá ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  },
  IMAGE_TOO_LARGE: {
    code: "IMAGE_TOO_LARGE",
    status: 400,
    message: `Hình không được vượt quá ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
  },
  INVALID_ATTACHMENT_TYPE: {
    code: "INVALID_ATTACHMENT_TYPE",
    status: 400,
    message:
      "Chỉ hỗ trợ PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, MP3, MP4, WEBM, OGG, WAV, JPG, PNG, WEBP",
  },
  INVALID_FILE_TYPE: {
    code: "INVALID_FILE_TYPE",
    status: 400,
    message:
      "Chỉ hỗ trợ file PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, MP3, MP4, WEBM, OGG, WAV",
  },
  INVALID_IMAGE_TYPE: {
    code: "INVALID_IMAGE_TYPE",
    status: 400,
    message: "Chỉ hỗ trợ hình JPG, PNG, WEBP",
  },
  UPLOAD_FAILED: {
    code: "UPLOAD_FAILED",
    status: 400,
    message: "Upload hình thất bại",
  },
  TOO_MANY_ATTACHMENTS: {
    code: "TOO_MANY_ATTACHMENTS",
    status: 400,
    message: `Chỉ được gửi tối đa ${MAX_UPLOAD} tệp và hình mỗi lần`,
  },

  // conversation
  GROUP_NAME_REQUIRED: {
    code: "GROUP_NAME_REQUIRED",
    status: 400,
    message: "Tên nhóm không để trống",
  },
  GROUP_NAME_TOO_LONG: {
    code: "GROUP_NAME_TOO_LONG",
    status: 400,
    message: `Tên nhóm tối đa ${MAX_GROUP_NAME_LENGTH} ký tự`,
  },
  GROUP_MEMBERS_REQUIRED: {
    code: "GROUP_MEMBERS_REQUIRED",
    status: 400,
    message: "Nhóm phải có ít nhất 2 thành viên",
  },
  GROUP_MEMBERS_TOO_MANY: {
    code: "GROUP_MEMBERS_TOO_MANY",
    status: 400,
    message: `Nhóm tối đa ${MAX_GROUP_MEMBERS} thành viên`,
  },
  GROUP_MEMBERS_DUPLICATE: {
    code: "GROUP_MEMBERS_DUPLICATE",
    status: 400,
    message: "Danh sách thành viên bị trùng",
  },
  NOT_GROUP_ADMIN_OR_OWNER: {
    code: "NOT_GROUP_ADMIN_OR_OWNER",
    status: 403,
    message:
      "Chỉ trưởng nhóm hoặc quản trị viên mới có quyền thực hiện thao tác này",
  },
  GROUP_MEMBERS_LIMIT_EXCEEDED: {
    code: "GROUP_MEMBERS_LIMIT_EXCEEDED",
    status: 400,
    message: `Nhóm tối đa ${MAX_GROUP_MEMBERS} thành viên, không thể thêm nữa`,
  },
  MIN_GROUP_MEMBERS_REQUIRED: {
    code: "MIN_GROUP_MEMBERS_REQUIRED",
    status: 400,
    message: "Nhóm phải có ít nhất 2 thành viên, không thể xóa thêm",
  },
  TARGET_NOT_GROUP_MEMBER: {
    code: "TARGET_NOT_GROUP_MEMBER",
    status: 404,
    message: "Người này không phải thành viên của nhóm",
  },
  ALREADY_ADMIN: {
    code: "ALREADY_ADMIN",
    status: 409,
    message: "Người này đã là quản trị viên",
  },
  NOT_ADMIN: {
    code: "NOT_ADMIN",
    status: 400,
    message: "Người này không phải quản trị viên",
  },
  CANNOT_ACT_ON_OWNER: {
    code: "CANNOT_ACT_ON_OWNER",
    status: 403,
    message: "Không thể thực hiện thao tác này với trưởng nhóm",
  },
  CANNOT_TRANSFER_TO_SELF: {
    code: "CANNOT_TRANSFER_TO_SELF",
    status: 400,
    message: "Bạn đã là trưởng nhóm",
  },
  CANNOT_MESSAGE_SELF: {
    code: "CANNOT_MESSAGE_SELF",
    status: 400,
    message: "Không thể nhắn tin với chính mình",
  },

  // message
  MESSAGE_CONTENT_TOO_LONG: {
    code: "MESSAGE_CONTENT_TOO_LONG",
    status: 400,
    message: `Nội dung tối đa ${MAX_CONTENT_LENGTH} ký tự`,
  },
  MESSAGE_NOT_FOUND: {
    code: "MESSAGE_NOT_FOUND",
    status: 404,
    message: "Không tìm thấy tin nhắn",
  },
  NOT_MESSAGE_OWNER: {
    code: "NOT_MESSAGE_OWNER",
    status: 403,
    message: "Bạn không có quyền thu hồi tin nhắn này",
  },
  MESSAGE_ALREADY_RECALLED: {
    code: "MESSAGE_ALREADY_RECALLED",
    status: 400,
    message: "Tin nhắn đã được thu hồi trước đó",
  },
  REPLY_MESSAGE_NOT_FOUND: {
    code: "REPLY_MESSAGE_NOT_FOUND",
    status: 404,
    message: "Tin nhắn được trả lời không tồn tại",
  },
  REPLY_MESSAGE_RECALLED: {
    code: "REPLY_MESSAGE_RECALLED",
    status: 400,
    message: "Không thể trả lời tin nhắn đã được thu hồi",
  },
  MESSAGE_CONTENT_REQUIRED: {
    code: "MESSAGE_CONTENT_REQUIRED",
    status: 400,
    message: "Gửi tin nhắn phải có nội dung hoặc ít nhất 1 tệp đính kèm",
  },

  //conversation
  GROUP_MEMBER_NOT_FOUND: {
    code: "GROUP_MEMBER_NOT_FOUND",
    status: 404,
    message: "Một hoặc nhiều thành viên không tồn tại",
  },
  NOT_GROUP_OWNER: {
    code: "NOT_GROUP_OWNER",
    status: 403,
    message: "Chỉ trưởng nhóm mới có quyền thực hiện thao tác này",
  },
  NOT_GROUP_CONVERSATION: {
    code: "NOT_GROUP_CONVERSATION",
    status: 400,
    message: "Chức năng này chỉ áp dụng cho hội thoại nhóm",
  },
  CONVERSATION_NOT_FOUND: {
    code: "CONVERSATION_NOT_FOUND",
    status: 404,
    message: "Không tìm thấy hội thoại",
  },
  NOT_CONVERSATION_MEMBER: {
    code: "NOT_CONVERSATION_MEMBER",
    status: 403,
    message: "Bạn không phải thành viên của hội thoại này",
  },
};

module.exports = ErrorCode;
