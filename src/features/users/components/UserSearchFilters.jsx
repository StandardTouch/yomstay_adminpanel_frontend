import React from "react";
import { Search, CheckCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserSearchFilters = ({
  searchTerm,
  setSearchTerm,
  roleFilter,
  onRoleFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  roleOptions,
  sortOptions,
  // syncStatusFilter,
  // onSyncStatusFilterChange,
  // syncStatusOptions,
  // syncSummary,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      {/* Search Input */}
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Role Filter */}
      <Select value={roleFilter || ""} onValueChange={onRoleFilterChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roleOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sync Status Filter */}
      {/* <Select
        value={syncStatusFilter || "all"}
        onValueChange={onSyncStatusFilterChange}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by sync status" />
        </SelectTrigger>
        <SelectContent>
          {syncStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}

      {/* Sort By */}
      <Select value={sortBy || "createdAt"} onValueChange={onSortByChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Order */}
      <Select value={sortOrder || "desc"} onValueChange={onSortOrderChange}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Asc</SelectItem>
          <SelectItem value="desc">Desc</SelectItem>
        </SelectContent>
      </Select>

      {/* Compact Sync Status */}
      {/* {syncSummary && syncSummary.totalUsers > 0 && (
        <div className="flex items-center gap-2">
          <Badge
            variant={syncSummary.unsyncedUsers === 0 ? "default" : "secondary"}
            className="gap-1"
          >
            {syncSummary.unsyncedUsers === 0 ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {syncSummary.unsyncedUsers === 0
              ? "All Synced"
              : `${syncSummary.unsyncedUsers} Unsynced`}
          </Badge>
        </div>
      )} */}
    </div>
  );
};

export default UserSearchFilters;
