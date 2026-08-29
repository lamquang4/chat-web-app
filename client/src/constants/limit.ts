export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export const ALLOWED_FILE_MIME_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "audio/mpeg", // .mp3
  "audio/mp4", // .mp4 (audio)
  "audio/webm", // .webm
  "audio/ogg", // .ogg
  "audio/wav", // .wav
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_UPLOAD = 5;
export const MAX_CONTENT_LENGTH = 5000;
export const MAX_GROUP_MEMBERS = 20;
export const MAX_GROUP_NAME_LENGTH = 50;
export const MAX_FIRST_NAME_LENGTH = 50;
export const MAX_LAST_NAME_LENGTH = 50;
export const MAX_PASSWORD_LENGTH = 100;
export const RECORDING_MIME_TYPE = "audio/mp4";

// otp
export const OTP_LENGTH = 6;
export const OTP_EXPIRE_SECONDS = 10 * 60; // 10 phút
export const OTP_RESEND_COOLDOWN_SECONDS = 5 * 60; // 5 phút

export const JWT_EXPIRATION = {
  ACCESS_TOKEN_MINUTES: 15,
  REFRESH_TOKEN_DAYS: 7,
  SESSION_DAYS: 7,
} as const;
