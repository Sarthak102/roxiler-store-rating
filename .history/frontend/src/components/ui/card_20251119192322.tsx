import React from "react";
import clsx from "clsx";

export const Card: React.FC<
  React.PropsWithChildren<{ className?: string }>
> = ({ children, className }) => {
  return (
    <div
      className={clsx("bg-white rounded-lg p-4 shadow-sm border", className)}
    >
      {children}
    </div>
  );
};

export default Card;
