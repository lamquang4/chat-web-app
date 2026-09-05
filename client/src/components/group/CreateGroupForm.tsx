import { Camera, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FriendResponse } from "../../types/types";
import Image from "../ui/Image";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import SearchInput from "../ui/SearchInput";
import UserSelectItem from "../ui/UserSelectItem";
import {
  createGroupSchema,
  type CreateGroupData,
} from "../../schemas/conversationSchema";
import { MAX_GROUP_NAME_LENGTH } from "../../constants/limit";
import toast from "react-hot-toast";
import { useGetFriendList } from "../../hooks/queries/useFriends";
import { useCreateGroup } from "../../hooks/queries/useConversations";
import useDebounce from "../../hooks/useDebounce";
import Loading from "../ui/Loading";
interface Props {
  onClose: () => void;
}

function CreateGroupForm({ onClose }: Props) {
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search.trim(), 500);

  const { register, trigger, handleSubmit, watch, setValue } =
    useForm<CreateGroupData>({
      resolver: zodResolver(createGroupSchema),
      defaultValues: { name: "", member_ids: [], avatar: undefined },
    });

  const { data: friends, isLoading } = useGetFriendList(debouncedSearch);
  const createGroup = useCreateGroup();
  const isLoadingCreateGroup = createGroup.isPending;

  const avatarFile = watch("avatar");
  const memberIds = watch("member_ids") ?? [];

  const selected = friends?.content.filter((f) =>
    memberIds.includes(f.user_id),
  );

  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : "";

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const isSelected = (userId: string) => memberIds.includes(userId);

  const toggleSelect = (friend: FriendResponse) => {
    setValue(
      "member_ids",
      isSelected(friend.user_id)
        ? memberIds.filter((id) => id !== friend.user_id)
        : [...memberIds, friend.user_id],
      { shouldValidate: true },
    );
  };

  const removeSelected = (userId: string) => {
    setValue(
      "member_ids",
      memberIds.filter((id) => id !== userId),
      { shouldValidate: true },
    );
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("avatar", file);
    const isValid = await trigger("avatar");

    if (!isValid) {
      setValue("avatar", undefined);
      e.target.value = "";
      return;
    }
  };

  const onSubmit = (data: CreateGroupData) => {
    if (isLoadingCreateGroup) {
      return;
    }

    createGroup.mutate(data, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onError = (formErrors: FieldErrors<CreateGroupData>) => {
    const firstError = Object.values(formErrors)[0];
    const message = firstError.message as string;
    toast.error(message);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col flex-1 min-h-0"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4 w-full">
            <Label className="relative w-25 h-25 rounded-full bg-bg flex items-center justify-center shrink-0 overflow-hidden group cursor-pointer">
              <Image
                src={avatarPreview || "/assets/group.png"}
                alt="Ảnh nhóm"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </Label>

            <div className="space-y-[8px] w-full">
              <Label required>Tên nhóm</Label>
              <Input
                type="text"
                {...register("name")}
                placeholder="Nhập tên nhóm..."
                maxLength={MAX_GROUP_NAME_LENGTH}
                className="w-full font-medium bg-transparent border-b border-border focus:border-primary py-2 transition-colors"
              />
            </div>
          </div>

          {selected && selected?.length > 0 && (
            <div className="flex flex-col gap-2">
              <p>Đã chọn ({selected?.length})</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {selected?.map((f) => (
                  <div
                    key={f.user_id}
                    className="flex items-center gap-2 bg-bg rounded-md p-2 shrink-0"
                  >
                    <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={f.avatar_url ?? "/assets/user.png"}
                        alt={f.first_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium">{f.last_name}</span>

                    <Button onClick={() => removeSelected(f.user_id)}>
                      <X size={16} strokeWidth={2.5} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <SearchInput value={search} onChange={setSearch} />

            <div
              className={`overflow-y-auto ${isLoading ? "flex justify-center items-center h-[220px]" : "max-h-[220px]"}`}
            >
              {isLoading ? (
                <Loading size={45} color="black" thickness={2} height={0} />
              ) : friends?.content.length === 0 ? (
                <p className="text-center py-2 text-text-muted">
                  Không tìm thấy kết quả
                </p>
              ) : (
                friends?.content.map((friend) => (
                  <UserSelectItem
                    key={friend.user_id}
                    avatarUrl={friend.avatar_url}
                    avatarSize="w-10 h-10"
                    title={`${friend.first_name} ${friend.last_name}`}
                    isOnline={friend.is_online}
                    selected={isSelected(friend.user_id)}
                    onToggle={() => toggleSelect(friend)}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center pt-4">
        <Button
          disabled={isLoadingCreateGroup}
          type="submit"
          className="px-2 py-2.5 font-medium rounded-lg bg-success text-white"
        >
          Tạo nhóm
        </Button>
      </div>
    </form>
  );
}

export default CreateGroupForm;
