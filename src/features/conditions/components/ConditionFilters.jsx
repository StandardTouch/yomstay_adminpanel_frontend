import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ConditionFilters({
  filters,
  onActiveFilterChange,
  onRequiredFilterChange,
  onSortChange,
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {/* Active Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="active-filter" className="text-sm">
          Status:
        </Label>
        <Select
          value={
            filters.isActive === undefined
              ? "all"
              : filters.isActive
              ? "active"
              : "inactive"
          }
          onValueChange={onActiveFilterChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Required Filter */}
      <div className="flex items-center gap-2">
        <Label htmlFor="required-filter" className="text-sm">
          Required:
        </Label>
        <Select
          value={
            filters.isRequired === undefined
              ? "all"
              : filters.isRequired
              ? "required"
              : "optional"
          }
          onValueChange={onRequiredFilterChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="required">Required</SelectItem>
            <SelectItem value="optional">Optional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort By */}
      <div className="flex items-center gap-2">
        <Label htmlFor="sort-by" className="text-sm">
          Sort By:
        </Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onSortChange(value, filters.sortOrder)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sortOrder">Sort Order</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="displayName">Display Name</SelectItem>
            <SelectItem value="createdAt">Created Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Order */}
      <div className="flex items-center gap-2">
        <Label htmlFor="sort-order" className="text-sm">
          Order:
        </Label>
        <Select
          value={filters.sortOrder}
          onValueChange={(value) => onSortChange(filters.sortBy, value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

