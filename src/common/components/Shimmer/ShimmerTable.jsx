import React from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import ShimmerBase from "./ShimmerBase";
import { cn } from "@/lib/utils";

const ShimmerTable = ({
  rows = 5,
  columns = 7,
  className = "",
  showCheckbox = true,
  showActions = true,
}) => {
  const renderShimmerCell = (type = "text") => {
    switch (type) {
      case "avatar":
        return (
          <div className="flex items-center gap-3">
            <ShimmerBase className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <ShimmerBase className="h-4 w-24" />
              <ShimmerBase className="h-3 w-32" />
            </div>
          </div>
        );
      case "badge":
        return <ShimmerBase className="h-6 w-16 rounded-full" />;
      case "actions":
        return (
          <div className="flex gap-1">
            <ShimmerBase className="h-8 w-8 rounded-md" />
            <ShimmerBase className="h-8 w-8 rounded-md" />
          </div>
        );
      case "date":
        return (
          <div className="space-y-1">
            <ShimmerBase className="h-3 w-20" />
            <ShimmerBase className="h-3 w-16" />
          </div>
        );
      default:
        return <ShimmerBase className="h-4 w-20" />;
    }
  };

  const renderShimmerRow = (rowIndex) => {
    const cells = [];

    // Checkbox column
    if (showCheckbox) {
      cells.push(
        <TableCell key="checkbox">
          <ShimmerBase className="h-4 w-4 rounded" />
        </TableCell>
      );
    }

    // Data columns
    for (let colIndex = 0; colIndex < columns; colIndex++) {
      let cellType = "text";

      // First column is always avatar
      if (colIndex === 0) {
        cellType = "avatar";
      }
      // Role column
      else if (colIndex === 2) {
        cellType = "badge";
      }
      // Created date column
      else if (colIndex === 4) {
        cellType = "date";
      }
      // Sync status column
      else if (colIndex === 5) {
        cellType = "badge";
      }
      // Actions column
      else if (colIndex === columns - 1 && showActions) {
        cellType = "actions";
      }

      cells.push(
        <TableCell key={colIndex}>{renderShimmerCell(cellType)}</TableCell>
      );
    }

    return <TableRow key={rowIndex}>{cells}</TableRow>;
  };

  return (
    <Card className={cn("overflow-x-auto", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {showCheckbox && (
              <TableHead>
                <ShimmerBase className="h-4 w-4 rounded" />
              </TableHead>
            )}
            <TableHead>
              <ShimmerBase className="h-4 w-16" />
            </TableHead>
            <TableHead>
              <ShimmerBase className="h-4 w-20" />
            </TableHead>
            <TableHead>
              <ShimmerBase className="h-4 w-16" />
            </TableHead>
            <TableHead>
              <ShimmerBase className="h-4 w-20" />
            </TableHead>
            <TableHead>
              <ShimmerBase className="h-4 w-24" />
            </TableHead>
            <TableHead>
              <ShimmerBase className="h-4 w-20" />
            </TableHead>
            {showActions && (
              <TableHead>
                <ShimmerBase className="h-4 w-20" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, index) =>
            renderShimmerRow(index)
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default ShimmerTable;
