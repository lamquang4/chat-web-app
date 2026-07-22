import { useRef } from "react";
import ImagePreview from "./ImagePreview";
import FilePreview from "./FilePreview";
import Input from "../../../ui/Input";
import Button from "../../../ui/Button";
import { Plus } from "lucide-react";

export type PreviewFile = {
  id: string;
  file: File;
  previewUrl?: string;
};

type Props = {
  previews: PreviewFile[];
  onRemove: (id: string) => void;
  onAdd: (files: FileList, isImage: boolean) => void;
};

function PreviewList({ previews, onRemove, onAdd }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const isImage = Array.from(e.target.files).every((f) =>
        f.type.startsWith("image/"),
      );
      onAdd(e.target.files, isImage);
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = e.dataTransfer.files;
    if (!files?.length) return;

    const isImage = Array.from(files).every((f) => f.type.startsWith("image/"));
    onAdd(files, isImage);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  if (!previews.length) return null;

  return (
    <div className="flex items-center gap-2 pb-1 overflow-x-auto snap-x snap-proximity scroll-smooth">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="bg-white"
      >
        <Button
          onClick={() => inputRef.current?.click()}
          className={`w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center border-primary text-primary`}
        >
          <Plus size={24} />
        </Button>

        <Input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.txt"
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
