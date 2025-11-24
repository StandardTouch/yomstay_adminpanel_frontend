import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

export default function ConditionForm({
  isOpen,
  onClose,
  condition,
  onConditionChange,
  onSubmit,
  onCancel,
  isUpdate,
  loading,
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="max-w-md w-full overflow-y-auto p-6">
        <SheetHeader className="mb-6">
          <SheetTitle>
            {isUpdate ? "Update" : "Add New"} Condition
          </SheetTitle>
          <SheetDescription>
            Enter the condition details in both English and Arabic
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="conditionName" className="text-sm font-medium">
              Name (Unique Identifier) *
            </Label>
            <Input
              placeholder="e.g., valid_id_required"
              type="text"
              id="conditionName"
              value={condition.name}
              onChange={(e) => {
                onConditionChange({ ...condition, name: e.target.value });
              }}
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier (lowercase, no spaces)
            </p>
          </div>

          {/* Display Name - English */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              Display Name (English) *
            </Label>
            <Input
              placeholder="e.g., A valid ID is required to check in"
              id="displayName"
              value={condition.displayName}
              onChange={(e) => {
                onConditionChange({
                  ...condition,
                  displayName: e.target.value,
                });
              }}
              required
              className="w-full"
              dir="ltr"
            />
          </div>

          {/* Display Name - Arabic */}
          <div className="space-y-2">
            <Label htmlFor="displayNameAr" className="text-sm font-medium">
              Display Name (Arabic)
            </Label>
            <Input
              placeholder="e.g., مطلوب هوية صالحة للتحقق"
              id="displayNameAr"
              value={condition.displayNameAr || ""}
              onChange={(e) => {
                onConditionChange({
                  ...condition,
                  displayNameAr: e.target.value,
                });
              }}
              className="w-full"
              dir="rtl"
            />
          </div>

          {/* Description - English */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description (English)
            </Label>
            <Textarea
              placeholder="Detailed description of the condition"
              id="description"
              value={condition.description || ""}
              onChange={(e) => {
                onConditionChange({
                  ...condition,
                  description: e.target.value,
                });
              }}
              className="w-full"
              dir="ltr"
              rows={3}
            />
          </div>

          {/* Description - Arabic */}
          <div className="space-y-2">
            <Label htmlFor="descriptionAr" className="text-sm font-medium">
              Description (Arabic)
            </Label>
            <Textarea
              placeholder="وصف تفصيلي للحالة"
              id="descriptionAr"
              value={condition.descriptionAr || ""}
              onChange={(e) => {
                onConditionChange({
                  ...condition,
                  descriptionAr: e.target.value,
                });
              }}
              className="w-full"
              dir="rtl"
              rows={3}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={condition.isActive}
              onCheckedChange={(checked) => {
                onConditionChange({ ...condition, isActive: checked });
              }}
            />
            <Label htmlFor="isActive" className="text-sm font-medium">
              Active
            </Label>
          </div>

          {/* Required Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isRequired"
              checked={condition.isRequired}
              onCheckedChange={(checked) => {
                onConditionChange({ ...condition, isRequired: checked });
              }}
            />
            <Label htmlFor="isRequired" className="text-sm font-medium">
              Required
            </Label>
          </div>

          <SheetFooter className="mt-6">
            <Button type="submit" className="w-full hover:cursor-pointer" disabled={loading}>
              {loading
                ? "Processing..."
                : isUpdate
                ? "Update"
                : "Add New"}{" "}
              Condition
            </Button>
            <SheetClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full hover:cursor-pointer"
                disabled={loading}
              >
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

