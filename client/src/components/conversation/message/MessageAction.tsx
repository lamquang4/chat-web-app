import Button from "../../ui/Button";

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
      className={`absolute -top-10 transition-opacity duration-150 z-10 shadow-md rounded-lg
        ${
          forceVisible
            ? "opacity-100"
            : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto"
        }
      `}
    >
      <div className="flex items-center bg-white border border-gray-300 rounded-lg">
        {actions.map((action) => (
          <Button
            key={action.label}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick();
              onActionDone?.();
              (e.currentTarget as HTMLButtonElement).blur();
            }}
            type="button"
            className={`flex items-center justify-center gap-1.5 px-3 h-9.5 whitespace-nowrap hover:bg-gray-100 active:bg-gray-100 ${action.className ?? "text-neutral"}`}
          >
            {action.icon}
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}

export default MessageAction;
