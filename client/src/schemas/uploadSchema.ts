import z from "zod";

const ALLOWED_DOC_MIME_TYPES = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel", // .xls
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];

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
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    {
      message: "Chỉ hỗ trợ JPG, PNG, WEBP",
    },
  );

export const filesSchema = z.array(fileSchema);

export const imagesSchema = z.array(imageSchema);
