import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function DocumentTypeItem({
  documentType,
  index,
  isArabic,
  isDraggedItem,
  isDropTarget,
  isDragging,
  draggingIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onToggleActive,
  onEdit,
  onDelete,
  loading,
}) {
  const displayName = isArabic
    ? documentType.ar?.displayName || documentType.displayName
    : documentType.displayName;
  const description = isArabic
    ? documentType.ar?.description || documentType.description
    : documentType.description;

  return (
    <>
      {/* Insertion placeholder - show above the target */}
      {isDropTarget &&
        draggingIndex !== null &&
        draggingIndex < index && (
          <div className="h-2 my-2 mx-4 bg-primary/20 border-2 border-dashed border-primary rounded-md animate-pulse" />
        )}

      <div
        className={`border-b p-4 flex justify-between items-start hover:bg-accent/5 transition-colors ${
          isDraggedItem
            ? "opacity-40 scale-95 cursor-grabbing"
            : isDropTarget
            ? "ring-2 ring-primary ring-offset-2 scale-105 bg-accent/10"
            : ""
        } ${isDragging && !isDraggedItem ? "cursor-pointer" : ""}`}
        draggable={!isDragging}
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
        onDragEnd={onDragEnd}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="7" cy="5" r="1.5" fill="currentColor" />
              <circle cx="13" cy="5" r="1.5" fill="currentColor" />
              <circle cx="7" cy="10" r="1.5" fill="currentColor" />
              <circle cx="13" cy="10" r="1.5" fill="currentColor" />
              <circle cx="7" cy="15" r="1.5" fill="currentColor" />
              <circle cx="13" cy="15" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-semibold">{displayName}</h2>
              {documentType.isRequired && (
                <Badge variant="destructive">Required</Badge>
              )}
              {documentType.order !== null && documentType.order !== undefined && (
                <Badge variant="outline" className="text-xs">
                  Order: {documentType.order}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
            <div className="mt-2 text-xs text-muted-foreground">
              <span>Name: {documentType.name}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ml-4">
          {/* Active Toggle */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor={`active-toggle-${documentType.id}`}
              className="text-xs whitespace-nowrap"
            >
              Active:
            </Label>
            <Switch
              id={`active-toggle-${documentType.id}`}
              checked={documentType.isActive ?? false}
              onCheckedChange={(checked) =>
                onToggleActive(documentType.id, checked)
              }
              disabled={loading || isDragging}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => onEdit(documentType)}
              disabled={isDragging}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="cursor-pointer"
              onClick={() => onDelete(documentType)}
              disabled={isDragging}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Insertion placeholder - show below the target */}
      {isDropTarget &&
        draggingIndex !== null &&
        draggingIndex >= index && (
          <div className="h-2 my-2 mx-4 bg-primary/20 border-2 border-dashed border-primary rounded-md animate-pulse" />
        )}
    </>
  );
}

