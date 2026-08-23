import { useState } from "react";
import type { MessageAttachmentResponse } from "../../../../types/types";
import Image from "../../../ui/Image";
import ImageViewer from "../../../ui/ImageViewer";

interface Props {
  att: MessageAttachmentResponse;
  size?: "large" | "small";
}

function ImageAttachment({ att, size = "large" }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpenViewer = () => {
    setOpen(true);
  };

  const handleCloseViewer = () => {
    setOpen(false);
  };

  const sizeClass =
    size === "large" ? "max-w-[280px] max-h-[320px]" : "w-[140px] h-[140px]";

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-2xl cursor-pointer ${sizeClass}`}
        onClick={handleOpenViewer}
      >
        <Image
          src={att.url}
          alt={att.file_name}
          className="block w-full h-full object-cover rounded-2xl"
        />
      </div>

      {open && (
        <ImageViewer image={att.url} open={open} onClose={handleCloseViewer} />
      )}
    </>
  );
}

export default ImageAttachment;
