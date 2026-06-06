import type { FriendRequestResponse } from "../../../types/types";
import Button from "../../ui/Button";
import Image from "../../ui/Image";
import { format } from "date-fns";

type Props = FriendRequestResponse;

function FriendRequestItem({
  first_name,
  last_name,
  avatar_url,
  created_at,
}: Props) {
  return (
    <div
      className={`space-y-6 shadow-sm border border-gray-200 gap-3 py-2 px-2 rounded-lg hover:bg-gray-100 w-full`}
    >
      <div className="flex gap-3 items-center">
        <div className="relative flex shrink-0">
          <Image
            src={avatar_url ? avatar_url : "/assets/user.png"}
            alt={""}
            className="w-14 h-14 rounded-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h5 className={`truncate font-semibold`}>
            {first_name + " " + last_name}
          </h5>

          <p className="text-neutral">
            {format(new Date(created_at), "dd/MM/yyyy")}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button className="py-1.5 w-full rounded-md font-medium bg-success text-white">
          Xác nhận
        </Button>

        <Button className="py-1.5 w-full rounded-md font-medium bg-danger text-white">
          Từ chối
        </Button>
      </div>
    </div>
  );
}

export default FriendRequestItem;
