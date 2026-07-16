import { Link } from "react-router-dom";
import Button from "./Button";

interface DropdownMenuItem {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  textColor?: string;
  target?: string;
}

interface Props {
  items: DropdownMenuItem[];
  horizontal?: "left" | "right";
  vertical?: "top" | "bottom";
}

function DropdownMenu({
  items,
  horizontal = "right",
  vertical = "bottom",
}: Props) {
  const horizontalClass = {
    left: "left-0",
    right: "right-0",
  };

  const verticalClass = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
  };

  return (
    <div
      className={`absolute inline-flex flex-col ${horizontalClass[horizontal]} ${verticalClass[vertical]} w-max bg-white shadow-md rounded-sm z-20`}
    >
      {items.map((item, index) =>
        item.href ? (
          <Link
            key={index}
            to={item.href}
            target={item.target}
            className="block px-2.5 py-3.5 hover:bg-gray-100 w-full"
          >
            <div
              className={`flex items-center gap-2 font-medium ${
                item.textColor ?? "text-neutral"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        ) : (
          <Button
            key={index}
            onClick={item.onClick}
            disabled={item.disabled}
            className="px-2.5 py-3.5 hover:bg-gray-100 w-full"
          >
            <div
              className={`flex items-center gap-2 font-medium ${
                item.textColor ?? "text-neutral"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Button>
        ),
      )}
    </div>
  );
}

export default DropdownMenu;
