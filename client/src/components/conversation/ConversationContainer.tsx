import { mockConversationDetailGroup } from "../../mocks/mockConversationDetail";
import ConversationBody from "./ConversationBody";
import ConversationFooter from "./footer/ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import type { MessageResponse, ReplyMessageResponse } from "../../types/types";
import { useState } from "react";
import Swal from "sweetalert2";

function ConversationContainer() {
  const [replyTo, setReplyTo] = useState<ReplyMessageResponse | null>(null);

  const conversation = mockConversationDetailGroup;

  const handleReply = (message: MessageResponse) => {
    if (!message) {
      return;
    }

    setReplyTo({
      message_id: message.message_id,
      sender_name: message.sender_name,
      content: message.content,
      attachments: message.attachments,
    });
  };

  const handleRecall = async (messageId: string) => {
    const result = await Swal.fire({
      title: "Thu hồi tin nhắn?",
      text: "Bạn có chắc chắn muốn thu hồi tin nhắn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#076ffe",
      cancelButtonColor: "#d9534f",
      reverseButtons: true,
    });

    if (!result.isConfirmed || !messageId) return;
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
