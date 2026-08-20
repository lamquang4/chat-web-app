import type { GroupMemberResponse, MemberRole } from "../types/types";

type Params = {
  members: GroupMemberResponse[];
  currentUserId: string;
};

export function useGroupPermission({ members, currentUserId }: Params) {
  const currentUserRole: MemberRole =
    members.find((m) => m.user_id === currentUserId)?.role ?? "member";

  const canEditGroupInfo =
    currentUserRole === "owner" || currentUserRole === "admin";

  const canAddMember =
    currentUserRole === "owner" || currentUserRole === "admin";

  const canDeleteGroup = currentUserRole === "owner";

  const canKickMember = (targetRole: MemberRole) => {
    if (targetRole === "owner" || targetRole === "admin") return false;
    return currentUserRole === "owner" || currentUserRole === "admin";
  };

  const canPromoteToAdmin = (targetRole: MemberRole) =>
    currentUserRole === "owner" && targetRole === "member";

  const canRemoveAdmin = (targetRole: MemberRole) =>
    currentUserRole === "owner" && targetRole === "admin";

  const canTransferOwner = (targetRole: MemberRole) =>
    currentUserRole === "owner" && targetRole !== "owner";

  return {
    currentUserRole,
    canEditGroupInfo,
    canAddMember,
    canTransferOwner,
    canDeleteGroup,
    canKickMember,
    canPromoteToAdmin,
    canRemoveAdmin,
  };
}
