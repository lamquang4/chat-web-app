import type { FriendRequestResponse } from "../../../types/types";
import FriendRequestItem from "./FriendRequestItem";

type Props = {
  friendRequests: FriendRequestResponse[];
};

function FriendRequestList({ friendRequests }: Props) {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
        {friendRequests.map((friendRequest) => (
          <FriendRequestItem
            key={friendRequest.requester_id}
            {...friendRequest}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendRequestList;
