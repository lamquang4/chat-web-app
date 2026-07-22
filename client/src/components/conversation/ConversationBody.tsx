import { useEffect, useRef } from "react";
import type { MessageResponse } from "../../types/types";
import MessageItem from "./message/MessageItem";

type Props = {
  messages: MessageResponse[];
  onReply: (message: MessageResponse) => void;
  onRecall: (messageId: string) => void;
};

function ConversationBody({ messages, onReply, onRecall }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const replyMessageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToReplyMessage = (messageId: string) => {
    const el = replyMessageRefs.current[messageId];
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="flex-1 overflow-y-auto px-[15px] py-10 flex flex-col gap-2">
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
    </div>
  );
}

export default ConversationBody;
