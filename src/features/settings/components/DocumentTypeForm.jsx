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

export default function DocumentTypeForm({
  isOpen,
  onClose,
  documentType,
  onDocumentTypeChange,
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
            {isUpdate ? "Update" : "Add New"} Document Type
          </SheetTitle>
          <SheetDescription>
            Enter the document type details in both English and Arabic
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* Name field */}
          <div className="space-y-2">
            <Label htmlFor="documentTypeName" className="text-sm font-medium">
              Name (Unique Identifier) *
            </Label>
            <Input
              placeholder="e.g., business_license"
              type="text"
              id="documentTypeName"
              value={documentType.name || ""}
              onChange={(e) => {
                onDocumentTypeChange({ ...documentType, name: e.target.value });
              }}
              required
              className="w-full"
              disabled={isUpdate} // Name cannot be changed on update
            />
            <p className="text-xs text-muted-foreground">
              Unique identifier (lowercase, no spaces)
              {isUpdate && " - Cannot be changed"}
            </p>
          </div>

          {/* Display Name - English */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              Display Name (English) *
            </Label>
            <Input
              placeholder="e.g., Business License"
              id="displayName"
              value={documentType.displayName || ""}
              onChange={(e) => {
                onDocumentTypeChange({
                  ...documentType,
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
              placeholder="e.g., رخصة تجارية"
              id="displayNameAr"
              value={documentType.displayNameAr || ""}
              onChange={(e) => {
                onDocumentTypeChange({
                  ...documentType,
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
              placeholder="Valid business license from local authorities"
              id="description"
              value={documentType.description || ""}
              onChange={(e) => {
                onDocumentTypeChange({
                  ...documentType,
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
              placeholder="رخصة تجارية صالحة من السلطات المحلية"
              id="descriptionAr"
              value={documentType.descriptionAr || ""}
              onChange={(e) => {
                onDocumentTypeChange({
                  ...documentType,
                  descriptionAr: e.target.value,
                });
              }}
              className="w-full"
              dir="rtl"
              rows={3}
            />
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order" className="text-sm font-medium">
              Order
            </Label>
            <Input
              placeholder="e.g., 1"
              type="number"
              id="order"
              value={documentType.order !== null && documentType.order !== undefined ? documentType.order : ""}
              onChange={(e) => {
                const value = e.target.value === "" ? null : parseInt(e.target.value);
                onDocumentTypeChange({
                  ...documentType,
                  order: value,
                });
              }}
              className="w-full"
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Display order (lower numbers appear first)
            </p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={documentType.isActive !== undefined ? documentType.isActive : true}
              onCheckedChange={(checked) => {
                onDocumentTypeChange({ ...documentType, isActive: checked });
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
              checked={documentType.isRequired !== undefined ? documentType.isRequired : false}
              onCheckedChange={(checked) => {
                onDocumentTypeChange({ ...documentType, isRequired: checked });
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
              Document Type
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

