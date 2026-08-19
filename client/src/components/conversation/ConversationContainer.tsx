import ConversationBody from "./ConversationBody";
import ConversationFooter from "./footer/ConversationFooter";
import ConversationHeader from "./ConversationHeader";
import type { MessageResponse, ReplyMessageResponse } from "../../types/types";
import { useState } from "react";
import Swal from "sweetalert2";
import { useGetConversationDetail } from "../../hooks/queries/useConversations";
import { useParams } from "react-router-dom";
import { useRecallMessage } from "../../hooks/queries/useMesssages";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import { useMessageSocket } from "../../hooks/useMessageSocket";
import { useEffect } from "react";
import { getSocket, onSocketReady } from "../../hooks/socket/socket";
import { SOCKET_EVENTS } from "../../hooks/socket/events";
import { jwtUtil } from "../../utils/jwtUtil";

function ConversationContainer() {
  const { conversationId } = useParams();
  const [replyTo, setReplyTo] = useState<ReplyMessageResponse | null>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetConversationDetail(conversationId as string);

  useMessageSocket(conversationId as string);

  const conversation = data?.conversation;
  const messages = data?.messages ?? [];

  useEffect(() => {
    const currentUserId = jwtUtil.getUserId();
    const unreadMessages = messages.filter(
      (message) =>
        !message.is_me &&
        !message.seen_by.some((user) => user.user_id === currentUserId),
    );
    if (unreadMessages.length === 0) return;

    const markAsSeen = () => {
      const socket = getSocket();
      unreadMessages.forEach((message) => {
        socket.emit(SOCKET_EVENTS.MESSAGE_SEEN, {
          conversation_id: conversationId,
          message_id: message.message_id,
        });
      });
    };

    const unsubscribe = onSocketReady(markAsSeen);
    return unsubscribe;
  }, [conversationId, messages]);

  const recallMessage = useRecallMessage();
  const isLoadingRecallMessage = recallMessage.isPending;

  const loadMoreRef = useIntersectionObserver({
    enabled: Boolean(hasNextPage) && !isFetchingNextPage,
    onIntersect: () => {
      fetchNextPage();
    },
  });

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
    if (!messageId || isLoadingRecallMessage) {
      return;
    }
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

    if (!result.isConfirmed) return;

    recallMessage.mutate(messageId);
  };

  if (!conversation) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 h-full min-h-0 overflow-hidden bg-white">
      <ConversationHeader
        conversationId={conversation.conversation_id}
        type={conversation.type}
        name={conversation.name}
        is_online={conversation.is_online}
        avatar_url={conversation.avatar_url}
      />

      <ConversationBody
        messages={messages}
        loadMoreRef={loadMoreRef}
        hasNextPage={Boolean(hasNextPage)}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
        onReply={handleReply}
        onRecall={handleRecall}
      />

      <ConversationFooter
        conversationId={conversation.conversation_id}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
}

export default ConversationContainer;
