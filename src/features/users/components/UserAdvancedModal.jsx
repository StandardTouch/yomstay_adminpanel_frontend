import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, Settings } from "lucide-react";
// import UserSyncButton from "./UserSyncButton";

const UserAdvancedModal = ({
  hasProfileImageFilter,
  onProfileImageFilterChange,
  createdAfter,
  onCreatedAfterChange,
  createdBefore,
  onCreatedBeforeChange,
  updatedAfter,
  onUpdatedAfterChange,
  updatedBefore,
  onUpdatedBeforeChange,
  onClearFilters,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter size={16} />
          Advanced Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-96">
        <div className="h-full flex flex-col">
          <SheetHeader className="pb-6 px-6">
            <SheetTitle className="flex items-center gap-2 text-xl">
              <Settings size={20} />
              Advanced Options
            </SheetTitle>
            <SheetDescription className="text-base">
              Configure advanced filters for users
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="space-y-8">
              {/* Sync Section */}
              {/* <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  User Synchronization
                </h3>
                <div className="pl-2">
                  <UserSyncButton />
                </div>
              </div>

              <Separator className="my-6" /> */}

              {/* Advanced Filters Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">
                  Advanced Filters
                </h3>

                {/* Profile Image Filter */}
                <div className="space-y-3 pl-2">
                  <Label className="text-sm font-medium text-foreground">
                    Profile Image
                  </Label>
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="has-profile-image"
                      checked={hasProfileImageFilter}
                      onCheckedChange={onProfileImageFilterChange}
                    />
                    <Label
                      htmlFor="has-profile-image"
                      className="text-sm text-muted-foreground"
                    >
                      Has Profile Image
                    </Label>
                  </div>
                </div>

                {/* Date Range Filters */}
                <div className="space-y-4 pl-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Created After
                    </Label>
                    <Input
                      type="date"
                      value={createdAfter}
                      onChange={(e) => onCreatedAfterChange(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Created Before
                    </Label>
                    <Input
                      type="date"
                      value={createdBefore}
                      onChange={(e) => onCreatedBeforeChange(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Updated After
                    </Label>
                    <Input
                      type="date"
                      value={updatedAfter}
                      onChange={(e) => onUpdatedAfterChange(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-foreground">
                      Updated Before
                    </Label>
                    <Input
                      type="date"
                      value={updatedBefore}
                      onChange={(e) => onUpdatedBeforeChange(e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions - Fixed at bottom */}
          <div className="border-t bg-background px-6 py-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="flex-1"
              >
                Clear All Filters
              </Button>
              <Button onClick={() => setOpen(false)} className="flex-1">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UserAdvancedModal;
