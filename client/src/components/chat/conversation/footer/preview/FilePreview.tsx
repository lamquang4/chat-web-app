import { X, FileText } from "lucide-react";
import Button from "../../../../ui/Button";

type Props = {
  name: string;
  onRemove: () => void;
};

function FilePreview({ name, onRemove }: Props) {
  return (
    <div className="relative inline-flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white border border-gray-200 max-w-[260px] min-w-[160px]">
      <FileText size={24} className="text-primary shrink-0" />

      <div className="min-w-0 space-y-0.5">
        <p className="font-semibold truncate leading-snug max-w-[180px]">
          {name}
        </p>
      </div>

      <Button
        onClick={onRemove}
        className="absolute top-0 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center"
      >
        <X size={14} />
      </Button>
    </div>
  );
}

export default FilePreview;
