import Button from "../../ui/Button";
import Tooltip from "../../ui/Tooltip";

type MessageActionItem = {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  className?: string;
};

type Props = {
  actions: MessageActionItem[];
};

function MessageAction({ actions }: Props) {
  return (
    <div className="absolute -top-10 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-10 pointer-events-none group-hover:pointer-events-auto">
      <div className="flex items-center gap-0.5 bg-white border border-gray-100 rounded-md px-1 py-0.5">
        {actions.map((action) => (
          <>
            <div className="relative group/tooltip">
              <Button
                key={action.label}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 ${action.className ?? "text-neutral"}`}
              >
                {action.icon}
              </Button>

              <Tooltip text={action.label} />
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default MessageAction;
