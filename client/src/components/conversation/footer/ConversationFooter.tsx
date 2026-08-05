import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import FooterAction from "./FooterAction";
import MessageInput from "./MessageInput";
import Button from "../../ui/Button";
import type { PreviewFile } from "../message/preview/PreviewList";
import toast from "react-hot-toast";
import { useAudioRecorder } from "../../../hooks/useAudioRecorder";
import VoiceRecordingPreview from "../message/preview/VoiceRecordingPreview";
import type { ReplyMessageResponse } from "../../../types/types";
import ReplyPreview from "../message/preview/ReplyPreview";
import { fileSchema, imageSchema } from "../../../schemas/uploadSchema";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_UPLOAD,
  RECORDING_MIME_TYPE,
} from "../../../constants/limit";
import { sendMessageSchema } from "../../../schemas/messageSchema";

interface Props {
  replyTo: ReplyMessageResponse | null;
  onCancelReply: () => void;
}

function ConversationFooter({ replyTo, onCancelReply }: Props) {
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

  const handleAddPreview = (files: FileList) => {
    const total = previews.length + files.length;

    if (total > MAX_UPLOAD) {
      toast.error(`Chỉ được gửi tối đa ${MAX_UPLOAD} file và hình`);
      return;
    }

    const newPreviews: PreviewFile[] = [];

    Array.from(files).forEach((file) => {
      const isImage = ALLOWED_IMAGE_MIME_TYPES.includes(file.type);
      const schema = isImage ? imageSchema : fileSchema;

      const result = schema.safeParse(file);
      if (!result.success) {
        toast.error(result.error.issues[0]?.message);
        return;
      }

      newPreviews.push({
        id: uuidv4(),
        file,
        previewUrl: isImage ? URL.createObjectURL(file) : undefined,
      });
    });

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

  const handleSendMessage = async () => {
    let audioBlob = recorder.audioBlob;

    if (recorder.isRecording) {
      audioBlob = await recorder.stopRecording();
    }

    const attachments = [...previews.map((p) => p.file)];

    if (audioBlob) {
      const audioFile = new File([audioBlob], `voice-${Date.now()}.mp4`, {
        type: RECORDING_MIME_TYPE,
      });
      attachments.push(audioFile);
    }

    const result = sendMessageSchema.safeParse({
      content: message,
      attachments,
      reply_message_id: replyTo?.message_id,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message);
      return;
    }

    const data = result.data;
    console.log(data);

    setMessage("");
    setPreviews([]);
    recorder.reset();
    onCancelReply();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const canSend =
    !!message.trim() ||
    previews.length > 0 ||
    recorder.audioUrl ||
    recorder.isRecording;

  return (
    <div className="flex flex-col border-t border-gray-200">
      {replyTo && <ReplyPreview replyTo={replyTo} onCancel={onCancelReply} />}

      <div className="flex items-center gap-2 px-4 py-3">
        {!previews.length && !recorder.isRecording && !recorder.audioUrl && (
          <FooterAction
            onImageSelect={(files) => handleAddPreview(files)}
            onFileSelect={(files) => handleAddPreview(files)}
            onMicClick={handleMicClick}
          />
        )}

        {recorder.isRecording || recorder.audioUrl ? (
          <VoiceRecordingPreview
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
          onClick={handleSendMessage}
          disabled={!canSend}
          className={`p-1.5 rounded-full ${canSend ? "bg-primary text-white" : "text-neutral bg-gray-100"}`}
        >
          <SendHorizontal size={20} />
        </Button>
      </div>
    </div>
  );
}

export default ConversationFooter;
