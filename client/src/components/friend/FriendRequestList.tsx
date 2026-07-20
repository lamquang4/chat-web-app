import { format } from "date-fns";
import type { FriendRequestResponse } from "../../types/types";
import UserItem from "../ui/UserItem";
import Button from "../ui/Button";

type Props = {
  friendRequests: FriendRequestResponse[];
};

function FriendRequestList({ friendRequests }: Props) {
  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
        {friendRequests.map((friendRequest) => (
          <UserItem
            avatarUrl={friendRequest.avatar_url}
            title={`${friendRequest.first_name} ${friendRequest.last_name}`}
            titleAs="h5"
            titleClassName="font-semibold"
            subtitle={format(new Date(friendRequest.created_at), "dd/MM/yyyy")}
            extra={
              <div className="flex gap-4">
                <Button className="py-1.5 w-full rounded-md font-medium bg-success text-white">
                  Xác nhận
                </Button>
                <Button className="py-1.5 w-full rounded-md font-medium bg-danger text-white">
                  Từ chối
                </Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default FriendRequestList;
