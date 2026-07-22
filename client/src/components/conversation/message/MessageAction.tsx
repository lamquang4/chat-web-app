import Button from "../../ui/Button";
import Tooltip from "../../ui/Tooltip";

interface MessageActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
}

interface Props {
  actions: MessageActionItem[];
  forceVisible?: boolean;
  onActionDone?: () => void;
}

function MessageAction({ actions, forceVisible, onActionDone }: Props) {
  return (
    <div
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      className={`
        absolute -top-10 transition-opacity duration-150 z-10 shadow-md rounded-lg
        ${
          forceVisible
            ? "opacity-100"
            : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto"
        }
      `}
    >
      <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-lg">
        {actions.map((action) => (
          <div key={action.label} className="relative group/tooltip">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
                onActionDone?.();
              }}
              type="button"
              className={`w-9.5 h-9.5 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200 ${action.className ?? "text-neutral"}`}
            >
              {action.icon}
            </Button>

            <Tooltip text={action.label} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageAction;
