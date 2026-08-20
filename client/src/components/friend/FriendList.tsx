import { MessageCircleMore, UserRoundX } from "lucide-react";
import type { FriendResponse } from "../../types/types";
import UserItem from "../ui/UserItem";
import { useRemoveFriend } from "../../hooks/queries/useFriends";
import { useGetOrCreatePrivateConversation } from "../../hooks/queries/useConversations";
import { useNavigate } from "react-router-dom";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import Loading from "../ui/Loading";
import Image from "../ui/Image";
import FriendListSkeleton from "../skeleton/FriendListSkeleton";

interface Props {
  friends: FriendResponse[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}

function FriendList({
  friends,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
}: Props) {
  const navigate = useNavigate();

  const removeFriend = useRemoveFriend();
  const isLoadingRemoveFriend = removeFriend.isPending;

  const getOrCreatePrivateConversation = useGetOrCreatePrivateConversation();
  const isLoadingGetOrCreatePrivateConversation =
    getOrCreatePrivateConversation.isPending;

  const loadMoreRef = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  const handleRemoveFriend = (friendId: string) => {
    if (isLoadingRemoveFriend) {
      return;
    }

    removeFriend.mutate(friendId);
  };

  const handleMessage = (friendId: string) => {
    if (isLoadingGetOrCreatePrivateConversation) {
      return;
    }

    getOrCreatePrivateConversation.mutate(friendId, {
      onSuccess: (res) => {
        const conversationId = res.data.conversation_id;

        navigate(`/messages/${conversationId}`);
      },
    });
  };

  return (
    <div
      className={`max-h-[400px] h-full ${friends.length ? "overflow-y-auto" : "overflow-hidden"}`}
    >
      {isLoading ? (
        <FriendListSkeleton count={6} />
      ) : friends.length ? (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
          {friends.map((friend) => (
            <UserItem
              key={friend.user_id}
              avatarUrl={friend.avatar_url}
              title={`${friend.first_name} ${friend.last_name}`}
              isOnline={friend.is_online}
              titleAs="h5"
              titleClassName="font-semibold"
              dropdownItems={[
                {
                  label: "Nhắn tin",
                  icon: <MessageCircleMore size={20} />,
                  onClick: () => handleMessage(friend.user_id),
                  disabled: isLoadingGetOrCreatePrivateConversation,
                },
                {
                  label: "Hủy kết bạn",
                  icon: <UserRoundX size={20} />,
                  onClick: () => handleRemoveFriend(friend.user_id),
                  disabled: isLoadingRemoveFriend,
                  textColor: "text-danger",
                },
              ]}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-[15px]">
            <Image
              src="/assets/notfound1.png"
              className="w-[140px]"
              alt="not found"
              loading="eager"
            />
            <h4 className="font-semibold">Không tìm thấy</h4>
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

export default FriendList;
