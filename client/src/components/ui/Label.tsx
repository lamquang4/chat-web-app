import React from "react";
import { twMerge } from "tailwind-merge";

type Props = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

function Label({ children, required, className, ...props }: Props) {
  return (
    <label
      {...props}
      className={twMerge("text-[0.9rem] font-medium", className)}
    >
      {children}
      {required && <span className="ml-1 text-danger">*</span>}
    </label>
  );
}

export default Label;
