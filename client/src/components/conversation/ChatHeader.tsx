import { Phone, Video } from "lucide-react";
import Button from "../ui/Button";
import Image from "../ui/Image";

type Props = {
  avatar_url?: string;
  is_online: boolean;
  name: string;
};

function ChatHeader({ avatar_url, is_online, name }: Props) {
  return (
    <div className="flex justify-between items-center px-[15px] py-4 border-b border-gray-200 w-full">
      <div className="flex gap-2 items-center">
        <Image
          src={avatar_url ? avatar_url : "/assets/user.png"}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1 min-w-0">
          <h5 className={`truncate font-semibold`}>{name}</h5>

          <span className={`${is_online ? "text-success" : "text-neutral"}`}>
            {is_online ? "Đang online" : "Đang offline"}
          </span>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Button className="text-primary">
          <Phone size={22} />
        </Button>

        <Button className="text-primary">
          <Video size={22} />
        </Button>
      </div>
    </div>
  );
}

export default ChatHeader;
