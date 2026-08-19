import UserItem from "../ui/UserItem";
import Button from "../ui/Button";
import type { SuggestedFriendResponse } from "../../types/types";
import { useSendFriendRequest } from "../../hooks/queries/useFriends";
import { useGetOrCreatePrivateConversation } from "../../hooks/queries/useConversations";
import { useNavigate } from "react-router-dom";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import Loading from "../ui/Loading";

interface Props {
  friendSuggests: SuggestedFriendResponse[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

function SuggestedFriendList({
  friendSuggests,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: Props) {
  const navigate = useNavigate();

  const sendFriendRequest = useSendFriendRequest();
  const isLoadingSendFriendRequest = sendFriendRequest.isPending;

  const getOrCreatePrivateConversation = useGetOrCreatePrivateConversation();
  const isLoadingGetOrCreatePrivateConversation =
    getOrCreatePrivateConversation.isPending;

  const loadMoreRef = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  const handleMessage = (userId: string) => {
    if (isLoadingGetOrCreatePrivateConversation) {
      return;
    }

    getOrCreatePrivateConversation.mutate(userId, {
      onSuccess: (res) => {
        const conversationId = res.data.conversation_id;

        navigate(`/messages/${conversationId}`);
      },
    });
  };

  const handleSendFriendRequest = (friendId: string) => {
    if (isLoadingSendFriendRequest) {
      return;
    }

    sendFriendRequest.mutate(friendId);
  };

  return (
    <div className="max-h-[400px] h-full overflow-y-auto">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
        {friendSuggests.map((friendSuggest) => (
          <UserItem
            avatarUrl={friendSuggest.avatar_url}
            title={`${friendSuggest.first_name} ${friendSuggest.last_name}`}
            titleAs="h5"
            titleClassName="font-semibold"
            extra={
              <div className="flex gap-4">
                <Button
                  disabled={isLoadingSendFriendRequest}
                  onClick={() => handleSendFriendRequest(friendSuggest.user_id)}
                  className="py-1.5 w-full rounded-md font-medium bg-success text-white"
                >
                  Thêm bạn bè
                </Button>

                <Button
                  disabled={isLoadingGetOrCreatePrivateConversation}
                  onClick={() => handleMessage(friendSuggest.user_id)}
                  className="py-1.5 w-full rounded-md font-medium bg-danger text-white"
                >
                  Nhắn tin
                </Button>
              </div>
            }
          />
        ))}
      </div>

      <div ref={loadMoreRef} className="h-1" />

      {isFetchingNextPage && (
        <Loading height={10} size={24} color={"black"} thickness={1.5} />
      )}
    </div>
  );
}

export default SuggestedFriendList;
