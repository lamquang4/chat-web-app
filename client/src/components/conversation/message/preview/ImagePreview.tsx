import { X } from "lucide-react";
import Button from "../../../ui/Button";
import Image from "../../../ui/Image";

type Props = {
  previewUrl: string;
  name: string;
  onRemove: () => void;
};

function ImagePreview({ previewUrl, name, onRemove }: Props) {
  return (
    <div className="relative">
      <Image
        src={previewUrl}
        alt={name}
        className="w-16 h-16 object-cover rounded-xl"
      />

      <Button
        onClick={onRemove}
        className="absolute top-0 -right-1 w-5 h-5 bg-danger text-white rounded-full flex items-center justify-center"
      >
        <X size={14} />
      </Button>
    </div>
  );
}

export default ImagePreview;
