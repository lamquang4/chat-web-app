import { Check, CheckCheck } from "lucide-react";
import type { MessageSeenResponse } from "../../../types/types";
import Image from "../../ui/Image";
import Tooltip from "../../ui/Tooltip";

interface Props {
  is_seen: boolean;
  seen_by?: MessageSeenResponse[];
};

function SeenIndicator({ is_seen, seen_by }: Props) {
  if (is_seen && seen_by && seen_by.length > 0) {
    return (
      <div className="flex items-center gap-1">
        {seen_by.slice(0, 3).map((u) => (
          <div className="relative group/tooltip" key={u.user_id}>
            <Image
              key={u.user_id}
              src={u.avatar_url ?? "/assets/user.png"}
              alt={`${u.first_name} ${u.last_name}`}
              className="w-4 h-4 rounded-full object-cover border border-white"
            />

            <Tooltip text={`${u.first_name} ${u.last_name}`} />
          </div>
        ))}
      </div>
    );
  }
  if (is_seen) return <CheckCheck size={13} className="text-primary" />;
  return <Check size={13} className="text-gray-400" />;
}

export default SeenIndicator;
