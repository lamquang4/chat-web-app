import { useEffect, useRef, useState } from "react";
import PreviewList, { type PreviewFile } from "../message/preview/PreviewList";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";
import Button from "../../ui/Button";
import { MAX_CONTENT_LENGTH } from "../../../constants/limit";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  previews: PreviewFile[];
  onRemovePreview: (id: string) => void;
  onAddPreview: (files: FileList) => void;
}
function MessageInput({
  value,
  onChange,
  onKeyDown,
  previews,
  onRemovePreview,
  onAddPreview,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [showEmoji, setShowEmoji] = useState<boolean>(false);

  useEffect(() => {
    if (!showEmoji) return;
    const handler = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  return (
    <div className="relative flex-1 min-w-0">
      <div className="bg-neutral-200 flex flex-col gap-2 rounded-xl overflow-hidden">
        <PreviewList
          previews={previews}
          onRemove={onRemovePreview}
          onAdd={onAddPreview}
        />

        <div className="px-4 py-2 flex justify-between items-end gap-2">
          <textarea
            ref={ref}
            rows={1}
            value={value}
            maxLength={MAX_CONTENT_LENGTH}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            placeholder="Aa"
            className="flex-1 bg-transparent outline-none resize-none max-h-32 leading-relaxed custom-scroll"
          />

          <div className="relative">
            <Button
              type="button"
              onClick={() => setShowEmoji((v) => !v)}
              className="text-primary flex items-center justify-center shrink-0"
            >
              <Smile size={20} />
            </Button>
          </div>
        </div>
      </div>

      {showEmoji && (
        <div ref={pickerRef} className="absolute bottom-full right-0 mb-2 z-20">
          <EmojiPicker
            onEmojiClick={(data) => onChange(value + data.emoji)}
            lazyLoadEmojis
          />
        </div>
      )}
    </div>
  );
}

export default MessageInput;
