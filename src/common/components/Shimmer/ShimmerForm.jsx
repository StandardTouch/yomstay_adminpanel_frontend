import React from "react";
import ShimmerBase from "./ShimmerBase";
import { cn } from "@/lib/utils";

const ShimmerForm = ({
  variant = "default",
  className = "",
  showHeader = true,
  showActions = true,
}) => {
  const renderVariant = () => {
    switch (variant) {
      case "user-form":
        return (
          <div className="space-y-6">
            {/* Profile Image Section */}
            <div className="space-y-4">
              <ShimmerBase className="h-4 w-24" />
              <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <ShimmerBase className="h-20 w-20 rounded-full" />
                <div className="text-center space-y-2">
                  <ShimmerBase className="h-4 w-48 mx-auto" />
                  <ShimmerBase className="h-10 w-32 mx-auto rounded-md" />
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <ShimmerBase className="h-4 w-20" />
                  <ShimmerBase className="h-10 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <ShimmerBase className="h-4 w-20" />
                  <ShimmerBase className="h-10 w-full rounded-md" />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <ShimmerBase className="h-4 w-16" />
                <ShimmerBase className="h-10 w-full rounded-md" />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <ShimmerBase className="h-4 w-20" />
                <ShimmerBase className="h-10 w-full rounded-md" />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <ShimmerBase className="h-4 w-16" />
                <ShimmerBase className="h-10 w-full rounded-md" />
              </div>

              {/* Password Field (for create) */}
              <div className="space-y-2">
                <ShimmerBase className="h-4 w-20" />
                <ShimmerBase className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        );

      case "filters":
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <ShimmerBase className="h-10 flex-1 min-w-64 rounded-md" />
              <ShimmerBase className="h-10 w-48 rounded-md" />
              <ShimmerBase className="h-10 w-48 rounded-md" />
              <ShimmerBase className="h-10 w-40 rounded-md" />
              <ShimmerBase className="h-10 w-32 rounded-md" />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <ShimmerBase className="h-4 w-32" />
            <ShimmerBase className="h-10 w-full rounded-md" />
            <ShimmerBase className="h-4 w-24" />
            <ShimmerBase className="h-10 w-full rounded-md" />
            <ShimmerBase className="h-4 w-28" />
            <ShimmerBase className="h-10 w-full rounded-md" />
          </div>
        );
    }
  };

  return (
    <div className={cn("", className)}>
      {showHeader && (
        <div className="space-y-2 mb-6">
          <ShimmerBase className="h-6 w-32" />
          <ShimmerBase className="h-4 w-64" />
        </div>
      )}

      {renderVariant()}

      {showActions && (
        <div className="flex gap-3 pt-6 border-t">
          <ShimmerBase className="h-10 flex-1 rounded-md" />
          <ShimmerBase className="h-10 flex-1 rounded-md" />
        </div>
      )}
    </div>
  );
};

export default ShimmerForm;
