import { mockConversationDetailGroup } from "../../mocks/mockConversationDetail";
import ConversationBody from "./ConversationBody";
import ConversationFooter from "./footer/ConversationFooter";
import ConversationHeader from "./ConversationHeader";

function ConversationContainer() {
  const conversation = mockConversationDetailGroup;

  return (
    <div className="flex flex-col flex-1 overflow-visible bg-white">
      <ConversationHeader
        conversationId={conversation.conversation_id}
        type={conversation.type}
        name={conversation.name}
        is_online={conversation.is_online}
      />

      <ConversationBody messages={conversation.messages.content} />

      <ConversationFooter />
    </div>
  );
}

export default ConversationContainer;
