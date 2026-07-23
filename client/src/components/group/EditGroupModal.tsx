import { useState } from "react";
import ModalLayout from "../ui/ModalLayout";
import EditGroupForm from "./EditGroupForm";
import AddGroupMembersForm from "./AddGroupMembersForm";

interface Props {
  onClose: () => void;
  conversationId: string;
  name: string;
  avatar_url: string | null;
}

function EditGroupModal({ onClose, conversationId, name, avatar_url }: Props) {
  const [showAddMembers, setShowAddMembers] = useState<boolean>(false);

  const openAddMembers = () => setShowAddMembers(true);
  const backToEdit = () => setShowAddMembers(false);

  return (
    <ModalLayout
      title={showAddMembers ? "Thêm thành viên" : `Nhóm ${name}`}
      onClose={showAddMembers ? backToEdit : onClose}
    >
      {showAddMembers ? (
        <AddGroupMembersForm
          conversationId={conversationId}
          onClose={backToEdit}
        />
      ) : (
        <EditGroupForm
          conversationId={conversationId}
          onClose={onClose}
          onOpenAddMembers={openAddMembers}
          name={name}
          avatar_url={avatar_url}
        />
      )}
    </ModalLayout>
  );
}

export default EditGroupModal;
