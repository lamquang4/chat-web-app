import { useRef, useState } from "react";
import ImagePreview from "./ImagePreview";
import FilePreview from "./FilePreview";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import { Plus } from "lucide-react";
import {
  ALLOWED_FILE_MIME_TYPES,
  ALLOWED_IMAGE_MIME_TYPES,
} from "../../../../constants/mimeTypes";

export interface PreviewFile {
  id: string;
  file: File;
  previewUrl?: string;
}

interface Props {
  previews: PreviewFile[];
  onRemove: (id: string) => void;
  onAdd: (files: FileList) => void;
}

function PreviewList({ previews, onRemove, onAdd }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      onAdd(e.target.files);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files?.length) {
      onAdd(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  if (!previews.length) return null;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`flex items-center gap-2 overflow-x-auto snap-x snap-proximity scroll-smooth transition-colors px-4 py-2 ${
        isDragging ? "bg-primary" : "bg-gray-100"
      }`}
    >
      <div>
        <Button
          onClick={() => inputRef.current?.click()}
          className={`w-16 h-16 bg-white rounded-xl border-2 border-dashed flex items-center justify-center border-primary text-primary`}
        >
          <Plus size={24} />
        </Button>

        <Input
          ref={inputRef}
          type="file"
          multiple
          accept={[
            ...ALLOWED_IMAGE_MIME_TYPES,
            ...ALLOWED_FILE_MIME_TYPES,
          ].join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {previews.map((item) => (
        <div key={item.id} className="shrink-0">
          {item.previewUrl ? (
            <ImagePreview
              previewUrl={item.previewUrl}
              name={item.file.name}
              onRemove={() => onRemove(item.id)}
            />
          ) : (
            <FilePreview
              name={item.file.name}
              onRemove={() => onRemove(item.id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default PreviewList;
