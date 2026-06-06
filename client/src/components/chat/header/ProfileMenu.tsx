import { mockAccount } from "../../../mocks/mockAccount";
import DropdownMenu from "../../ui/DropdownMenu";
import { CircleUserRound, DoorOpen } from "lucide-react";
import Image from "../../ui/Image";
import { useEffect, useRef, useState } from "react";

function ProfileMenu() {
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const account = mockAccount;

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

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDropDownOpen((prev) => !prev);
  };

  const menuItems = [
    {
      label: "Thông tin tài khoản",
      icon: <CircleUserRound size={20} />,
      href: `/account/profile`,
    },
    {
      label: "Đăng xuất",
      icon: <DoorOpen size={20} />,
      onClick: () => {},
      textColor: "text-danger",
    },
  ];
  return (
    <div className="relative group" ref={containerRef}>
      <div
        className="flex cursor-pointer items-center gap-2"
        onClick={handleToggleDropdown}
      >
        <Image
          src={`${account.avatar_url ? account.avatar_url : "/assets/user.png"}`}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
          loading="eager"
        />

        <p className="font-medium">
          {account.first_name + " " + account.last_name}
        </p>
      </div>

      {dropDownOpen && <DropdownMenu items={menuItems} />}
    </div>
  );
}

export default ProfileMenu;
