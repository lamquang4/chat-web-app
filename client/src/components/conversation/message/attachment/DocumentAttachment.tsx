import { FileText } from "lucide-react";
import type { MessageAttachmentResponse } from "../../../../types/types";
import { formatFileSize } from "../../../../utils/formatters";
import toast from "react-hot-toast";

interface Props {
  att: MessageAttachmentResponse;
  isMe: boolean;
}

function DocumentAttachment({ att, isMe }: Props) {
  const handleDownload = async () => {
    try {
      const response = await fetch(att.url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = att.file_name;
      a.click();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error(`Tải thất bại: ${err}`);
    }
  };

  return (
    <div
      className={`rounded-2xl ${isMe ? "bg-primary text-white" : "bg-neutral-200 text-neutral"}`}
    >
      <div
        className="inline-flex items-center gap-3 px-3 py-2.5 rounded-2xl max-w-[260px] cursor-pointer"
        onClick={handleDownload}
        role="button"
        tabIndex={0}
      >
        <FileText size={30} strokeWidth={1.5} />

        <div className="min-w-0 space-y-0.5">
          <p className="font-semibold truncate leading-snug max-w-[180px]">
            {att.file_name}
          </p>
          <p>{formatFileSize(att.file_size)}</p>
        </div>
      </div>
    </div>
  );
}

export default DocumentAttachment;
