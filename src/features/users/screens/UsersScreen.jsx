import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { useClerkApiClient } from "../../../utils/clerkApiClient";
import {
  showSuccess,
  showError,
  showLoading,
  updateToast,
} from "../../../utils/toast";

// Redux imports
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  setUserFilters,
  setUserPagination,
  clearUserFilters,
} from "../usersSlice";
import {
  selectUsers,
  selectUsersLoading,
  selectUsersError,
  selectUsersPagination,
  selectUsersFilters,
  selectFilteredUsers,
  selectHasNextPage,
  selectHasPreviousPage,
  selectPageInfo,
  selectRoleOptions,
  selectSortOptions,
  selectSyncStatusOptions,
  selectUsersSyncSummary,
} from "../usersSelectors";

// Component imports
import UserSearchFilters from "../components/UserSearchFilters";
import UserAdvancedModal from "../components/UserAdvancedModal";
import UserActions from "../components/UserActions";
import UserTable from "../components/UserTable";
import UserPagination from "../components/UserPagination";
import UserModals from "../components/UserModals";
import { ShimmerTable, ShimmerBase } from "../../../common/components/Shimmer";
import { ConfirmationPopup } from "../../../common/components/Popup";
import { Trash2 } from "lucide-react";

const UsersScreen = () => {
  const dispatch = useDispatch();
  const { isSignedIn, isLoaded } = useAuth();
  const apiClient = useClerkApiClient();

  // Redux state
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUsersLoading);
  const error = useSelector(selectUsersError);
  const pagination = useSelector(selectUsersPagination);
  const filters = useSelector(selectUsersFilters);
  const filteredUsers = useSelector(selectFilteredUsers);
  const hasNextPage = useSelector(selectHasNextPage);
  const hasPreviousPage = useSelector(selectHasPreviousPage);
  const pageInfo = useSelector(selectPageInfo);
  const roleOptions = useSelector(selectRoleOptions);
  const sortOptions = useSelector(selectSortOptions);
  const syncStatusOptions = useSelector(selectSyncStatusOptions);
  const usersSyncSummary = useSelector(selectUsersSyncSummary);

  // Local state
  const [selected, setSelected] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const [roleFilter, setRoleFilter] = useState(filters.role || "all");
  const [hasProfileImageFilter, setHasProfileImageFilter] = useState(
    filters.hasProfileImage
  );
  const [createdAfter, setCreatedAfter] = useState(filters.createdAfter);
  const [createdBefore, setCreatedBefore] = useState(filters.createdBefore);
  const [updatedAfter, setUpdatedAfter] = useState(filters.updatedAfter);
  const [updatedBefore, setUpdatedBefore] = useState(filters.updatedBefore);
  const [sortBy, setSortBy] = useState(filters.sortBy);
  const [sortOrder, setSortOrder] = useState(filters.sortOrder);
  const [syncStatusFilter, setSyncStatusFilter] = useState(filters.syncStatus);
  const [bulkDeleteModal, setBulkDeleteModal] = useState({
    open: false,
    count: 0,
  });
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  // Fetch users on component mount and filter changes
  useEffect(() => {
    // Only fetch users if auth is ready and user is signed in
    if (isLoaded && isSignedIn) {
      dispatch(
        fetchUsers({
          page: pagination.page,
          pageSize: pagination.pageSize,
          search: filters.search,
          role: filters.role === "all" ? undefined : filters.role,
          hasProfileImage: filters.hasProfileImage,
          createdAfter: filters.createdAfter,
          createdBefore: filters.createdBefore,
          updatedAfter: filters.updatedAfter,
          updatedBefore: filters.updatedBefore,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          syncStatus: filters.syncStatus,
          apiClient, // Pass the API client
        })
      );
    }
  }, [
    dispatch,
    isLoaded, // Add isLoaded dependency
    isSignedIn,
    pagination.page,
    pagination.pageSize,
    filters.search,
    filters.role,
    filters.hasProfileImage,
    filters.createdAfter,
    filters.createdBefore,
    filters.updatedAfter,
    filters.updatedBefore,
    filters.sortBy,
    filters.sortOrder,
    filters.syncStatus,
    apiClient, // Now stable reference due to useMemo in useClerkApiClient
  ]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setUserFilters({ search: searchTerm }));
        dispatch(setUserPagination({ page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, dispatch, filters.search]);

  // Handle role filter
  const handleRoleFilter = (role) => {
    setRoleFilter(role);
    const actualRole = role === "all" ? undefined : role;
    dispatch(setUserFilters({ role: actualRole }));
    dispatch(setUserPagination({ page: 1 }));
  };

  // Handle profile image filter
  const handleProfileImageFilter = (checked) => {
    setHasProfileImageFilter(checked);
    dispatch(setUserFilters({ hasProfileImage: checked }));
    dispatch(setUserPagination({ page: 1 }));
  };

  // Handle date filters
  const handleDateFilter = (field, value) => {
    dispatch(setUserFilters({ [field]: value }));
    dispatch(setUserPagination({ page: 1 }));
  };

  // Handle sort changes
  const handleSortChange = (field, value) => {
    dispatch(setUserFilters({ [field]: value }));
    dispatch(setUserPagination({ page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setUserPagination({ page: newPage }));
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    dispatch(setUserPagination({ page: 1, pageSize: newPageSize }));
  };

  // Handle user deletion
  const handleDeleteUser = async (user) => {
    try {
      await dispatch(deleteUser({ userId: user.id, apiClient })).unwrap();
      // Remove from selected if it was selected
      setSelected((prev) => prev.filter((id) => id !== user.id));
      // Show success message
      showSuccess(
        `User ${
          user.clerkUser?.firstName || user.localUser?.firstName
        } deleted successfully`
      );
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Show error message
      showError(`Failed to delete user: ${error.message || "Unknown error"}`);
    }
  };

  // Handle select all/individual
  const toggleSelectAll = () => {
    setSelected(
      filteredUsers.length > 0 && selected.length === filteredUsers.length
        ? []
        : filteredUsers.map((u) => u.id)
    );
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Handle bulk actions
  const handleBulkDelete = () => {
    if (selected.length > 0) {
      setBulkDeleteModal({
        open: true,
        count: selected.length,
      });
    }
  };

  // Handle bulk delete confirmation
  const handleBulkDeleteConfirm = async () => {
    setBulkDeleteLoading(true);
    try {
      for (const userId of selected) {
        await dispatch(deleteUser({ userId, apiClient }));
      }
      setSelected([]);
      setBulkDeleteModal({ open: false, count: 0 });
      // Refresh users after bulk deletion
      dispatch(
        fetchUsers({
          page: pagination.page,
          pageSize: pagination.pageSize,
          search: filters.search,
          role: filters.role === "all" ? undefined : filters.role,
          hasProfileImage: filters.hasProfileImage,
          createdAfter: filters.createdAfter,
          createdBefore: filters.createdBefore,
          updatedAfter: filters.updatedAfter,
          updatedBefore: filters.updatedBefore,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          syncStatus: filters.syncStatus,
        })
      );
      showSuccess(`Successfully deleted ${bulkDeleteModal.count} users`);
    } catch (error) {
      showError("Failed to delete some users");
    } finally {
      setBulkDeleteLoading(false);
    }
  };

  // Handle bulk delete modal close
  const handleBulkDeleteModalClose = () => {
    setBulkDeleteModal({ open: false, count: 0 });
  };

  // Handle export
  const handleExport = () => {
    const selectedUsers = filteredUsers.filter((user) =>
      selected.includes(user.id)
    );
    const csvContent = [
      ["Name", "Email", "Role", "Phone", "Created"],
      ...selectedUsers.map((user) => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        user.phone || "N/A",
        new Date(user.createdAt).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Handle user actions
  const handleEditUser = (user) => {
    setEditUser(user);
    setEditOpen(true);
  };

  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearUserFilters());
    setSearchTerm("");
    setRoleFilter("all");
    setHasProfileImageFilter(undefined);
    setCreatedAfter("");
    setCreatedBefore("");
    setUpdatedAfter("");
    setUpdatedBefore("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setSyncStatusFilter("all");
  };

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Users</h1>

        {/* Search and Basic Filters */}
        <UserSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          roleFilter={roleFilter}
          onRoleFilterChange={handleRoleFilter}
          sortBy={sortBy}
          onSortByChange={(value) => handleSortChange("sortBy", value)}
          sortOrder={sortOrder}
          onSortOrderChange={(value) => handleSortChange("sortOrder", value)}
          roleOptions={roleOptions}
          sortOptions={sortOptions}
          syncStatusFilter={syncStatusFilter}
          onSyncStatusFilterChange={setSyncStatusFilter}
          syncStatusOptions={syncStatusOptions}
          syncSummary={usersSyncSummary}
        />

        {/* Advanced Filters & Sync Modal */}
        <div className="mb-6">
          <UserAdvancedModal
            hasProfileImageFilter={hasProfileImageFilter}
            onProfileImageFilterChange={handleProfileImageFilter}
            createdAfter={createdAfter}
            onCreatedAfterChange={(value) =>
              handleDateFilter("createdAfter", value)
            }
            createdBefore={createdBefore}
            onCreatedBeforeChange={(value) =>
              handleDateFilter("createdBefore", value)
            }
            updatedAfter={updatedAfter}
            onUpdatedAfterChange={(value) =>
              handleDateFilter("updatedAfter", value)
            }
            updatedBefore={updatedBefore}
            onUpdatedBeforeChange={(value) =>
              handleDateFilter("updatedBefore", value)
            }
            onClearFilters={handleClearFilters}
            apiClient={apiClient}
          />
        </div>

        {/* Actions */}
        <UserActions
          onAddUser={() => setAddOpen(true)}
          onBulkDelete={handleBulkDelete}
          onExport={handleExport}
          selectedCount={selected.length}
        />

        {/* Shimmer Table */}
        <ShimmerTable rows={8} columns={8} />

        {/* Pagination Shimmer */}
        <div className="flex items-center justify-between mt-4">
          <ShimmerBase className="h-4 w-32" />
          <div className="flex gap-2">
            <ShimmerBase className="h-8 w-8 rounded" />
            <ShimmerBase className="h-8 w-8 rounded" />
            <ShimmerBase className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Token loading state
  if (!isLoaded) {
    return (
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navyblue"></div>
          <span className="ml-2">Loading authentication...</span>
        </div>
      </div>
    );
  }

  // No token state
  if (!isSignedIn) {
    return (
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">
              No authentication token available
            </p>
            <p className="text-gray-600">Please log in to continue</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error loading users: {error}</p>
            <Button
              onClick={() =>
                dispatch(
                  fetchUsers({
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    search: filters.search,
                    role: filters.role === "all" ? undefined : filters.role,
                    hasProfileImage: filters.hasProfileImage,
                    createdAfter: filters.createdAfter,
                    createdBefore: filters.createdBefore,
                    updatedAfter: filters.updatedAfter,
                    updatedBefore: filters.updatedBefore,
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder,
                    syncStatus: filters.syncStatus,
                    apiClient,
                  })
                )
              }
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Search and Basic Filters */}
      <UserSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilter}
        sortBy={sortBy}
        onSortByChange={(value) => handleSortChange("sortBy", value)}
        sortOrder={sortOrder}
        onSortOrderChange={(value) => handleSortChange("sortOrder", value)}
        roleOptions={roleOptions}
        sortOptions={sortOptions}
        syncStatusFilter={syncStatusFilter}
        onSyncStatusFilterChange={setSyncStatusFilter}
        syncStatusOptions={syncStatusOptions}
        syncSummary={usersSyncSummary}
      />

      {/* Advanced Filters & Sync Modal */}
      <div className="mb-6">
        <UserAdvancedModal
          hasProfileImageFilter={hasProfileImageFilter}
          onProfileImageFilterChange={handleProfileImageFilter}
          createdAfter={createdAfter}
          onCreatedAfterChange={(value) =>
            handleDateFilter("createdAfter", value)
          }
          createdBefore={createdBefore}
          onCreatedBeforeChange={(value) =>
            handleDateFilter("createdBefore", value)
          }
          updatedAfter={updatedAfter}
          onUpdatedAfterChange={(value) =>
            handleDateFilter("updatedAfter", value)
          }
          updatedBefore={updatedBefore}
          onUpdatedBeforeChange={(value) =>
            handleDateFilter("updatedBefore", value)
          }
          onClearFilters={handleClearFilters}
          apiClient={apiClient}
        />
      </div>

      {/* Actions */}
      <UserActions
        onAddUser={() => setAddOpen(true)}
        onBulkDelete={handleBulkDelete}
        onExport={handleExport}
        selectedCount={selected.length}
      />

      {/* Table */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        selected={selected}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
      />

      {/* Pagination */}
      <UserPagination
        pagination={pagination}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageInfo={pageInfo}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />

      {/* Modals */}
      <UserModals
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        editUser={editUser}
        roleOptions={roleOptions}
        apiClient={apiClient}
      />

      {/* Bulk Delete Confirmation Modal */}
      <ConfirmationPopup
        isOpen={bulkDeleteModal.open}
        onClose={handleBulkDeleteModalClose}
        onConfirm={handleBulkDeleteConfirm}
        title="Confirm Bulk Deletion"
        description={`Are you sure you want to delete ${bulkDeleteModal.count} selected users? This action cannot be undone.`}
        confirmText={`Delete ${bulkDeleteModal.count} Users`}
        cancelText="Cancel"
        variant="danger"
        icon={Trash2}
        isLoading={bulkDeleteLoading}
      />
    </div>
  );
};

export default UsersScreen;
