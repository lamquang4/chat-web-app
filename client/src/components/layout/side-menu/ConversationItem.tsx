import { Link } from "react-router-dom";
import type { ConversationListResponse } from "../../../types/types";
import Image from "../../ui/Image";
import { useAppDispatch } from "../../../redux/store";
import { closeSideMenu } from "../../../redux/slices/uiSlice";

interface Props {
  conversation: ConversationListResponse;
}

function ConversationItem({ conversation }: Props) {
  const dispatch = useAppDispatch();

  const {
    conversation_id,
    avatar_url,
    type,
    name,
    last_message,
    is_online,
    is_last_message_seen,
    is_last_message_me,
  } = conversation;
  return (
    <Link
      to={`/messages/${conversation_id}`}
      className="block w-full"
      onClick={() => dispatch(closeSideMenu())}
    >
      <div
        className={`flex items-center gap-3 py-2 px-2 cursor-pointer rounded-lg hover:bg-gray-100 w-full`}
      >
        <div className="relative flex shrink-0">
          <Image
            src={
              avatar_url ??
              (type === "group" ? "/assets/group.png" : "/assets/user.png")
            }
            alt={name}
            className="w-12 h-12 rounded-full object-contain"
          />
          {is_online && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-success border-2 border-white rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h5 className={`font-semibold`}>{name}</h5>

          <p
            className={`truncate text-neutral ${is_last_message_seen ? "font-semibold" : "font-medium"}`}
          >
            {last_message
              ? is_last_message_me
                ? `Bạn: ${last_message}`
                : last_message
              : "Hãy gửi lời chào đến bạn của bạn"}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          {!is_last_message_me && !is_last_message_seen && (
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ConversationItem;
