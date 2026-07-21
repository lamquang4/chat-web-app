import { useEffect, useRef } from "react";
import type { MessageResponse, ReplyMessageResponse } from "../../types/types";
import MessageItem from "./message/MessageItem";

type Props = {
  messages: MessageResponse[];
  onReply: (message: MessageResponse) => void;
  onRecall: (messageId: string) => void;
  replyTo: ReplyMessageResponse | null;
};

function ConversationBody({ messages, onReply, onRecall, replyTo }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, replyTo]);

  return (
    <div className="flex-1 overflow-y-auto px-[15px] py-8 flex flex-col gap-2">
      {messages.map((message) => (
        <MessageItem
          key={message.message_id}
          message={message}
          onReply={onReply}
          onRecall={onRecall}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ConversationBody;
