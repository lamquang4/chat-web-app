import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import type { MessageResponse } from "../../../types/types";
import ImageAttachment from "./attachment/ImageAttachment";
import AudioAttachment from "./attachment/AudioAttachment";
import DocumentAttachment from "./attachment/DocumentAttachment";
import Image from "../../ui/Image";
import ReplyMessage from "./ReplyMessage";
import MessageAction from "./MessageAction";
import SeenIndicator from "./SeenIndicator";
import { Copy, Reply, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  message: MessageResponse;
  onReply?: (message: MessageResponse) => void;
  onRecall?: (messageId: string) => void;
  onJumpToReplyMessage?: (messageId: string) => void;
}

function MessageItem({
  message,
  onReply,
  onRecall,
  onJumpToReplyMessage,
}: Props) {
  const {
    is_me,
    sender_name,
    sender_avatar_url,
    content,
    link_preview,
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

  const [showActions, setShowActions] = useState<boolean>(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!showActions) return;

    const handler = (e: MouseEvent | TouchEvent) => {
      if (!itemRef.current?.contains(e.target as Node)) {
        setShowActions(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [showActions]);

  const clearLongPressTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePressStart = (x: number, y: number) => {
    startPosRef.current = { x, y };

    timerRef.current = setTimeout(() => {
      setShowActions(true);
      if (navigator.vibrate) navigator.vibrate(30);
    }, 450);
  };

  const handlePressMove = (x: number, y: number) => {
    if (!startPosRef.current) return;
    const dx = Math.abs(x - startPosRef.current.x);
    const dy = Math.abs(y - startPosRef.current.y);
    if (dx > 10 || dy > 10) {
      clearLongPressTimer();
    }
  };

  const handlePressEnd = () => {
    clearLongPressTimer();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePressStart(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handlePressMove(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => {
    handlePressEnd();
  };

  const actions = [
    {
      label: "Trả lời",
      icon: <Reply size={18} />,
      onClick: () => onReply?.(message),
    },
    ...(content
      ? [
          {
            label: "Sao chép",
            icon: <Copy size={18} />,
            onClick: () => {
              navigator.clipboard.writeText(content ?? "");
              toast.success("Sao chép văn bản thành công");
            },
          },
        ]
      : []),
    ...(message.is_me
      ? [
          {
            label: "Thu hồi",
            icon: <Trash2 size={18} />,
            onClick: () => onRecall?.(message.message_id),
            className: "text-danger",
          },
        ]
      : []),
  ];

  return (
    <div
      ref={itemRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`relative group flex ${is_me ? "justify-end" : "justify-start"}`}
    >
      <div className="max-w-[85%] sm:max-w-[75%] w-full flex flex-col gap-2 select-none">
        {!is_me && <span className="text-neutral">{sender_name}</span>}

        <div
          className={`flex items-start gap-4 ${is_me ? "flex-row-reverse" : "flex-row"}`}
        >
          {!is_me && (
            <Image
              src={sender_avatar_url ?? "/assets/user.png"}
              alt={sender_name}
              className="w-7 h-7 rounded-full object-cover shrink-0"
            />
          )}

          <div className={`relative flex flex-col gap-2`}>
            <div
              className={`flex flex-col gap-2 ${is_me ? "items-end" : "items-start"}`}
            >
              {!is_recalled && reply_message && (
                <ReplyMessage
                  reply={reply_message}
                  isMe={is_me}
                  onClick={() =>
                    onJumpToReplyMessage?.(reply_message.message_id)
                  }
                />
              )}

              {is_recalled && (
                <div
                  className={`px-4 py-2.5 rounded-2xl leading-relaxed wrap-break-word italic
        ${is_me ? "bg-primary text-white rounded-br-none" : "bg-gray-200/70 rounded-bl-none"}`}
                >
                  <p>Tin nhắn đã thu hồi</p>
                </div>
              )}

              {images.length > 0 && (
                <div
                  className={`flex gap-1 flex-wrap ${is_me ? "justify-end" : "justify-start"}`}
                >
                  {images.map((att) => (
                    <ImageAttachment
                      key={att.attachment_id}
                      att={att}
                      size={images.length === 1 ? "large" : "small"}
                    />
                  ))}
                </div>
              )}

              {audios.map((att) => (
                <div
                  key={att.attachment_id}
                  className={`rounded-2xl ${is_me ? "bg-primary text-white" : "bg-gray-200/70 text-neutral"}`}
                >
                  <AudioAttachment att={att} isMe={is_me} />
                </div>
              ))}

              {documents.map((att) => (
                <div
                  key={att.attachment_id}
                  className={`rounded-2xl ${is_me ? "bg-primary text-white" : "bg-gray-200/70 text-neutral"}`}
                >
                  <DocumentAttachment att={att} />
                </div>
              ))}

              {!is_recalled && content && (
                <div
                  className={`px-4 py-2.5 rounded-2xl leading-relaxed wrap-break-word ${is_me ? "bg-primary text-white rounded-br-none" : "bg-gray-200/70 rounded-bl-none"}`}
                >
                  <p>{content}</p>
                </div>
              )}

              {!is_recalled && link_preview?.url && (
                <a
                  href={link_preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full max-w-90 overflow-hidden rounded-xl ${is_me ? "bg-primary text-white" : "bg-gray-200/70"}`}
                >
                  {link_preview.image && (
                    <Image
                      src={link_preview.image}
                      alt={link_preview.title ?? link_preview.site_name ?? ""}
                      className="block max-h-96 w-full object-contain"
                      loading="lazy"
                    />
                  )}
                  <div className="px-3 py-2 space-y-2">
                    <p className="font-semibold line-clamp-2">
                      {link_preview.title ?? link_preview.url}
                    </p>
                    {link_preview.description && (
                      <p className="line-clamp-2">{link_preview.description}</p>
                    )}
                    <p>
                      {link_preview.site_name ??
                        new URL(link_preview.url).hostname}
                    </p>
                  </div>
                </a>
              )}
            </div>

            <div
              className={`flex items-center gap-1 ${is_me ? "flex-row-reverse" : "flex-row"}`}
            >
              <span className="text-neutral">{timeStr}</span>
              {is_me && <SeenIndicator is_seen={is_seen} seen_by={seen_by} />}
            </div>
          </div>
        </div>
      </div>

      {!is_recalled && (
        <MessageAction
          actions={actions}
          forceVisible={showActions}
          onActionDone={() => setShowActions(false)}
        />
      )}
    </div>
  );
}

export default MessageItem;
