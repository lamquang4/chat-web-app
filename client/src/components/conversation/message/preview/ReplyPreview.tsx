import { X, Image as ImageIcon, FileText, Mic } from "lucide-react";
import type { ReplyMessageResponse } from "../../../../types/types";
import Button from "../../../ui/Button";
import Image from "../../../ui/Image";

type Props = {
  replyTo: ReplyMessageResponse;
  onCancel: () => void;
};

function ReplyPreview({ replyTo, onCancel }: Props) {
  const attachment = replyTo.attachments?.[0];

  const renderAttachmentLabel = () => {
    if (!attachment) return null;

    if (attachment.type === "image") {
      return (
        <div className="flex items-center gap-1.5 text-neutral shrink-0">
          <ImageIcon size={16} />
          <span>Hình ảnh</span>
        </div>
      );
    }

    if (attachment.type === "audio") {
      return (
        <div className="flex items-center gap-1.5 text-neutral shrink-0">
          <Mic size={16} />
          <span>Tin nhắn thoại</span>
        </div>
      );
    }

    if (attachment.type === "document") {
      return (
        <div className="flex items-center gap-1.5 text-neutral min-w-0">
          <FileText size={16} className="shrink-0" />
          <span className="truncate">{attachment.file_name}</span>
        </div>
      );
    }

    return null;
  };

  const renderPreviewContent = () => {
    // Có cả attachment lẫn content -> hiện icon + text cùng lúc
    if (attachment && replyTo.content) {
      return (
        <div className="flex items-center gap-1.5 min-w-0">
          {renderAttachmentLabel()}
          <span className="truncate text-neutral">{replyTo.content}</span>
        </div>
      );
    }

    // Chỉ có attachment, không có text
    if (attachment) {
      return renderAttachmentLabel();
    }

    // Chỉ có text
    if (replyTo.content) {
      return <p className="truncate text-neutral">{replyTo.content}</p>;
    }

    return <p className="text-neutral">Tin nhắn</p>;
  };

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-100 rounded-t-2xl border-b border-gray-200">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {attachment?.type === "image" && (
          <Image
            src={attachment.url}
            alt=""
            className="w-9 h-9 rounded-md object-cover shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">Trả lời {replyTo.sender_name}</p>
          {renderPreviewContent()}
        </div>
      </div>

      <Button onClick={onCancel} className="text-neutral">
        <X size={20} />
      </Button>
    </div>
  );
}

export default ReplyPreview;
