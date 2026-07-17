import { mockAccount } from "../../../mocks/mockAccount";
import DropdownMenu from "../../ui/DropdownMenu";
import { CircleUserRound, DoorOpen } from "lucide-react";
import Image from "../../ui/Image";
import { useState } from "react";

function ProfileMenu() {
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);

  const account = mockAccount;

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDropDownOpen((prev) => !prev);
  };

  const menuItems = [
    {
      label: "Tài khoản",
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
    <div
      className="relative group"
      onMouseEnter={() => setDropDownOpen(true)}
      onMouseLeave={() => setDropDownOpen(false)}
    >
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

      {dropDownOpen && <DropdownMenu items={menuItems} vertical="bottom" />}
    </div>
  );
}

export default ProfileMenu;
