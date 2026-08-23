import { Check } from "lucide-react";
import Button from "../ui/Button";
import Image from "../ui/Image";

interface Props {
  avatarUrl: string | null;
  avatarSize?: string;
  title: string;
  isOnline?: boolean;
  selected: boolean;
  onToggle: () => void;
}

function UserSelectItem({
  avatarUrl,
  avatarSize = "w-12 h-12",
  title,
  isOnline,
  selected,
  onToggle,
}: Props) {
  return (
    <Button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-3 w-full p-2 rounded-xl transition-colors text-left ${
        selected ? "bg-secondary" : "hover:bg-neutral-200"
      }`}
    >
      <div className="flex gap-3 items-center flex-1">
        <div className={`relative shrink-0 ${avatarSize}`}>
          <Image
            src={avatarUrl || "/assets/user.png"}
            alt={""}
            className="w-full h-full rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-success border-2 border-white rounded-full" />
          )}
        </div>

        <p className="font-medium truncate">{title}</p>
      </div>

      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
          selected ? "bg-info border-info" : "border-neutral-300"
        }`}
      >
        {selected && <Check size={14} className="text-white stroke-3" />}
      </div>
    </Button>
  );
}

export default UserSelectItem;
