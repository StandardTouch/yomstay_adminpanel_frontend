import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const UserAdvancedFilters = ({
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
}) => {
  return (
    <Card className="p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Image Filter */}
        <div className="flex items-center space-x-2">
          <Switch
            id="profile-image"
            checked={hasProfileImageFilter}
            onCheckedChange={onProfileImageFilterChange}
          />
          <Label htmlFor="profile-image">Has Profile Image</Label>
        </div>

        {/* Created Date Range */}
        <div>
          <Label>Created After</Label>
          <Input
            type="date"
            value={createdAfter}
            onChange={(e) => onCreatedAfterChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Created Before</Label>
          <Input
            type="date"
            value={createdBefore}
            onChange={(e) => onCreatedBeforeChange(e.target.value)}
            className="mt-1"
          />
        </div>

        {/* Updated Date Range */}
        <div>
          <Label>Updated After</Label>
          <Input
            type="date"
            value={updatedAfter}
            onChange={(e) => onUpdatedAfterChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label>Updated Before</Label>
          <Input
            type="date"
            value={updatedBefore}
            onChange={(e) => onUpdatedBeforeChange(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </Card>
  );
};

export default UserAdvancedFilters;
