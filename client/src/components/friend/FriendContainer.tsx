import { Link, useLocation } from "react-router-dom";
import FriendList from "./FriendList";
import { UserRoundCheck, UserRoundPlus, UsersRound } from "lucide-react";
import SearchInput from "../ui/SearchInput";
import { mockFriendList } from "../../mocks/mockFriendList";
import FriendRequestList from "./FriendRequestList";
import { mockFriendRequestList } from "../../mocks/mockFriendRequestList";
import { mockSuggestedFriendList } from "../../mocks/mockSuggestedFriendList";
import SuggestedFriendList from "./SuggestedFriendList";

function FriendContainer() {
  const { pathname } = useLocation();

  const isFriendPage = pathname === "/friends";
  const isRequestPage = pathname === "/friends/request";
  const isSuggestionPage = pathname === "/friends/suggestion";

  const friends = mockFriendList;
  const friendRequests = mockFriendRequestList;
  const suggestedFriends = mockSuggestedFriendList;

  return (
    <div className="flex flex-col flex-1 gap-6 py-4 px-[15px] overflow-y-auto">
      <h3 className="font-bold">
        {isRequestPage
          ? "Lời mời kết bạn"
          : isFriendPage
            ? "Danh sách bạn bè"
            : "Những người bạn có thể biết"}{" "}
        (
        {isRequestPage
          ? friendRequests.length
          : isFriendPage
            ? friends.length
            : suggestedFriends.length}
        )
      </h3>

      <div className="flex justify-between items-center gap-4 lg:flex-row flex-col">
        <SearchInput />
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

      {isFriendPage && <FriendList friends={friends} />}

      {isRequestPage && <FriendRequestList friendRequests={friendRequests} />}

      {isSuggestionPage && (
        <SuggestedFriendList friendSuggests={suggestedFriends} />
      )}
    </div>
  );
}

export default FriendContainer;
