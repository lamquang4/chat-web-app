import type { MessageAttachmentResponse } from "../../../../types/types";
import Image from "../../../ui/Image";

interface Props {
  att: MessageAttachmentResponse;
  size?: "large" | "small";
  onOpenImage: (attachmentId: string) => void;
}

function ImageAttachment({ att, size = "large", onOpenImage }: Props) {
  const sizeClass =
    size === "large" ? "max-w-[280px] max-h-[320px]" : "w-[140px] h-[140px]";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer ${sizeClass}`}
      onClick={() => onOpenImage(att.attachment_id)}
    >
      <Image
        src={att.url}
        alt={att.file_name}
        className="block w-full h-full object-cover rounded-2xl"
      />
    </div>
  );
}

export default ImageAttachment;
