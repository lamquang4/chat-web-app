import { Link, useLocation } from "react-router-dom";
import FriendList from "./FriendList";
import { UserRoundCheck, UserRoundPlus } from "lucide-react";
import SearchInput from "../ui/SearchInput";
import { mockFriendList } from "../../mocks/mockFriendList";
import FriendRequestList from "./FriendRequestList";
import { mockFriendRequestList } from "../../mocks/mockFriendRequestList";

function FriendContainer() {
  const { pathname } = useLocation();

  const isAddFriendPage = pathname === "/friend/add";

  const friends = mockFriendList;
  const friendRequests = mockFriendRequestList;

  return (
    <div className="space-y-6 px-[15px] py-4 flex-1 h-full min-h-0 overflow-y-auto">
      <h3>
        {isAddFriendPage ? "Lời mời kết bạn" : "Danh sách bạn bè"} (
        {isAddFriendPage ? friendRequests.length : friends.length})
      </h3>

      <div className="flex justify-between items-center gap-4 lg:flex-row flex-col">
        <SearchInput />

        <Link
          className="px-2 py-2.5 rounded-md text-[0.9rem] font-medium bg-primary text-white"
          to={isAddFriendPage ? "/friend" : "/friend/add"}
        >
          <div className="flex items-center gap-2">
            <span> {isAddFriendPage ? "Bạn bè" : "Thêm bạn"} </span>
            {isAddFriendPage ? (
              <UserRoundCheck size={20} />
            ) : (
              <UserRoundPlus size={20} />
            )}
          </div>
        </Link>
      </div>

      {isAddFriendPage ? (
        <FriendRequestList friendRequests={friendRequests} />
      ) : (
        <FriendList friends={friends} />
      )}
    </div>
  );
}

export default FriendContainer;
