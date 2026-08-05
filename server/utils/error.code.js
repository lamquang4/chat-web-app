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
} = require("../constants/limit");
const { OTP_LENGTH } = require("../constants/otp");

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
  INVALID_TOKEN: {
    code: "INVALID_TOKEN",
    status: 401,
    message: "Token không hợp lệ",
  },
  TOKEN_EXPIRED: {
    code: "TOKEN_EXPIRED",
    status: 401,
    message: "Token đã hết hạn",
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
    message: "Nhóm phải có ít nhất 1 thành viên",
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

  MESSAGE_CONTENT_TOO_LONG: {
    code: "MESSAGE_CONTENT_TOO_LONG",
    status: 400,
    message: `Nội dung tối đa ${MAX_CONTENT_LENGTH} ký tự`,
  },
};

module.exports = ErrorCode;
