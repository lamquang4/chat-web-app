import { memo, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { closeSideBar } from "../../../store/slices/uiSlice";
import Overplay from "../../ui/Overplay";
import SearchInput from "../../ui/SearchInput";
import ConversationTabs from "./ConversationTabs";
import ConversationList from "./ConversationList";
import {
  Ellipsis,
  UserRoundCheck,
  UserRoundPlus,
  UsersRound,
  X,
} from "lucide-react";
import Button from "../../ui/Button";
import DropdownMenu, { type DropdownMenuItem } from "../../ui/DropdownMenu";
import CreateGroupModal from "../../group/CreateGroupModal";
import useDebounce from "../../../hooks/useDebounce";

function SideBar() {
  const dispatch = useAppDispatch();

  const [createGroupOpen, setCreateGroupOpen] = useState<boolean>(false);
  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(search.trim(), 500);
  const activeTab = useAppSelector((state) => state.ui.activeConversationTab);
  const sideBarOpen = useAppSelector((state) => state.ui.sideBarOpen);

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

  const handleCloseCreateGroupModal = () => {
    setCreateGroupOpen(false);
  };

  const items: DropdownMenuItem[] = [
    {
      label: "Danh sách bạn bè",
      icon: <UserRoundCheck size={20} />,
      onClick: () => dispatch(closeSideBar()),
      href: "/friends",
    },
    {
      label: "Lời mời kết bạn",
      icon: <UserRoundPlus size={20} />,
      onClick: () => dispatch(closeSideBar()),
      href: "/friends/request",
    },
    {
      label: "Tạo nhóm",
      icon: <UsersRound size={20} />,
      onClick: () => {
        dispatch(closeSideBar());
        setDropDownOpen(false);
        setCreateGroupOpen(true);
      },
    },
  ];

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-full w-full max-w-[380px] bg-white border-r border-border transition-all duration-300 ease-in-out z-50 flex flex-col ${sideBarOpen ? "translate-x-0" : "-translate-x-full"} lg:sticky lg:translate-x-0 lg:z-auto`}
      >
        <div className="flex flex-col min-h-0 gap-6 px-[15px] py-4 flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-bold">Đoạn chat</h3>

            <div className="flex gap-2 items-center">
              <div className="relative" ref={containerRef}>
                <Button
                  className="bg-muted w-8.5 h-8.5 rounded-lg justify-center items-center flex"
                  onClick={handleToggleDropdown}
                >
                  <Ellipsis size={18} />
                </Button>

                {dropDownOpen && (
                  <DropdownMenu
                    items={items}
                    horizontal="right"
                    vertical="bottom"
                  />
                )}
              </div>

              <Button
                className="lg:hidden bg-muted w-8.5 h-8.5 rounded-lg justify-center items-center flex"
                onClick={() => dispatch(closeSideBar())}
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          <SearchInput value={search} onChange={setSearch} />
          <ConversationTabs />
          <ConversationList type={activeTab} q={debouncedSearch} />
        </div>
      </aside>

      {sideBarOpen && (
        <Overplay
          onClose={() => dispatch(closeSideBar())}
          className="lg:hidden"
        />
      )}

      {createGroupOpen && (
        <CreateGroupModal onClose={handleCloseCreateGroupModal} />
      )}
    </>
  );
}

export default memo(SideBar);
