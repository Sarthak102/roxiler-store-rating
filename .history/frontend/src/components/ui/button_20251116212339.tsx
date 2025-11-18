// frontend/src/components/ui/button.tsx
import React from "react";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "destructive" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant = "default",
  size = "md",
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizes: Record<string, string> = {
    sm: "py-1 px-2 text-sm",
    md: "py-2 px-3 text-sm",
    lg: "py-3 px-4 text-base",
  };
  const variants: Record<string, string> = {
    default: "bg-green-600 text-white hover:bg-green-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
