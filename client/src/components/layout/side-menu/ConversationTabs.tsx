import Button from "../../ui/Button";
import {
  setActiveConversationTab,
  type ConversationTab,
} from "../../../redux/slices/uiSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";

const tabs: { label: string; value: ConversationTab }[] = [
  { label: "Tất cả", value: null },
  { label: "Nhóm", value: "group" },
  { label: "Riêng tư", value: "private" },
];

function ConversationTabs() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeConversationTab);

  return (
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => dispatch(setActiveConversationTab(tab.value))}
          className={`px-3 py-1.5 rounded-full font-semibold transition-colors
            ${
              activeTab === tab.value
                ? "bg-secondary text-primary"
                : "hover:bg-gray-100"
            }`}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

export default ConversationTabs;
