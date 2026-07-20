import { useEffect, useRef } from "react";
import type { MessageResponse } from "../../types/types";
import MessageItem from "./message/MessageItem";

type Props = {
  messages: MessageResponse[];
};

function ConversationBody({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-[15px] py-8 flex flex-col gap-2">
      {messages.map((message) => (
        <MessageItem key={message.message_id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ConversationBody;
