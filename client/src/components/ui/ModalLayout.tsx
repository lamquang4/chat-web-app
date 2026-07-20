import { X } from "lucide-react";
import type { ReactNode } from "react";
import Overplay from "./Overplay";
import Button from "./Button";

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidth?: string;
}

function ModalLayout({
  title,
  onClose,
  children,
  maxWidth = "max-w-[480px]",
}: Props) {
  return (
    <>
      <Overplay onClose={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div
          className={`pointer-events-auto relative bg-white rounded-lg w-full ${maxWidth} max-h-screen flex flex-col gap-4 overflow-hidden px-[15px] py-4`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold">{title}</h4>

            <Button onClick={onClose}>
              <X size={24} />
            </Button>
          </div>

          {children}
        </div>
      </div>
    </>
  );
}

export default ModalLayout;
