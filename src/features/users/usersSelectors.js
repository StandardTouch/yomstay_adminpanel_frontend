import { createSelector } from "@reduxjs/toolkit";

export const selectUsersState = (state) => state.users;
export const selectUsers = (state) => state.users.users;
export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;
export const selectUsersPagination = (state) => state.users.pagination;
export const selectUsersFilters = (state) => state.users.filters;
export const selectUsersSyncSummary = (state) => state.users.syncSummary;
export const selectUsersSyncLoading = (state) => state.users.syncLoading;
export const selectUsersSyncError = (state) => state.users.syncError;
export const selectUsersLastSyncResult = (state) => state.users.lastSyncResult;

// Individual filter selectors
export const selectUsersSearchFilter = (state) => state.users.filters.search;
export const selectUsersRoleFilter = (state) => state.users.filters.role;
export const selectUsersHasProfileImageFilter = (state) =>
  state.users.filters.hasProfileImage;
export const selectUsersCreatedAfterFilter = (state) =>
  state.users.filters.createdAfter;
export const selectUsersCreatedBeforeFilter = (state) =>
  state.users.filters.createdBefore;
export const selectUsersUpdatedAfterFilter = (state) =>
  state.users.filters.updatedAfter;
export const selectUsersUpdatedBeforeFilter = (state) =>
  state.users.filters.updatedBefore;
export const selectUsersSortByFilter = (state) => state.users.filters.sortBy;
export const selectUsersSortOrderFilter = (state) =>
  state.users.filters.sortOrder;
export const selectUsersSyncStatusFilter = (state) =>
  state.users.filters.syncStatus;

// Memoized filtered users selector - updated for new data structure
export const selectFilteredUsers = createSelector(
  [
    selectUsers,
    selectUsersSearchFilter,
    selectUsersRoleFilter,
    selectUsersHasProfileImageFilter,
    selectUsersSyncStatusFilter,
  ],
  (
    users,
    searchFilter,
    roleFilter,
    hasProfileImageFilter,
    syncStatusFilter
  ) => {
    let filteredUsers = users;

    // Filter by role (check only clerkUser role)
    if (roleFilter && roleFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => {
        const clerkRole = user.clerkUser?.publicMetadata?.role;
        return clerkRole === roleFilter;
      });
    }

    // Filter by profile image (check localUser)
    if (hasProfileImageFilter !== undefined) {
      filteredUsers = filteredUsers.filter((user) => {
        const hasImage = !!user.localUser?.profileImageUrl;
        return hasProfileImageFilter === hasImage;
      });
    }

    // Filter by sync status
    if (syncStatusFilter && syncStatusFilter !== "all") {
      filteredUsers = filteredUsers.filter((user) => {
        if (syncStatusFilter === "synced") return user.isSynced;
        if (syncStatusFilter === "unsynced") return !user.isSynced;
        return true;
      });
    }

    // Filter by search term (prioritize clerkUser data)
    if (searchFilter) {
      const searchTerm = searchFilter.toLowerCase();
      filteredUsers = filteredUsers.filter((user) => {
        const clerkUser = user.clerkUser;
        const localUser = user.localUser;

        return (
          // Primary search on Clerk user data
          clerkUser?.firstName?.toLowerCase().includes(searchTerm) ||
          clerkUser?.lastName?.toLowerCase().includes(searchTerm) ||
          clerkUser?.email?.toLowerCase().includes(searchTerm) ||
          // Fallback to local user data
          localUser?.firstName?.toLowerCase().includes(searchTerm) ||
          localUser?.lastName?.toLowerCase().includes(searchTerm) ||
          localUser?.email?.toLowerCase().includes(searchTerm)
        );
      });
    }

    return filteredUsers;
  }
);

// Pagination helpers
export const selectHasNextPage = createSelector(
  [selectUsersPagination],
  (pagination) => pagination.page < pagination.totalPages
);

export const selectHasPreviousPage = createSelector(
  [selectUsersPagination],
  (pagination) => pagination.page > 1
);

export const selectPageInfo = createSelector(
  [selectUsersPagination],
  (pagination) => ({
    startItem: (pagination.page - 1) * pagination.pageSize + 1,
    endItem: Math.min(pagination.page * pagination.pageSize, pagination.total),
    total: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
  })
);

// Role options for the filter dropdown
export const selectRoleOptions = () => [
  { value: "admin", label: "Admin" },
  { value: "hotelOwner", label: "Hotel Owner" },
  { value: "hotelStaff", label: "Hotel Staff" },
  { value: "customer", label: "Customer" },
];

// Sort options for the sort dropdown
export const selectSortOptions = () => [
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Updated Date" },
  { value: "firstName", label: "First Name" },
  { value: "lastName", label: "Last Name" },
  { value: "email", label: "Email" },
  { value: "role", label: "Role" },
];

// Sync status options for the filter dropdown
export const selectSyncStatusOptions = () => [
  { value: "all", label: "All Users" },
  { value: "synced", label: "Synced" },
  { value: "unsynced", label: "Unsynced" },
];
