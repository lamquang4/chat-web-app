import type { FriendResponse } from "../../types/types";
import Button from "../ui/Button";
import Image from "../ui/Image";

type Props = {
  friend: FriendResponse;
  selected: boolean;
  onToggle: () => void;
};

function FriendSelectItem({ friend, selected, onToggle }: Props) {
  return (
    <Button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-3 w-full p-2 rounded-xl transition-colors text-left ${
        selected ? "bg-secondary" : "hover:bg-gray-100"
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={friend.avatar_url ?? "/assets/user.png"}
            alt={friend.first_name}
            className="w-full h-full object-cover"
          />
        </div>
        {friend.is_online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-white rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">
          {friend.first_name} {friend.last_name}
        </p>
      </div>

      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          selected ? "bg-info border-info" : "border-gray-300"
        }`}
      >
        {selected && (
          <svg viewBox="0 0 10 8" fill="none" className="w-3 h-3">
            <path
              d="M1 4l2.5 2.5L9 1"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </Button>
  );
}

export default FriendSelectItem;
