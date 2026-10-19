import Modal from "../ui/Modal";
import CreateGroupForm from "./CreateGroupForm";

interface Props {
  onClose: () => void;
}

function CreateGroupModal({ onClose }: Props) {
  return (
    <Modal title="Tạo nhóm" onClose={onClose}>
      <CreateGroupForm onClose={onClose} />
    </Modal>
  );
}

export default CreateGroupModal;
