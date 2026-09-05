import z from "zod";
import {
  ALLOWED_FILE_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE,
  MAX_FILE_SIZE,
} from "../constants/limit";

export const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: `Hình không được vượt quá ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`,
  })
  .refine((file) => ALLOWED_IMAGE_MIME_TYPES.includes(file.type), {
    message: "Chỉ hỗ trợ hình JPG, PNG, WEBP",
  });

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: `File không được vượt quá ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  })
  .refine((file) => ALLOWED_FILE_MIME_TYPES.includes(file.type), {
    message:
      "Chỉ hỗ trợ file PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, MP3, MP4, WEBM, OGG, WAV và video MP4, WEBM",
  });

export const imagesSchema = z.array(imageSchema);

export const filesSchema = z.array(fileSchema);
