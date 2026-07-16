import type { FriendResponse } from "../../types/types";
import FriendItem from "./FriendItem";

type Props = {
  friends: FriendResponse[];
};

function FriendList({ friends }: Props) {
  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
      {friends.map((friend) => (
        <FriendItem key={friend.user_id} {...friend} />
      ))}
    </div>
  );
}

export default FriendList;
