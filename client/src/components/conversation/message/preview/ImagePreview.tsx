import { X } from "lucide-react";
import Button from "../../../ui/Button";
import Image from "../../../ui/Image";

interface Props {
  previewUrl: string;
  name: string;
  onRemove: () => void;
}

function ImagePreview({ previewUrl, name, onRemove }: Props) {
  return (
    <div className="relative">
      <Image
        src={previewUrl}
        alt={name}
        className="w-18 h-18 object-cover rounded-xl"
      />

      <Button
        onClick={onRemove}
        className="absolute -top-2 -right-1 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center"
      >
        <X size={15} />
      </Button>
    </div>
  );
}

export default ImagePreview;
