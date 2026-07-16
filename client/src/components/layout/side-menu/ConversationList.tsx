import { mockConversationList } from "../../../mocks/mockConversationList";
import ConversationItem from "./ConversationItem";

function ConversationList() {
  const conversations = mockConversationList;
  return (
    <div className="overflow-y-auto">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.conversation_id}
          {...conversation}
        />
      ))}
    </div>
  );
}

export default ConversationList;
