import { format, isSameDay, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);

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
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
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

  // Reset trạng thái scroll khi chuyển sang cuộc trò chuyện khác.
  useEffect(() => {
    isFirstRenderRef.current = true;
    isAtBottomRef.current = true;
  }, [conversationId]);

  // Khi có tin nhắn mới / mở conversation -> cuộn xuống nếu đang ở đáy
  useLayoutEffect(() => {
    const smooth = !isFirstRenderRef.current;

    if (isFirstRenderRef.current || isAtBottomRef.current) {
      scrollToBottom(smooth);
    }
    isFirstRenderRef.current = false;
  }, [conversationId, messages]);

  // Theo dõi chiều cao container đổi (ảnh/attachment load xong)
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const resizeObserver = new ResizeObserver(() => {
      if (isAtBottomRef.current) {
        scrollToBottom(false);
      }
    });
    resizeObserver.observe(content);
    return () => resizeObserver.disconnect();
  }, []);

  const scrollToReplyMessage = (messageId: string) => {
    const el = replyMessageRefs.current[messageId];
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const formatMessageDate = (date: Date) => {
    if (isToday(date)) return "Hôm nay";
    if (isYesterday(date)) return "Hôm qua";
    return format(date, "EEEE, dd/MM/yyyy", { locale: vi });
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ overflowAnchor: "none" }}
      className="relative flex flex-col flex-1 overflow-y-auto gap-4"
    >
      <div ref={contentRef} className="px-3.75 py-10">
        <div ref={loadMoreRef} className="h-1" />

        {isFetchingNextPage && (
          <Loading height={0} size={30} color="gray" thickness={2} />
        )}

        <div className="flex flex-col gap-4">
          {messages.map((message, index) => {
            const messageDate = new Date(message.created_at);
            const previousMessage = messages[index - 1];
            const isNewDay =
              !previousMessage ||
              !isSameDay(messageDate, new Date(previousMessage.created_at));

            return (
              <div key={message.message_id} className="flex flex-col gap-4">
                {isNewDay && (
                  <div className="flex justify-center py-2 text-text-muted font-medium">
                    <span>{formatMessageDate(messageDate)}</span>
                  </div>
                )}

                <div
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
              </div>
            );
          })}
        </div>
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
