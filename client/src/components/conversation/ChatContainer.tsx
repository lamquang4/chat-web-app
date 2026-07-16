import { mockConversationDetailGroup } from "../../mocks/mockConversationDetail";
import ChatBody from "./ChatBody";
import ChatFooter from "./footer/ChatFooter";
import ChatHeader from "./ChatHeader";

function ChatContainer() {
  const conversation = mockConversationDetailGroup;

  return (
    <div className="flex flex-col flex-1 overflow-visible bg-white">
      <ChatHeader name={conversation.name} is_online={conversation.is_online} />

      <ChatBody messages={conversation.messages.content} />

      <ChatFooter />
    </div>
  );
}

export default ChatContainer;
