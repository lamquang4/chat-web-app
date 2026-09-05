import type { MessageAttachmentResponse } from "../../../../types/types";

interface Props {
  att: MessageAttachmentResponse;
  isMe: boolean;
}

function VideoAttachment({ att, isMe }: Props) {
  return (
    <div
      className={`overflow-hidden rounded-2xl ${isMe ? "bg-primary" : "bg-bg"}`}
    >
      <video
        src={att.url}
        controls
        preload="metadata"
        className="block max-h-80 w-full max-w-[320px] object-contain"
      >
        Trình duyệt không hỗ trợ phát video.
      </video>
    </div>
  );
}

export default VideoAttachment;
