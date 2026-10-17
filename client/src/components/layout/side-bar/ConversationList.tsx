import { useGetConversationList } from "../../../hooks/queries/useConversations";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import type { ConversationType } from "../../../types/types";
import ConversationListSkeleton from "../../skeleton/ConversationListSkeleton";
import Image from "../../ui/Image";
import Loading from "../../ui/Loading";
import ConversationItem from "./ConversationItem";

interface Props {
  type: ConversationType | null;
  q: string;
}

function ConversationList({ type, q }: Props) {
  const {
    data: conversations,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetConversationList(type, q);

  const loadMoreRef = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });
  return (
    <div
      className={`${conversations?.content?.length ? "overflow-y-auto" : "overflow-hidden"} h-full`}
    >
      {isLoading ? (
        <ConversationListSkeleton count={6} />
      ) : conversations?.content?.length ? (
        conversations?.content.map((conversation) => (
          <ConversationItem
            conversation={conversation}
            key={conversation.conversation_id}
          />
        ))
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-[15px]">
            <Image
              src="/assets/notfound1.png"
              className="w-[120px]"
              alt="not found"
              loading="eager"
            />
          </div>
        </div>
      )}

      <div ref={loadMoreRef} className="h-1" />

      {isFetchingNextPage && (
        <Loading height={10} size={24} color={"black"} thickness={1.5} />
      )}
    </div>
  );
}

export default ConversationList;
