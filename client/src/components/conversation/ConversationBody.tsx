import { useEffect, useRef, useState, type RefObject } from "react";
import type { MessageResponse } from "../../types/types";
import MessageItem from "./message/MessageItem";
import Button from "../ui/Button";
import { ArrowDown } from "lucide-react";
import Loading from "../ui/Loading";
import ImageViewer from "../ui/ImageViewer";
import { useGetConversationImages } from "../../hooks/queries/useConversations";

interface Props {
  conversationId: string;
  messages: MessageResponse[];
  loadMoreRef: RefObject<HTMLDivElement | null>;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onReply: (message: MessageResponse) => void;
  onRecall: (messageId: string) => void;
}

function ConversationBody({
  conversationId,
  messages,
  loadMoreRef,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onReply,
  onRecall,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const replyMessageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isAtBottom, setIsAtBottom] = useState<boolean>(true);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null); // đánh dấu vị trí hình giúp khi bấm vào hình để imageviewer hiển thị
  const [shouldFetchImages, setShouldFetchImages] = useState(false);
  const isAtBottomRef = useRef<boolean>(true);
  const isFirstRenderRef = useRef<boolean>(true);

  const {
    data: images = [],
    refetch,
    isFetched,
  } = useGetConversationImages(conversationId, shouldFetchImages);

  const handleOpenImage = async (attachmentId: string) => {
    setShouldFetchImages(true);

    const list = isFetched ? images : ((await refetch()).data ?? []);

    const index = list.findIndex((img) => img.attachment_id === attachmentId);
    if (index !== -1) setViewerIndex(index);
  };

  const handleCloseViewer = () => {
    setViewerIndex(null);
  };

  const setAtBottom = (value: boolean) => {
    isAtBottomRef.current = value;
    setIsAtBottom(value);
  };

  const scrollToBottom = (smooth: boolean) => {
    bottomRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setAtBottom(distanceFromBottom <= 80);

    if (scrollTop <= 80 && hasNextPage && !isFetchingNextPage) {
      onLoadMore();
    }
  };

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
      onScroll={handleScroll}
      className="relative flex flex-col flex-1 overflow-y-auto gap-4"
    >
      <div className="px-3.75 py-10">
        <div ref={loadMoreRef} className="h-1" />

        {isFetchingNextPage && (
          <Loading height={0} size={30} color="gray" thickness={2} />
        )}

        <div className="flex flex-col gap-4">
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
                onOpenImage={handleOpenImage}
              />
            </div>
          ))}
        </div>

        <div ref={bottomRef} />
      </div>

      {!isAtBottom && (
        <div className="sticky bottom-3 flex justify-center pointer-events-none">
          <Button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="w-9 h-9 rounded-full bg-white hover:bg-bg border border-border pointer-events-auto text-text-muted flex justify-center items-center shadow-md"
          >
            <ArrowDown size={22} />
          </Button>
        </div>
      )}

      {viewerIndex !== null && (
        <ImageViewer
          images={images.map((img) => img.url)}
          index={viewerIndex}
          open={viewerIndex !== null}
          onClose={handleCloseViewer}
        />
      )}
    </div>
  );
}

export default ConversationBody;
