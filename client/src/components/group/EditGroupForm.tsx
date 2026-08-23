import {
  Camera,
  MessageCircleMore,
  UserRoundCog,
  UserRoundKey,
  UserRoundPlus,
  UserRoundX,
  UserRoundMinus,
} from "lucide-react";
import { useEffect } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "../ui/Image";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import UserItem from "../ui/UserItem";
import { useGroupPermission } from "../../hooks/useGroupPermission";
import Swal from "sweetalert2";
import { MEMBER_ROLE_LABEL } from "../../constants/memberRole";
import toast from "react-hot-toast";
import {
  updateGroupSchema,
  type UpdateGroupData,
} from "../../schemas/conversationSchema";
import { MAX_GROUP_NAME_LENGTH } from "../../constants/limit";
import {
  useDeleteGroup,
  useDemoteAdmin,
  useGetGroupMembers,
  useGetOrCreatePrivateConversation,
  usePromoteToAdmin,
  useRemoveGroupMember,
  useTransferOwnership,
  useUpdateGroup,
} from "../../hooks/queries/useConversations";
import { useGetAccount } from "../../hooks/queries/useUsers";
import { useNavigate } from "react-router-dom";
interface Props {
  onClose: () => void;
  onOpenAddMembers: () => void;
  conversationId: string;
  name: string;
  avatar_url: string | null;
}

function EditGroupForm({
  onClose,
  onOpenAddMembers,
  conversationId,
  name,
  avatar_url,
}: Props) {
  const navigate = useNavigate();

  const updateGroup = useUpdateGroup(conversationId);
  const isLoadingUpdateGroup = updateGroup.isPending;

  const deleteGroup = useDeleteGroup(conversationId);
  const isLoadingDeleteGroup = deleteGroup.isPending;

  const removeGroupMember = useRemoveGroupMember(conversationId);
  const isLoadingRemoveGroupMember = removeGroupMember.isPending;

  const promoteToAdmin = usePromoteToAdmin(conversationId);
  const isLoadingPromoteToAdmin = promoteToAdmin.isPending;

  const demoteAdmin = useDemoteAdmin(conversationId);
  const isLoadingDemoteAdmin = demoteAdmin.isPending;

  const transferOwnership = useTransferOwnership(conversationId);
  const isLoadingTransferOwnership = transferOwnership.isPending;

  const getOrCreatePrivateConversation = useGetOrCreatePrivateConversation();
  const isLoadingGetOrCreatePrivateConversation =
    getOrCreatePrivateConversation.isPending;

  const { data: members } = useGetGroupMembers(conversationId);
  const { data: account } = useGetAccount();

  const { register, trigger, handleSubmit, watch, setValue } =
    useForm<UpdateGroupData>({
      resolver: zodResolver(updateGroupSchema),
      values: {
        name: name || "",
        avatar: undefined,
      },
    });

  const {
    currentUserRole,
    canEditGroupInfo,
    canKickMember,
    canPromoteToAdmin,
    canRemoveAdmin,
    canDeleteGroup,
    canTransferOwner,
  } = useGroupPermission({
    members: members || [],
    currentUserId: account?.user_id || "",
  });

  const avatarFile = watch("avatar");
  const avatarPreview = avatarFile
    ? URL.createObjectURL(avatarFile)
    : (avatar_url ?? "/assets/group.png");

  useEffect(() => {
    return () => {
      if (avatarFile) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarFile, avatarPreview]);

  const handleMessage = (userId: string) => {
    if (isLoadingGetOrCreatePrivateConversation) {
      return;
    }

    getOrCreatePrivateConversation.mutate(userId, {
      onSuccess: (res) => {
        const conversationId = res.data.conversation_id;

        navigate(`/messages/${conversationId}`);

        onClose();
      },
    });
  };

  const handleDeleteGroup = async () => {
    if (!canDeleteGroup || isLoadingDeleteGroup) return;

    const result = await Swal.fire({
      title: "Giải tán nhóm?",
      text: "Bạn có chắc chắn muốn giải tán nhóm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#076ffe",
      cancelButtonColor: "#d9534f",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    deleteGroup.mutate();
    onClose();
    navigate("/messages");
  };

  const handleRemoveGroupMember = async (userId: string) => {
    if (isLoadingRemoveGroupMember) return;

    const result = await Swal.fire({
      title: "Xóa thành viên?",
      text: "Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#076ffe",
      cancelButtonColor: "#d9534f",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    removeGroupMember.mutate(userId);
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (isLoadingPromoteToAdmin) return;

    promoteToAdmin.mutate(userId);
  };

  const handleDemoteAdmin = async (userId: string) => {
    if (isLoadingDemoteAdmin) return;

    demoteAdmin.mutate(userId);
  };

  const handleTransferOwnership = async (userId: string) => {
    if (isLoadingTransferOwnership) return;

    const result = await Swal.fire({
      title: "Chuyển quyền sở hữu?",
      text: "Sau khi chuyển, bạn sẽ không còn là trưởng nhóm.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#076ffe",
      cancelButtonColor: "#d9534f",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    transferOwnership.mutate(userId);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValue("avatar", file);
    const isValid = await trigger("avatar");

    if (!isValid) {
      setValue("avatar", undefined);
      return;
    }
  };

  const onSubmit = (data: UpdateGroupData) => {
    if (!canEditGroupInfo || !conversationId || isLoadingUpdateGroup) return;

    updateGroup.mutate(data);
  };

  const onError = (formErrors: FieldErrors<UpdateGroupData>) => {
    const firstError = Object.values(formErrors)[0];
    const message = firstError?.message as string;
    if (message) toast.error(message);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="flex flex-col flex-1 min-h-0"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4 w-full">
            <Label
              className={`relative w-25 h-25 rounded-full bg-gray-200/70 flex items-center justify-center shrink-0 overflow-hidden transition-colors group ${
                canEditGroupInfo
                  ? "hover:bg-gray-200 cursor-pointer"
                  : "cursor-default"
              }`}
            >
              <Image
                src={avatarPreview || avatar_url || "/assets/group.png"}
                alt="Ảnh nhóm"
                className="w-full h-full object-cover"
              />
              {canEditGroupInfo && (
                <>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-full transition-opacity flex items-center justify-center">
                    <Camera size={24} className="text-white" />
                  </div>

                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                    disabled={!canEditGroupInfo}
                  />
                </>
              )}
            </Label>

            <div className="space-y-[8px] w-full">
              <Label required>Tên nhóm</Label>
              <Input
                type="text"
                {...register("name")}
                maxLength={MAX_GROUP_NAME_LENGTH}
                placeholder="Nhập tên nhóm..."
                readOnly={!canEditGroupInfo}
                className={`w-full font-medium bg-transparent border-b border-gray-200 py-2 transition-colors ${
                  canEditGroupInfo
                    ? "focus:border-primary"
                    : "cursor-default text-neutral"
                }`}
              />
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto space-y-2">
            <div className="space-y-1">
              {members?.map((member) => {
                const isMe = member.user_id === account?.user_id;

                const dropdownItems = isMe
                  ? undefined
                  : [
                      {
                        label: "Nhắn tin",
                        icon: <MessageCircleMore size={20} />,

                        onClick: () => handleMessage(member.user_id),
                      },

                      ...(canPromoteToAdmin(member.role)
                        ? [
                            {
                              label: "Đặt làm quản trị viên",
                              icon: <UserRoundCog size={20} />,
                              onClick: () =>
                                handlePromoteToAdmin(member.user_id),
                            },
                          ]
                        : []),

                      ...(canTransferOwner(member.role)
                        ? [
                            {
                              label: "Chuyển quyền sở hữu",
                              icon: <UserRoundKey size={20} />,
                              onClick: () =>
                                handleTransferOwnership(member.user_id),
                            },
                          ]
                        : []),

                      ...(canRemoveAdmin(member.role)
                        ? [
                            {
                              label: "Gỡ quyền quản trị",
                              icon: <UserRoundMinus size={20} />,
                              onClick: () => handleDemoteAdmin(member.user_id),
                            },
                          ]
                        : []),

                      ...(canKickMember(member.role)
                        ? [
                            {
                              label: "Xóa khỏi nhóm",
                              icon: <UserRoundX size={20} />,
                              onClick: () =>
                                handleRemoveGroupMember(member.user_id),
                              textColor: "text-danger",
                            },
                          ]
                        : []),
                    ];

                return (
                  <UserItem
                    key={member.user_id}
                    avatarUrl={member.avatar_url}
                    avatarSize="w-10 h-10"
                    title={`${member.first_name} ${member.last_name}`}
                    subtitle={MEMBER_ROLE_LABEL[member.role]}
                    dropdownItems={dropdownItems}
                  />
                );
              })}
            </div>

            {canEditGroupInfo && (
              <div className="flex justify-center">
                <Button
                  onClick={onOpenAddMembers}
                  type="button"
                  className="text-success flex items-center gap-2 font-semibold px-3 py-2"
                >
                  <span>Thêm người</span>
                  <UserRoundPlus size={20} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {canEditGroupInfo && (
        <div className="flex items-center gap-4 justify-center pt-4">
          <Button
            disabled={isLoadingUpdateGroup}
            type="submit"
            className="px-2 py-2.5 font-medium rounded-lg bg-info text-white"
          >
            Cập nhật
          </Button>

          {currentUserRole === "owner" && (
            <Button
              type="button"
              onClick={handleDeleteGroup}
              className="px-2 py-2.5 font-medium rounded-lg bg-danger text-white"
            >
              Giải tán nhóm
            </Button>
          )}
        </div>
      )}
    </form>
  );
}

export default EditGroupForm;
