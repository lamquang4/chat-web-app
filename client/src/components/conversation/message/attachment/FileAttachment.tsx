import { FileText } from "lucide-react";
import type { MessageAttachmentResponse } from "../../../../types/types";
import { formatFileSize } from "../../../../utils/formatters";

interface Props {
  att: MessageAttachmentResponse;
}

function FileAttachment({ att }: Props) {
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = att.url;
    a.download = att.file_name;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <div
      className="inline-flex items-center gap-3 px-3 py-2.5 rounded-2xl max-w-[260px] min-w-[160px] cursor-pointer"
      onClick={handleDownload}
      role="button"
      tabIndex={0}
    >
      <FileText size={24} />

      <div className="min-w-0 space-y-0.5">
        <p className="font-semibold truncate leading-snug max-w-[180px]">
          {att.file_name}
        </p>
        <p>{formatFileSize(att.file_size)}</p>
      </div>
    </div>
  );
}

export default FileAttachment;
