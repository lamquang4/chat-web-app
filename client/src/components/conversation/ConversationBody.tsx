import { useEffect, useRef, useState } from "react";
import type { MessageResponse } from "../../types/types";
import MessageItem from "./message/MessageItem";
import Button from "../ui/Button";
import { ArrowDown } from "lucide-react";

interface Props {
  messages: MessageResponse[];
  onReply: (message: MessageResponse) => void;
  onRecall: (messageId: string) => void;
}

// Sai số cho phép khi coi là "đang ở đáy" (px)
const BOTTOM_THRESHOLD = 80;

function ConversationBody({ messages, onReply, onRecall }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const replyMessageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const isAtBottomRef = useRef<boolean>(true);
  const isFirstRenderRef = useRef<boolean>(true);

  const setAtBottom = (value: boolean) => {
    isAtBottomRef.current = value;
    setIsAtBottom(value);
  };

  const scrollToBottom = (smooth: boolean) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Theo dõi vị trí scroll hiện tại
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom =
        scrollHeight - scrollTop - clientHeight <= BOTTOM_THRESHOLD;
      setAtBottom(atBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // Khi có tin nhắn mới / mở conversation -> cuộn xuống nếu đang ở đáy
  useEffect(() => {
    const smooth = !isFirstRenderRef.current;
    if (isFirstRenderRef.current || isAtBottomRef.current) {
      scrollToBottom(smooth);
    }
    isFirstRenderRef.current = false;
  }, [messages]);

  // Theo dõi chiều cao container đổi (ảnh/attachment load xong)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      if (isAtBottomRef.current) {
        scrollToBottom(false);
      }
    });
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const scrollToReplyMessage = (messageId: string) => {
    const el = replyMessageRefs.current[messageId];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-[15px] py-10 flex flex-col gap-2 relative"
    >
      {messages.map((message) => (
        <div
          key={message.message_id}
          ref={(el) => {
            replyMessageRefs.current[message.message_id] = el;
          }}
        >
          <MessageItem
            message={message}
            onReply={onReply}
            onRecall={onRecall}
            onJumpToReplyMessage={scrollToReplyMessage}
          />
        </div>
      ))}
      <div ref={bottomRef} />

      {!isAtBottom && (
        <div className="sticky bottom-2 flex justify-center pointer-events-none">
          <Button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-gray-300 pointer-events-auto text-neutral flex justify-center items-center shadow-md"
          >
            <ArrowDown size={22} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default ConversationBody;
