import { z } from "zod";
import { imageSchema, fileSchema } from "./uploadSchema";
import { MAX_UPLOAD, MAX_CONTENT_LENGTH } from "../constants/limit";

const attachmentSchema = z.union([imageSchema, fileSchema]);

export const sendMessageSchema = z
  .object({
    content: z
      .string()
      .trim()
      .max(MAX_CONTENT_LENGTH, `Nội dung tối đa ${MAX_CONTENT_LENGTH} ký tự`)
      .optional(),
    attachments: z
      .array(attachmentSchema)
      .max(
        MAX_UPLOAD,
        `Tổng số tệp và hình ảnh không được vượt quá ${MAX_UPLOAD}`,
      )
      .optional(),
    reply_message_id: z.string().optional(),
  })
  .refine(
    (data) => !!data.content?.trim().length || !!data.attachments?.length,
    {
      message: "Gửi tin nhắn phải có nội dung hoặc ít nhất 1 tệp đính kèm",
      path: ["content"],
    },
  );
export type SendMessageData = z.infer<typeof sendMessageSchema>;
