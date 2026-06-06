import React from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

function Select({ children, className, error, ...props }: Props) {
  return (
    <select
      className={twMerge(
        "text-[0.9rem] outline-none transition-colors border",
        className,
        error && "border-danger focus:border-danger",
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export default Select;
