import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { MessageResponse } from "../../../types/types";
import ImageAttachment from "./attachment/ImageAttachment";
import AudioAttachment from "./attachment/AudioAttachment";
import FileAttachment from "./attachment/FileAttachment";
import Image from "../../ui/Image";
import ReplyMessage from "./ReplyMessage";
import MessageAction from "./MessageAction";
import SeenIndicator from "./SeenIndicator";
import { Copy, Reply, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  message: MessageResponse;
  onReply?: (message: MessageResponse) => void;
  onRecall?: (messageId: string) => void;
};

function MessageItem({ message, onReply, onRecall }: Props) {
  const {
    is_me,
    sender_name,
    sender_avatar_url,
    content,
    attachments,
    reply_message,
    is_recalled,
    is_seen,
    seen_by,
    created_at,
  } = message;

  const timeStr = format(new Date(created_at), "HH:mm", { locale: vi });

  const images = attachments?.filter((a) => a.type === "image") ?? [];
  const audios = attachments?.filter((a) => a.type === "audio") ?? [];
  const documents = attachments?.filter((a) => a.type === "document") ?? [];

  const avatar = (
    <Image
      src={sender_avatar_url ?? "/assets/user.png"}
      alt={sender_name}
      className="w-7 h-7 rounded-full object-cover shrink-0"
    />
  );

  if (is_recalled) {
    return (
      <div className={`flex gap-2 ${is_me ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex items-center">{avatar}</div>
        <div
          className={`flex flex-col gap-0.5 ${is_me ? "items-end" : "items-start"}`}
        >
          {!is_me && (
            <span className="text-neutral font-medium">{sender_name}</span>
          )}
          <p className="italic border border-dashed border-gray-100 px-4 py-2 rounded-2xl text-neutral">
            Tin nhắn đã bị thu hồi
          </p>
          <span className="text-neutral">{timeStr}</span>
        </div>
      </div>
    );
  }

  const actions = [
    {
      label: "Trả lời",
      icon: <Reply size={18} />,
      onClick: () => onReply?.(message),
    },
    {
      label: "Sao chép",
      icon: <Copy size={18} />,
      onClick: () => {
        navigator.clipboard.writeText(content ?? "");
        toast.success("Sao chép văn bản thành công");
      },
    },
    {
      label: "Thu hồi",
      icon: <Trash2 size={18} />,
      onClick: () => onRecall?.(message.message_id),
      className: "text-danger",
    },
  ];

  const actions1 = actions.filter((a) => a.label !== "Sao chép");

  return (
    <div className={`flex ${is_me ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[85%] sm:max-w-[75%] w-full space-y-2">
        {!is_me && (
          <div>
            <span className="text-neutral">{sender_name}</span>
          </div>
        )}

        <div
          className={`flex items-start gap-2 ${is_me ? "flex-row-reverse" : "flex-row"}`}
        >
          {!is_me && avatar}

          <div
            className={`relative flex flex-col gap-2 group ${is_me ? "items-end" : "items-start"}`}
          >
            {reply_message && (
              <ReplyMessage reply={reply_message} isMe={is_me} />
            )}

            {images.length > 0 && (
              <div
                className={`flex gap-1 flex-wrap ${is_me ? "justify-end" : "justify-start"}`}
              >
                {images.map((att) => (
                  <ImageAttachment key={att.attachment_id} att={att} />
                ))}
              </div>
            )}

            {audios.map((att) => (
              <div
                key={att.attachment_id}
                className={`rounded-2xl ${is_me ? "bg-primary text-white" : "bg-gray-100 text-neutral"}`}
              >
                <AudioAttachment att={att} />
              </div>
            ))}

            {documents.map((att) => (
              <div
                key={att.attachment_id}
                className={`rounded-2xl ${is_me ? "bg-primary text-white" : "bg-gray-100 text-neutral"}`}
              >
                <FileAttachment att={att} />
              </div>
            ))}

            {content && (
              <div
                className={`px-4 py-2.5 rounded-2xl leading-relaxed wrap-break-word
        ${is_me ? "bg-primary text-white rounded-br-none" : "bg-gray-100 rounded-bl-none"}`}
              >
                <p>{content}</p>
              </div>
            )}

            <MessageAction actions={content ? actions : actions1} />

            <div
              className={`flex items-center gap-1 ${is_me ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="text-neutral">{timeStr}</span>
              {is_me && <SeenIndicator is_seen={is_seen} seen_by={seen_by} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageItem;
