import { Ellipsis } from "lucide-react";
import Button from "./Button";
import Image from "./Image";
import { useEffect, useRef, useState } from "react";
import DropdownMenu, { type DropdownMenuItem } from "./DropdownMenu";

type TitleTag = "h3" | "h4" | "h5" | "h6" | "p" | "span";

interface Props {
  avatarUrl: string | null;
  avatarSize?: string;
  title: string;
  titleAs?: TitleTag;
  titleClassName?: string;
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
  isOnline?: boolean;
  dropdownItems?: DropdownMenuItem[];
  extra?: React.ReactNode;
}

function UserItem({
  avatarUrl,
  avatarSize = "w-12 h-12",
  title,
  titleAs: TitleTag = "p",
  titleClassName = "font-medium",
  subtitle,
  subtitleClassName = "text-neutral font-medium",
  isOnline,
  dropdownItems,
  extra,
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

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDropDownOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-6 border border-gray-200 py-2 px-2 rounded-lg hover:bg-gray-200/70 w-full">
      <div className="flex justify-between items-center gap-3">
        <div className="flex gap-3 items-center flex-1 min-w-0">
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

          <div className="min-w-0">
            <TitleTag className={`truncate ${titleClassName}`}>
              {title}
            </TitleTag>
            {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
          </div>
        </div>

        {dropdownItems && dropdownItems.length > 0 && (
          <div className="relative shrink-0" ref={containerRef}>
            <Button
              type="button"
              className="w-7 h-7 p-1 flex justify-center items-center text-neutral"
              onClick={handleToggleDropdown}
            >
              <Ellipsis size={20} />
            </Button>

            {dropDownOpen && <DropdownMenu items={dropdownItems} />}
          </div>
        )}
      </div>

      {extra && extra}
    </div>
  );
}

export default UserItem;
