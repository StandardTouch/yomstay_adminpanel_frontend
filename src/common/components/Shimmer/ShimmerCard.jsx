import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShimmerBase from "./ShimmerBase";
import { cn } from "@/lib/utils";

const ShimmerCard = ({
  variant = "default",
  className = "",
  showHeader = true,
  showContent = true,
}) => {
  const renderVariant = () => {
    switch (variant) {
      case "stats":
        return (
          <div className="text-center space-y-3">
            <ShimmerBase className="h-8 w-16 mx-auto rounded" />
            <ShimmerBase className="h-4 w-24 mx-auto" />
          </div>
        );

      case "chart":
        return (
          <div className="space-y-3">
            <ShimmerBase className="h-4 w-32" />
            <div className="flex items-end justify-between h-32">
              {Array.from({ length: 7 }).map((_, i) => (
                <ShimmerBase
                  key={i}
                  className="w-8 rounded-t"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
          </div>
        );

      case "list":
        return (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <ShimmerBase className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <ShimmerBase className="h-4 w-3/4" />
                  <ShimmerBase className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <ShimmerBase className="h-4 w-full" />
            <ShimmerBase className="h-4 w-3/4" />
            <ShimmerBase className="h-4 w-1/2" />
          </div>
        );
    }
  };

  return (
    <Card className={cn("", className)}>
      {showHeader && (
        <CardHeader>
          <CardTitle>
            <ShimmerBase className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
      )}
      {showContent && <CardContent>{renderVariant()}</CardContent>}
    </Card>
  );
};

export default ShimmerCard;
