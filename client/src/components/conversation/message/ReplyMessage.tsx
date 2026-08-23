import { FileText, ImageIcon, Link2, Mic } from "lucide-react";
import type { ReplyMessageResponse } from "../../../types/types";
import Image from "../../ui/Image";
interface Props {
  reply: ReplyMessageResponse;
  onClick?: () => void;
}

function ReplyMessage({ reply, onClick }: Props) {
  const attachment = reply.attachments?.[0];
  const content = reply.content;
  const link = reply.link_preview;

  return (
    <div
      onClick={onClick}
      className={`flex items-start gap-2 px-3 py-2 rounded-2xl bg-neutral-200 text-neutral ${
        onClick && "cursor-pointer"
      }`}
    >
      <div className={`w-0.5 self-stretch rounded-full shrink-0 bg-neutral`} />
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {(attachment?.type === "image" || link) && (
          <Image
            src={attachment?.url || link?.image || ""}
            alt=""
            className="w-12 h-12 rounded-md object-cover shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{reply.sender_name}</p>

          <div className="flex items-center gap-1.5 min-w-0 font-medium">
            {attachment?.type === "image" && (
              <span className="flex items-center gap-1.5 shrink-0">
                <ImageIcon size={16} />
                [Hình ảnh]
              </span>
            )}

            {attachment?.type === "audio" && (
              <span className="flex items-center gap-1.5 shrink-0">
                <Mic size={16} />
                [Tin nhắn thoại]
              </span>
            )}

            {attachment?.type === "document" && (
              <span className="flex items-center gap-1.5 min-w-0">
                <FileText size={16} className="shrink-0" />
                <span className="truncate">[File] {attachment.file_name}</span>
              </span>
            )}

            {link && (
              <span className="flex items-center gap-1.5 min-w-0">
                <Link2 size={16} className="shrink-0" />
                <span className="truncate">{link.url}</span>
              </span>
            )}

            {reply.content && (
              <span className="truncate">[Tin nhắn] {content}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReplyMessage;
