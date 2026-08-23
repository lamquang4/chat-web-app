import { Phone, Video } from "lucide-react";
import Button from "../../ui/Button";
import Image from "../../ui/Image";
import { useState } from "react";
import type { ConversationType } from "../../../types/types";
import EditGroupModal from "../../group/EditGroupModal";

interface Props {
  avatar_url: string | null;
  conversationId: string;
  is_online: boolean;
  type: ConversationType;
  name: string;
}

function ConversationHeader({
  avatar_url,
  conversationId,
  is_online,
  type,
  name,
}: Props) {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => {
    if (type === "private") return;
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <div className="flex relative justify-between items-center px-[15px] py-4 border-b border-neutral-300 w-full">
        <div
          className={`flex gap-2 items-center ${type === "group" && "cursor-pointer"}`}
          onClick={handleOpenModal}
        >
          <div className="relative flex shrink-0">
            <Image
              src={
                avatar_url ??
                (type === "group" ? "/assets/group.png" : "/assets/user.png")
              }
              alt={name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {is_online && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-success border-2 border-white rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h5 className={`font-semibold`}>{name}</h5>

            <span
              className={`font-medium ${is_online ? "text-success" : "text-neutral"}`}
            >
              {is_online ? "Đang hoạt động" : "Đang ngoại tuyến"}
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

      {openModal && type === "group" && (
        <EditGroupModal
          onClose={handleCloseModal}
          conversationId={conversationId}
          name={name}
          avatar_url={avatar_url}
        />
      )}
    </>
  );
}

export default ConversationHeader;
