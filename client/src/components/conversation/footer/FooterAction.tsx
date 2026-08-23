import { useEffect, useRef, useState } from "react";
import { Image, Mic, Paperclip, Plus } from "lucide-react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import DropdownMenu from "../../ui/DropdownMenu";
import {
  ALLOWED_FILE_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
} from "../../../constants/limit";

interface Props {
  onImageSelect: (files: FileList) => void;
  onFileSelect: (files: FileList) => void;
  onMicClick?: () => void;
}

function FooterAction({ onImageSelect, onFileSelect, onMicClick }: Props) {
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!dropDownOpen) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropDownOpen]);

  const handleToggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDropDownOpen((prev) => !prev);
  };

  const menuItems = [
    {
      label: "Ghi âm",
      icon: <Mic size={18} />,
      onClick: () => {
        onMicClick?.();
        setDropDownOpen(false);
      },
    },
    {
      label: "Hình ảnh",
      icon: <Image size={18} />,
      onClick: () => {
        imageRef.current?.click();
        setDropDownOpen(false);
      },
    },
    {
      label: "Tệp đính kèm",
      icon: <Paperclip size={18} />,
      onClick: () => {
        fileRef.current?.click();
        setDropDownOpen(false);
      },
    },
  ];

  return (
    <div className="relative flex items-center gap-1" ref={containerRef}>
      <Button
        className={`p-1.5 rounded-full ${dropDownOpen ? "bg-primary text-white" : "text-neutral bg-neutral-200"}`}
        onClick={handleToggleDropdown}
      >
        <Plus size={20} />
      </Button>

      {dropDownOpen && (
        <DropdownMenu items={menuItems} horizontal="left" vertical="top" />
      )}

      <Input
        ref={imageRef}
        type="file"
        accept={ALLOWED_IMAGE_MIME_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onImageSelect(e.target.files)}
      />

      <Input
        ref={fileRef}
        type="file"
        accept={ALLOWED_FILE_MIME_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFileSelect(e.target.files)}
      />
    </div>
  );
}

export default FooterAction;
