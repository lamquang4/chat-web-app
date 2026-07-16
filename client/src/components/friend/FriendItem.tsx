import { Ellipsis, MessageCircleMore, UserRoundX } from "lucide-react";
import type { FriendResponse } from "../../types/types";
import Button from "../ui/Button";
import Image from "../ui/Image";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import DropdownMenu from "../ui/DropdownMenu";

type Props = FriendResponse;

function FriendItem({
  conversation_id,
  first_name,
  last_name,
  avatar_url,
  is_online,
  updated_at,
}: Props) {
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dropDownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropDownOpen]);

  const menuItems = [
    {
      label: "Nhắn tin",
      icon: <MessageCircleMore size={20} />,
      href: `/chat/${conversation_id}`,
    },
    {
      label: "Hủy kết bạn",
      icon: <UserRoundX size={20} />,
      onClick: () => {},
      textColor: "text-danger",
    },
  ];

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDropDownOpen((prev) => !prev);
  };
  return (
    <div
      className={`flex justify-between items-center shadow-sm border border-gray-200 gap-3 py-2 px-2 rounded-lg hover:bg-gray-100 w-full`}
    >
      <div className="flex gap-3 items-center">
        <div className="relative flex shrink-0">
          <Image
            src={avatar_url ? avatar_url : "/assets/user.png"}
            alt={""}
            className="w-14 h-14 rounded-full object-cover"
          />
          {is_online && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-success border-2 border-white rounded-full" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h5 className={`truncate font-semibold`}>
            {first_name + " " + last_name}
          </h5>

          <p className="text-neutral">
            {format(new Date(updated_at), "dd/MM/yyyy")}
          </p>
        </div>
      </div>

      <div className="relative" ref={containerRef}>
        <Button
          className="w-7.5 h-7.5 p-1 flex justify-center items-center rounded-sm"
          onClick={handleToggleDropdown}
        >
          <Ellipsis size={20} />
        </Button>

        {dropDownOpen && <DropdownMenu items={menuItems} />}
      </div>
    </div>
  );
}

export default FriendItem;
