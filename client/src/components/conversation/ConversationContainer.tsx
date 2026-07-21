import { mockConversationDetailGroup } from "../../mocks/mockConversationDetail";
import ConversationBody from "./ConversationBody";
import ConversationFooter from "./footer/ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import type { MessageResponse, ReplyMessageResponse } from "../../types/types";
import { useState } from "react";

function ConversationContainer() {
  const conversation = mockConversationDetailGroup;

  const [replyTo, setReplyTo] = useState<ReplyMessageResponse | null>(null);

  const handleReply = (message: MessageResponse) => {
    setReplyTo({
      message_id: message.message_id,
      sender_name: message.sender_name,
      content: message.content,
      attachments: message.attachments,
    });
  };

  const handleRecall = (messageId: string) => {
    console.log(messageId);
  };

  return (
    <div className="flex flex-col flex-1 overflow-visible bg-white">
      <ConversationHeader
        conversationId={conversation.conversation_id}
        type={conversation.type}
        name={conversation.name}
        is_online={conversation.is_online}
      />

      <ConversationBody
        messages={conversation.messages.content}
        onReply={handleReply}
        onRecall={handleRecall}
        replyTo={replyTo}
      />

      <ConversationFooter
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}

export default ConversationContainer;
