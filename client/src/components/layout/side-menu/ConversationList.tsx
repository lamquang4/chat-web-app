import { mockConversationList } from "../../../mocks/mockConversationList";
import ConversationItem from "./ConversationItem";

function ConversationList() {
  const conversations = mockConversationList;
  return (
    <div className="overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          conversation={conversation}
          key={conversation.conversation_id}
        />
      ))}
    </div>
  );
}

export default ConversationList;
