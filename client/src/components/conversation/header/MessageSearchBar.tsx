import { memo, useState } from "react";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

function MessageSearchBar({ onClose, isOpen }: Props) {
  const [search, setSearch] = useState<string>("");

  const totalResults = 0;
  const currentIndex = 0;
  const hasResults = 0;

  return (
    <div
      className={`absolute z-20 left-0 w-full bg-white border-y border-gray-200 shadow-sm transition-all duration-300 overflow-hidden ${
        isOpen ? "opacity-100 visible top-full" : "opacity-0 invisible top-22.5"
      }`}
    >
      <div className="w-full px-3.75">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              autoFocus
              placeholder="Tìm kiếm tin nhắn..."
              maxLength={200}
              className="w-full pr-3.75 py-4 border-none outline-none font-medium"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </div>

          <span className="font-normal">
            {hasResults ? `${currentIndex}/${totalResults}` : "0/0"}
          </span>

          <div className="flex items-center gap-0.5 border-x border-gray-200 px-2">
            <Button
              disabled={!hasResults}
              className="text-neutral hover:text-primary p-1.5 rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronUp size={22} />
            </Button>

            <Button
              disabled={!hasResults}
              className="text-neutral hover:text-primary p-1.5 rounded-full hover:bg-secondary transition-colors"
            >
              <ChevronDown size={22} />
            </Button>
          </div>

          <Button
            onClick={onClose}
            className="text-neutral p-1.5 rounded-full transition-colors hover:bg-secondary"
          >
            <X size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(MessageSearchBar);
