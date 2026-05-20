"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  icon: ReactNode;
};

export default function Button({
  title,
  icon,
  "aria-label": ariaLabel,
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      title={title}
      aria-label={ariaLabel ?? title}
      className={className}
      {...rest}
    >
      {icon}
    </button>
  );
}