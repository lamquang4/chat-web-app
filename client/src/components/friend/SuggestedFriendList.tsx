import UserItem from "../ui/UserItem";
import Button from "../ui/Button";
import type { SuggestedFriendResponse } from "../../types/types";

interface Props {
  friendSuggests: SuggestedFriendResponse[];
}

function SuggestedFriendList({ friendSuggests }: Props) {
  return (
    <div className="max-h-[400px] overflow-y-auto">
      <div className="grid lg:grid-cols-2 grid-cols-1 gap-2">
        {friendSuggests.map((friendSuggest) => (
          <UserItem
            avatarUrl={friendSuggest.avatar_url}
            title={`${friendSuggest.first_name} ${friendSuggest.last_name}`}
            titleAs="h5"
            titleClassName="font-semibold"
            extra={
              <div className="flex gap-4">
                <Button className="py-1.5 w-full rounded-md font-medium bg-success text-white">
                  Thêm bạn bè
                </Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default SuggestedFriendList;
