import ModalLayout from "../ui/ModalLayout";
import CreateGroupForm from "./CreateGroupForm";

interface Props {
  onClose: () => void;
};

function CreateGroupModal({ onClose }: Props) {
  return (
    <ModalLayout title="Tạo nhóm" onClose={onClose}>
      <CreateGroupForm onClose={onClose} />
    </ModalLayout>
  );
}

export default CreateGroupModal;
