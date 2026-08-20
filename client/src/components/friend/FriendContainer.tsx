import { Link, useLocation } from "react-router-dom";
import FriendList from "./FriendList";
import { UserRoundCheck, UserRoundPlus, UsersRound } from "lucide-react";
import SearchInput from "../ui/SearchInput";
import FriendRequestList from "./FriendRequestList";
import SuggestedFriendList from "./SuggestedFriendList";
import {
  useGetFriendList,
  useGetFriendRequestList,
  useGetSuggestedFriends,
} from "../../hooks/queries/useFriends";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";

function FriendContainer() {
  const { pathname } = useLocation();

  const [searchState, setSearchState] = useState({
    pathname,
    value: "",
  });
  const search = searchState.pathname === pathname ? searchState.value : "";
  const debouncedSearch = useDebounce(search.trim(), 500);

  const isFriendPage = pathname === "/friends";
  const isRequestPage = pathname === "/friends/request";
  const isSuggestionPage = pathname === "/friends/suggestion";

  const {
    data: friends,
    isLoading: isLoadingFriends,
    fetchNextPage: fetchNextFriendsPage,
    hasNextPage: hasNextFriendsPage,
    isFetchingNextPage: isFetchingNextFriendsPage,
  } = useGetFriendList(debouncedSearch, isFriendPage);
  const {
    data: friendRequests,
    isLoading: isLoadingFriendRequests,
    fetchNextPage: fetchNextFriendRequestsPage,
    hasNextPage: hasNextFriendRequestsPage,
    isFetchingNextPage: isFetchingNextFriendRequestsPage,
  } = useGetFriendRequestList(debouncedSearch, isRequestPage);
  const {
    data: suggestedFriends,
    isLoading: isLoadingSuggestedFriends,
    fetchNextPage: fetchNextSuggestedFriendsPage,
    hasNextPage: hasNextSuggestedFriendsPage,
    isFetchingNextPage: isFetchingNextSuggestedFriendsPage,
  } = useGetSuggestedFriends(debouncedSearch, isSuggestionPage);

  const count = isRequestPage
    ? (friendRequests?.content.length ?? 0)
    : isFriendPage
      ? (friends?.content.length ?? 0)
      : (suggestedFriends?.content.length ?? 0);
  return (
    <div className="flex flex-col flex-1 gap-6 py-4 px-[15px] overflow-y-auto">
      <h3 className="font-bold">
        {isRequestPage
          ? "Lời mời kết bạn"
          : isFriendPage
            ? "Danh sách bạn bè"
            : "Những người bạn có thể biết"}{" "}
        ({count})
      </h3>

      <div className="flex justify-between items-center gap-4 lg:flex-row flex-col">
        <SearchInput
          value={search}
          onChange={(value) => setSearchState({ pathname, value })}
        />

        <div className="flex gap-2">
          {!isFriendPage && (
            <Link
              className="px-3 py-3 rounded-md font-medium hover:bg-secondary text-primary flex items-center gap-2"
              to={"/friends"}
            >
              <span>Bạn bè</span>
              <UserRoundCheck size={20} />
            </Link>
          )}

          {!isRequestPage && !isSuggestionPage && (
            <Link
              className="px-3 py-3 rounded-md font-medium hover:bg-secondary text-primary flex items-center gap-2"
              to={"/friends/request"}
            >
              <span>Lời mới kết bạn</span>

              <UserRoundPlus size={20} />
            </Link>
          )}

          <Link
            className="px-3 py-3 rounded-md font-medium hover:bg-secondary text-primary flex items-center gap-2"
            to="/friends/suggestion"
          >
            <span>Tìm bạn bè</span>
            <UsersRound size={20} />
          </Link>
        </div>
      </div>

      {isFriendPage && (
        <FriendList
          friends={friends?.content ?? []}
          fetchNextPage={fetchNextFriendsPage}
          hasNextPage={hasNextFriendsPage}
          isFetchingNextPage={isFetchingNextFriendsPage}
          isLoading={isLoadingFriends}
        />
      )}

      {isRequestPage && (
        <FriendRequestList
          friendRequests={friendRequests?.content ?? []}
          fetchNextPage={fetchNextFriendRequestsPage}
          hasNextPage={hasNextFriendRequestsPage}
          isFetchingNextPage={isFetchingNextFriendRequestsPage}
         isLoading={isLoadingFriendRequests}
          />
      )}

      {isSuggestionPage && (
        <SuggestedFriendList
          friendSuggests={suggestedFriends?.content ?? []}
          fetchNextPage={fetchNextSuggestedFriendsPage}
          hasNextPage={hasNextSuggestedFriendsPage}
          isFetchingNextPage={isFetchingNextSuggestedFriendsPage}
          isLoading={isLoadingSuggestedFriends}
        />
      )}
    </div>
  );
}

export default FriendContainer;
