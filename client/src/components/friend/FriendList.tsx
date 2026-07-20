import { MessageCircleMore, UserRoundX } from "lucide-react";
import type { FriendResponse } from "../../types/types";
import UserItem from "../ui/UserItem";

type Props = {
  friends: FriendResponse[];
};

function FriendList({ friends }: Props) {
  return (
    <div className="max-h-[400px] overflow-y-auto">
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
                href: `/messages/${friend.conversation_id}`,
              },
              {
                label: "Hủy kết bạn",
                icon: <UserRoundX size={20} />,
                onClick: () => {},
                textColor: "text-danger",
              },
            ]}
          />
        ))}
      </div>
    </div>
  );
}

export default FriendList;
