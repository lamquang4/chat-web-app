import { format } from "date-fns";
import type { FriendRequestResponse } from "../../types/types";
import UserItem from "../ui/UserItem";
import Button from "../ui/Button";
import {
  useAcceptFriendRequest,
  useRejectFriendRequest,
} from "../../hooks/queries/useFriends";
import { useIntersectionObserver } from "../../hooks/useIntersectionObserver";
import Loading from "../ui/Loading";
import Image from "../ui/Image";
import UserListSkeleton from "../skeleton/UserListSkeleton";

interface Props {
  friendRequests: FriendRequestResponse[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
}

function FriendRequestList({
  friendRequests,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
}: Props) {
  const acceptFriendRequest = useAcceptFriendRequest();
  const isLoadingAcceptFriendRequest = acceptFriendRequest.isPending;

  const rejectFriendRequest = useRejectFriendRequest();
  const isLoadingRejectFriendRequest = rejectFriendRequest.isPending;

  const loadMoreRef = useIntersectionObserver({
    enabled: hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  const handleAcceptFriendRequest = (friendId: string) => {
    if (isLoadingAcceptFriendRequest) {
      return;
    }

    acceptFriendRequest.mutate(friendId);
  };

  const handleRejectFriendRequest = (friendId: string) => {
    if (isLoadingRejectFriendRequest) {
      return;
    }

    rejectFriendRequest.mutate(friendId);
  };

  return (
    <div
      className={`max-h-[400px] h-full ${friendRequests.length ? "overflow-y-auto" : "overflow-hidden"}`}
    >
      {isLoading ? (
        <UserListSkeleton count={6} showSubtitle showExtra extraCount={2} />
      ) : friendRequests.length ? (
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
          {friendRequests.map((friendRequest) => (
            <UserItem
              key={friendRequest.requester_id}
              avatarUrl={friendRequest.avatar_url}
              title={`${friendRequest.first_name} ${friendRequest.last_name}`}
              titleAs="h5"
              titleClassName="font-semibold"
              subtitle={
                "Ngày gửi: " +
                format(new Date(friendRequest.created_at), "dd/MM/yyyy")
              }
              extra={
                <div className="flex gap-4">
                  <Button
                    disabled={isLoadingAcceptFriendRequest}
                    onClick={() =>
                      handleAcceptFriendRequest(friendRequest.requester_id)
                    }
                    className="py-1.5 w-full rounded-md font-medium bg-success text-white"
                  >
                    Xác nhận
                  </Button>
                  <Button
                    disabled={isLoadingRejectFriendRequest}
                    onClick={() =>
                      handleRejectFriendRequest(friendRequest.requester_id)
                    }
                    className="py-1.5 w-full rounded-md font-medium bg-danger text-white"
                  >
                    Từ chối
                  </Button>
                </div>
              }
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

export default FriendRequestList;
