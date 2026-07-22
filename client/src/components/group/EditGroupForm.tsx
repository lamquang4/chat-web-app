import {
  Camera,
  MessageCircleMore,
  UserRoundCog,
  UserRoundKey,
  UserRoundPlus,
  UserRoundX,
  UserRoundMinus,
} from "lucide-react";
import { useState } from "react";
import Image from "../ui/Image";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";
import { mockConversationMembersGroup } from "../../mocks/mockConversationMembersGroup";
import UserItem from "../ui/UserItem";
import { mockAccount } from "../../mocks/mockAccount";
import { useGroupPermission } from "../../hooks/useGroupPermission";
import Swal from "sweetalert2";
import { MEMBER_ROLE_LABEL } from "../../constants/memberRole";

interface Props {
  onClose: () => void;
  onOpenAddMembers: () => void;
  conversationId: string;
  name: string;
  avatar_url?: string;
}

function EditGroupForm({
  onClose,
  onOpenAddMembers,
  conversationId,
  name,
  avatar_url,
}: Props) {
  const [groupName, setGroupName] = useState(name);
  const [avatarPreview, setAvatarPreview] = useState(
    avatar_url ?? "/assets/group.png",
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const memberList = mockConversationMembersGroup;

  const {
    currentUserRole,
    canEditGroupInfo,
    canKickMember,
    canPromoteToAdmin,
    canRemoveAdmin,
    canDeleteGroup,
    canTransferOwner,
  } = useGroupPermission({
    members: memberList.members,
    currentUserId: mockAccount.user_id,
  });

  const handleDeleteGroup = async () => {
    if (!canDeleteGroup) return;

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
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canEditGroupInfo) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEditGroupInfo) return;

    if (conversationId !== memberList.conversation_id) {
      return;
    }

    console.log(avatarFile);
    onClose();
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto custom-scroll">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-4 w-full">
            <Label
              className={`relative w-25 h-25 rounded-full bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden transition-colors group ${
                canEditGroupInfo
                  ? "hover:bg-gray-200 cursor-pointer"
                  : "cursor-default"
              }`}
            >
              <Image
                src={avatarPreview || "/assets/group.png"}
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
              <Label>Tên nhóm</Label>
              <Input
                type="text"
                value={groupName}
                onChange={(e) =>
                  canEditGroupInfo && setGroupName(e.target.value)
                }
                placeholder="Nhập tên nhóm..."
                maxLength={50}
                readOnly={!canEditGroupInfo}
                className={`w-full font-medium bg-transparent border-b border-gray-200 py-2 transition-colors ${
                  canEditGroupInfo
                    ? "focus:border-primary"
                    : "cursor-default text-neutral"
                }`}
              />
            </div>
          </div>

          <div className="max-h-[280px] overflow-y-auto custom-scroll space-y-2">
            <div className="space-y-1">
              {memberList.members.map((member) => {
                const isMe = member.user_id === mockAccount.user_id;

                const dropdownItems = isMe
                  ? undefined
                  : [
                      {
                        label: "Nhắn tin",
                        icon: <MessageCircleMore size={20} />,
                        href: `/messages/${member.user_id}`,
                        onClick: onClose,
                      },
                      ...(canPromoteToAdmin(member.role)
                        ? [
                            {
                              label: "Đặt làm quản trị viên",
                              icon: <UserRoundCog size={20} />,
                              onClick: () => {},
                            },
                          ]
                        : []),
                      ...(canTransferOwner(member.role)
                        ? [
                            {
                              label: "Chuyển quyền sở hữu",
                              icon: <UserRoundKey size={20} />,
                              onClick: () => {},
                            },
                          ]
                        : []),
                      ...(canRemoveAdmin(member.role)
                        ? [
                            {
                              label: "Gỡ quyền quản trị",
                              icon: <UserRoundMinus size={20} />,
                              onClick: () => {},
                            },
                          ]
                        : []),
                      ...(canKickMember(member.role)
                        ? [
                            {
                              label: "Xóa khỏi nhóm",
                              icon: <UserRoundX size={20} />,
                              onClick: () => {},
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
                  className="text-success font-semibold px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span>Thêm người</span>
                    <UserRoundPlus size={20} />
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {canEditGroupInfo && (
        <div className="flex items-center gap-4 justify-center pt-4">
          <Button
            onClick={handleSubmit}
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
    </div>
  );
}

export default EditGroupForm;
