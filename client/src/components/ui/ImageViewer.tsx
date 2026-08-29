import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

interface Props {
  images: string[];
  index: number;
  open: boolean;
  onClose: () => void;
}

function ImageViewer({ images, index, open, onClose }: Props) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={images.map((src) => ({ src }))}
      plugins={[Download, Zoom]}
      zoom={{
        scrollToZoom: true,
      }}
    />
  );
}

export default ImageViewer;
