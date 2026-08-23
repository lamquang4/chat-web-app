import { Search } from "lucide-react";
import Input from "./Input";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

function SearchInput({ value, onChange }: Props) {
  return (
    <div className="flex-1 min-w-0 w-full">
      <form className="flex items-stretch w-full overflow-hidden duration-200 bg-neutral-200 rounded-lg font-medium">
        <div className="px-2 flex items-center">
          <Search size={20} strokeWidth={1.5} />
        </div>

        <Input
          type="search"
          className="w-full pr-2 py-3 bg-transparent outline-none border-none"
          maxLength={100}
          placeholder="Tìm kiếm..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </form>
    </div>
  );
}

export default SearchInput;
