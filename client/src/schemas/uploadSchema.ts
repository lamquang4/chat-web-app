import z from "zod";
import {
  ALLOWED_FILE_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
} from "../constants/mimeTypes";

export const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Hình không được vượt quá 5MB",
  })
  .refine((file) => ALLOWED_IMAGE_MIME_TYPES.includes(file.type), {
    message: "Chỉ hỗ trợ JPG, PNG, WEBP",
  });

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File không được vượt quá 10MB",
  })
  .refine((file) => ALLOWED_FILE_MIME_TYPES.includes(file.type), {
    message:
      "Chỉ hỗ trợ file PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, MP3, MP4, WEBM, OGG, WAV",
  });

export const imagesSchema = z.array(imageSchema);

export const filesSchema = z.array(fileSchema);
