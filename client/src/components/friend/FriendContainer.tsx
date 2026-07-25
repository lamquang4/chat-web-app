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
    <div className="flex flex-col flex-1 gap-6 py-4 px-[15px] overflow-y-auto">
      <h3 className="font-bold">
        {isAddFriendPage ? "Lời mời kết bạn" : "Danh sách bạn bè"} (
        {isAddFriendPage ? friendRequests.length : friends.length})
      </h3>

      <div className="flex justify-between items-center gap-4 lg:flex-row flex-col">
        <SearchInput />

        <Link
          className="px-3 py-3 rounded-md text-[0.9rem] font-medium hover:bg-secondary text-primary "
          to={isAddFriendPage ? "/friend" : "/friend/add"}
        >
          <div className="flex items-center gap-2">
            <span> {isAddFriendPage ? "Bạn bè" : "Lời mới kết bạn"} </span>
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
