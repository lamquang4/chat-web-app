import { useRef } from "react";
import { Image, Mic, Paperclip } from "lucide-react";
import Button from "../../../ui/Button";
import Input from "../../../ui/Input";
import Label from "../../../ui/Label";

type Props = {
  onImageSelect: (files: FileList) => void;
  onFileSelect: (files: FileList) => void;
  onMicClick?: () => void;
};

function FooterAction({ onImageSelect, onFileSelect, onMicClick }: Props) {
  const imageRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative flex items-center gap-1 shrink-0">
      <Button
        className="text-primary hover:bg-gray-100 p-1.5 rounded-full"
        onClick={onMicClick}
      >
        <Mic size={20} />
      </Button>

      <Label className="text-primary hover:bg-gray-100 p-1.5 rounded-full cursor-pointer">
        <Image size={20} />
        <Input
          ref={imageRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onImageSelect(e.target.files)}
        />
      </Label>

      <Label className="text-primary hover:bg-gray-100 p-1.5 rounded-full cursor-pointer">
        <Paperclip size={20} />
        <Input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onFileSelect(e.target.files)}
        />
      </Label>
    </div>
  );
}

export default FooterAction;
