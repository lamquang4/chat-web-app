import z from "zod";
import {
  ALLOWED_DOC_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
} from "../constants/mimeTypes";

export const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "File không được vượt quá 10MB",
  })
  .refine((file) => ALLOWED_DOC_MIME_TYPES.includes(file.type), {
    message: "Chỉ hỗ trợ file PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX",
  });

export const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Ảnh không được vượt quá 5MB",
  })
  .refine((file) => ALLOWED_IMAGE_MIME_TYPES.includes(file.type), {
    message: "Chỉ hỗ trợ JPG, PNG, WEBP",
  });

export const filesSchema = z.array(fileSchema);

export const imagesSchema = z.array(imageSchema);
