import { Play, X } from "lucide-react";
import Button from "../../../ui/Button";

interface Props {
  previewUrl: string;
  onRemove: () => void;
}

function VideoPreview({ previewUrl, onRemove }: Props) {
  return (
    <div className="relative rounded-2xl bg-white border border-border aspect-square max-w-[64px]">
      <video
        src={previewUrl}
        muted
        preload="metadata"
        className="h-full w-full object-cover rounded-2xl"
      />

      <div className="absolute inset-0 flex items-center justify-center text-white">
        <Play size={20} fill="currentColor" />
      </div>

      <Button
        onClick={onRemove}
        className="absolute -top-2 -right-1 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center"
      >
        <X size={15} strokeWidth={2.5} />
      </Button>
    </div>
  );
}

export default VideoPreview;
