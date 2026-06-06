import { Search } from "lucide-react";
import Input from "./Input";
import { useState } from "react";

function SearchInput() {
  const [search, setSearch] = useState<string>("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSearch("");
  };

  return (
    <div className="flex-1 min-w-0 w-full">
      <form
        onSubmit={handleSearch}
        className="flex items-stretch w-full overflow-hidden duration-200 bg-gray-100 rounded-lg font-medium"
      >
        <div className="px-2 flex items-center">
          <Search size={20} />
        </div>

        <Input
          type="text"
          className="w-full pr-2 py-3 text-[0.9rem] bg-transparent outline-none border-none"
          required
          maxLength={100}
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>
    </div>
  );
}

export default SearchInput;
