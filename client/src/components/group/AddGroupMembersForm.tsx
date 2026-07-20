import { X } from "lucide-react";
import { useState } from "react";
import { mockFriendList } from "../../mocks/mockFriendList";
import type { FriendResponse } from "../../types/types";
import Image from "../ui/Image";
import Button from "../ui/Button";
import SearchInput from "../ui/SearchInput";
import UserSelectItem from "../ui/UserSelectItem";

type Props = {
  onClose: () => void;
  conversationId: string;
};

function AddGroupMembersForm({ onClose, conversationId }: Props) {
  const [selected, setSelected] = useState<FriendResponse[]>([]);

  const friends = mockFriendList;

  const isSelected = (userId: string) =>
    selected.some((s) => s.user_id === userId);

  const toggleSelect = (friend: FriendResponse) => {
    setSelected((prev) =>
      isSelected(friend.user_id)
        ? prev.filter((s) => s.user_id !== friend.user_id)
        : [...prev, friend],
    );
  };

  const removeSelected = (userId: string) => {
    setSelected((prev) => prev.filter((s) => s.user_id !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(conversationId);

    onClose();
  };
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto custom-scroll">
        <div className="flex flex-col gap-4">
          {selected.length > 0 && (
            <div className="flex flex-col gap-2">
              <p>Đã chọn ({selected.length})</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selected.map((f) => (
                  <div
                    key={f.user_id}
                    className="flex items-center gap-2 bg-gray-100 rounded-md p-2 shrink-0"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={f.avatar_url ?? "/assets/user.png"}
                        alt={f.first_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{f.last_name}</span>

                    <Button onClick={() => removeSelected(f.user_id)}>
                      <X size={16} strokeWidth={2.5} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <SearchInput />

            <div className="max-h-[280px] overflow-y-auto custom-scroll">
              {friends.length === 0 ? (
                <p className="text-center py-2 text-neutral">
                  Không tìm thấy kết quả
                </p>
              ) : (
                friends.map((friend) => (
                  <UserSelectItem
                    key={friend.user_id}
                    avatarUrl={friend.avatar_url}
                    avatarSize="w-10 h-10"
                    title={`${friend.first_name} ${friend.last_name}`}
                    isOnline={friend.is_online}
                    selected={isSelected(friend.user_id)}
                    onToggle={() => toggleSelect(friend)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center pt-4">
        <Button
          onClick={handleSubmit}
          className="px-2 py-2.5 font-medium rounded-lg bg-success text-white"
        >
          Thêm vào nhóm
        </Button>
      </div>
    </div>
  );
}

export default AddGroupMembersForm;
