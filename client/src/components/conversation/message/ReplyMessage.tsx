import type { ReplyMessageResponse } from "../../../types/types";

type Props = {
  reply: ReplyMessageResponse;
  isMe: boolean;
};

function ReplyMessage({ reply, isMe }: Props) {
  return (
    <div
      className={`flex items-start gap-2 px-3 py-2 rounded-2xl w-full bg-gray-100`}
    >
      <div
        className={`w-0.5 self-stretch rounded-full shrink-0 ${isMe ? "bg-primary" : "bg-neutral"}`}
      />
      <div className="min-w-0">
        <p className={`font-medium ${isMe ? "text-primary" : "text-neutral"}`}>
          {reply.sender_name}
        </p>
        <p className="text-neutral">
          {reply.content ?? (reply.attachments?.length && "File đính kèm")}
        </p>
      </div>
    </div>
  );
}

export default ReplyMessage;
