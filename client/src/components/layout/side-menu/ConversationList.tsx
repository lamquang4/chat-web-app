import { useGetConversationList } from "../../../hooks/queries/useConversations";
import { useIntersectionObserver } from "../../../hooks/useIntersectionObserver";
import type { ConversationType } from "../../../types/types";
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
  } = useGetConversationList(type, q);

  const loadMoreRef = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });
  return (
    <div className="overflow-y-auto">
      {conversations?.content.map((conversation) => (
        <ConversationItem
          conversation={conversation}
          key={conversation.conversation_id}
        />
      ))}

      <div ref={loadMoreRef} className="h-1" />

      {isFetchingNextPage && (
        <Loading height={10} size={24} color={"black"} thickness={1.5} />
      )}
    </div>
  );
}

export default ConversationList;
