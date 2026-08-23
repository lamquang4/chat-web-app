import { X, Image as ImageIcon, FileText, Mic, Link2 } from "lucide-react";
import type { ReplyMessageResponse } from "../../../../types/types";
import Button from "../../../ui/Button";
import Image from "../../../ui/Image";

interface Props {
  replyTo: ReplyMessageResponse;
  onCancel: () => void;
}

function ReplyPreview({ replyTo, onCancel }: Props) {
  const attachment = replyTo.attachments?.[0];
  const content = replyTo.content;
  const link = replyTo.link_preview;

  if (!attachment && !content && !link) {
    return null;
  }
  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2 bg-neutral-200 border-b border-neutral-300">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {(attachment?.type === "image" || link) && (
          <Image
            src={attachment?.url || link?.image || ""}
            alt=""
            className="w-10 h-10 rounded-md object-cover shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">Trả lời {replyTo.sender_name}</p>

          <div className="flex items-center gap-1.5 min-w-0 text-neutral font-medium">
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

            {content && <span className="truncate">[Tin nhắn] {content}</span>}
          </div>
        </div>
      </div>

      <Button onClick={onCancel} className="text-neutral">
        <X size={20} />
      </Button>
    </div>
  );
}

export default ReplyPreview;
