import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import FooterAction from "./FooterAction";
import MessageInput from "./MessageInput";
import Button from "../../ui/Button";
import type { PreviewFile } from "./preview/PreviewList";
import { formatFileSize, formatImageSize } from "../../../utils/formatters";
import toast from "react-hot-toast";
import { useAudioRecorder } from "../../../hooks/useAudioRecorder";
import AudioPreview from "./preview/AudioPreview";

function ChatFooter() {
  const [message, setMessage] = useState<string>("");
  const [previews, setPreviews] = useState<PreviewFile[]>([]);
  const recorder = useAudioRecorder();

  useEffect(() => {
    return () => {
      previews.forEach((p) => {
        if (p.previewUrl) URL.revokeObjectURL(p.previewUrl);
      });
    };
  }, [previews]);

  const handleAddPreview = (files: FileList, isImage: boolean) => {
    const validFiles = Array.from(files).filter((file) => {
      const error = isImage
        ? formatImageSize(file.size)
        : formatFileSize(file.size);

      if (error) {
        toast.error(error);
        return false;
      }
      return true;
    });

    const newPreviews: PreviewFile[] = validFiles.map((file) => ({
      id: uuidv4(),
      file,
      previewUrl: isImage ? URL.createObjectURL(file) : undefined,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemovePreview = (id: string) => {
    setPreviews((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleMicClick = async () => {
    try {
      await recorder.start();
    } catch {
      toast.error("Không thể truy cập micro");
    }
  };

  const handleSend = async () => {
    if (!message.trim() && previews.length === 0) return;
    setMessage("");
    setPreviews([]);

    console.log("send audio blob", recorder.audioBlob);
    recorder.reset();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend =
    !!message.trim() ||
    previews.length > 0 ||
    recorder.audioUrl ||
    recorder.isRecording;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 border-t border-gray-200`}
    >
      {!previews.length && !recorder.isRecording && !recorder.audioUrl && (
        <FooterAction
          onImageSelect={(files) => handleAddPreview(files, true)}
          onFileSelect={(files) => handleAddPreview(files, false)}
          onMicClick={handleMicClick}
        />
      )}

      {recorder.isRecording || recorder.audioUrl ? (
        <AudioPreview
          isRecording={recorder.isRecording}
          elapsed={recorder.elapsed}
          audioUrl={recorder.audioUrl}
          onCancel={recorder.cancel}
          onStop={recorder.stopRecording}
          onDelete={recorder.reset}
        />
      ) : (
        <MessageInput
          value={message}
          onChange={setMessage}
          onKeyDown={handleKeyDown}
          previews={previews}
          onRemovePreview={handleRemovePreview}
          onAddPreview={handleAddPreview}
        />
      )}

      <Button
        onClick={handleSend}
        disabled={!canSend}
        className={`p-1.5 rounded-full ${canSend ? "bg-primary text-white" : "text-neutral bg-gray-100"}`}
      >
        <SendHorizontal size={20} />
      </Button>
    </div>
  );
}

export default ChatFooter;
