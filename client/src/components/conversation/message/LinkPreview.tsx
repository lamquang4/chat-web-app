import type { LinkPreviewResponse } from "../../../types/types";
import Image from "../../ui/Image";

interface Props {
  linkPreview: LinkPreviewResponse;
  isMe: boolean;
}

function LinkPreview({ linkPreview, isMe }: Props) {
  return (
    <div
      className={`rounded-xl overflow-hidden max-w-90 ${
        isMe ? "bg-primary text-white" : "bg-bg"
      }`}
    >
      <a href={linkPreview.url} target="_blank" rel="noopener noreferrer">
        {linkPreview.image && (
          <Image
            src={linkPreview.image}
            alt={linkPreview.title ?? linkPreview.site_name ?? ""}
            className="block max-h-96 w-full object-contain"
            loading="lazy"
          />
        )}
        <div className="px-3 py-2 space-y-2">
          <p className="font-semibold line-clamp-2">
            {linkPreview.title ?? linkPreview.url}
          </p>
          {linkPreview.description && (
            <p className="line-clamp-2">{linkPreview.description}</p>
          )}
          <p>{linkPreview.site_name ?? new URL(linkPreview.url).hostname}</p>
        </div>
      </a>
    </div>
  );
}

export default LinkPreview;
