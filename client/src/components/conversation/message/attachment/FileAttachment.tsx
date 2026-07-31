import { FileText } from "lucide-react";
import type { MessageAttachmentResponse } from "../../../../types/types";
import { formatFileSize } from "../../../../utils/formatters";
import toast from "react-hot-toast";

interface Props {
  att: MessageAttachmentResponse;
}

function FileAttachment({ att }: Props) {
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
      toast.error(`Tải file thất bại: ${err}`);
    }
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
