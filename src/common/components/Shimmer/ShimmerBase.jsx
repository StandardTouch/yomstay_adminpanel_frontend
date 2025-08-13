import React from "react";
import { cn } from "@/lib/utils";

const ShimmerBase = ({ className = "", children, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted",
        "bg-[length:200%_100%] animate-shimmer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ShimmerBase;
