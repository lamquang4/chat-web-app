import React from "react";
import { twMerge } from "tailwind-merge";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

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
