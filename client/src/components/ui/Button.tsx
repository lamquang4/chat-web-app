import React from "react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function Button({ children, type = "button", className, ...props }: Props) {
  return (
    <button
      type={type}
      className={twMerge("font-medium outline-none cursor-pointer", className)}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
