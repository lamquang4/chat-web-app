import { useState } from "react";
import type { MessageAttachmentResponse } from "../../../../../types/types";
import Image from "../../../../ui/Image";
import ImageViewer from "../../../../ui/ImageViewer";

type Props = {
  att: MessageAttachmentResponse;
};

function ImageAttachment({ att }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="relative overflow-hidden rounded-2xl cursor-pointer max-w-[280px] max-h-[320px]"
        onClick={() => setOpen(true)}
      >
        <Image
          src={att.url}
          alt={att.file_name}
          className="block w-full h-full object-cover rounded-2xl"
        />
      </div>

      {open && (
        <ImageViewer
          image={att.url}
          open={open}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

export default ImageAttachment;
