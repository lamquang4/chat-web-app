import React from "react";
import { twMerge } from "tailwind-merge";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

function Button({ children, className, ...props }: Props) {
  return (
    <button
      className={twMerge(
        "text-[0.9rem] outline-none cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
