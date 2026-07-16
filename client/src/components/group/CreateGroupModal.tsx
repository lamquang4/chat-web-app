import { X } from "lucide-react";
import CreateGroupForm from "./CreateGroupForm";
import Overplay from "../ui/Overplay";
import Button from "../ui/Button";

type Props = {
  onClose: () => void;
};

function CreateGroupModal({ onClose }: Props) {
  return (
    <>
      <Overplay onClose={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto relative bg-white sm:rounded-lg w-full max-w-[480px] flex flex-col sm:max-h-[90vh] max-h-screen px-[15px]">
          <div className="flex items-center justify-between py-4 border-b border-gray-100 shrink-0">
            <h4>Tạo nhóm chat</h4>
            <Button onClick={onClose}>
              <X size={24} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 min-h-0 custom-scroll">
            <CreateGroupForm onClose={onClose} />
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateGroupModal;
