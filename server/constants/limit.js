module.exports = {
  ALLOWED_IMAGE_MIME_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_FILE_MIME_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "audio/mpeg",
    "audio/mp4",
    "audio/webm",
    "audio/ogg",
    "audio/wav",
  ],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024,
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  MAX_UPLOAD: 5,
  MAX_CONTENT_LENGTH: 5000,
  MAX_GROUP_MEMBERS: 20,
  MAX_GROUP_NAME_LENGTH: 50,
  MAX_FIRST_NAME_LENGTH: 50,
  MAX_LAST_NAME_LENGTH: 50,
  MAX_PASSWORD_LENGTH: 100,
  MAX_ACTIVE_SESSIONS_PER_USER: 5,

  OTP_LENGTH: 6,
  OTP_EXPIRE_SECONDS: 10 * 60, // 10 phút
  OTP_MAX_ATTEMPTS: 5,
  OTP_RESEND_COOLDOWN_SECONDS: 5 * 60, // 5 phút
};
