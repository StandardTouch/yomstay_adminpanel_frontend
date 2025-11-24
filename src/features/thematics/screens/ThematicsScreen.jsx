import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Edit, Trash2 } from "lucide-react";
import {
  fetchThematics,
  createThematic,
  updateThematic,
  deleteThematic,
  setThematicsLocale,
  setThematicsSearch,
  setThematicsPage,
  setThematicsLimit,
} from "../thematicsSlice";
import ConfirmationPopup from "@/common/components/Popup/ConfirmationPopup";
import AddButton from "@/components/AddButton";
import {
  selectThematics,
  selectThematicsLoading,
  selectThematicsError,
  selectThematicsFilters,
  selectThematicsPagination,
  selectThematicsWithLocale,
} from "../thematicsSelectors";
import { showError, showSuccess } from "../../../utils/toast";
import { Spinner } from "@/common/components/spinner";

export default function ThematicsScreen() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const thematics = useSelector(selectThematics);
  const loading = useSelector(selectThematicsLoading);
  const error = useSelector(selectThematicsError);
  const filters = useSelector(selectThematicsFilters);
  const pagination = useSelector(selectThematicsPagination);
  const thematicsWithLocale = useSelector(selectThematicsWithLocale);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingThematic, setEditingThematic] = useState(null);
  const [thematicForm, setThematicForm] = useState({
    name: "",
    displayName: "",
    displayNameAr: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    thematic: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // AR toggle state (locale)
  const isArabic = filters.locale === "ar";

  // Fetch thematics on mount and when filters change
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(
        fetchThematics({
          apiClient,
          page: filters.page,
          limit: filters.limit,
          search: searchTerm && searchTerm.trim() ? searchTerm.trim() : undefined,
        })
      );
    }
  }, [
    dispatch,
    isLoaded,
    isSignedIn,
    apiClient,
    filters.page,
    filters.limit,
    searchTerm,
  ]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setThematicsSearch(searchTerm || undefined));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, dispatch]);

  // Handle AR toggle
  const handleLocaleToggle = (checked) => {
    dispatch(setThematicsLocale(checked ? "ar" : "en"));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setThematicsPage(newPage));
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    dispatch(setThematicsLimit(newLimit));
  };

  // Display error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Handle add button click
  const handleAddClick = () => {
    setIsEditing(false);
    setEditingThematic(null);
    setThematicForm({
      name: "",
      displayName: "",
      displayNameAr: "",
    });
    setSheetOpen(true);
  };

  // Handle edit button click
  const handleEditClick = (thematic) => {
    setIsEditing(true);
    setEditingThematic(thematic);
    setThematicForm({
      name: thematic.name || "",
      displayName: thematic.displayName || "",
      displayNameAr: thematic.ar?.displayName || "",
    });
    setSheetOpen(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setSheetOpen(false);
    setIsEditing(false);
    setEditingThematic(null);
    setThematicForm({
      name: "",
      displayName: "",
      displayNameAr: "",
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!thematicForm.name || !thematicForm.displayName) {
      showError("Name and display name are required");
      return;
    }

    setSubmitLoading(true);
    try {
      if (isEditing && editingThematic) {
        // Update existing thematic
        await dispatch(
          updateThematic({
            id: editingThematic.id,
            thematicData: {
              name: thematicForm.name,
              displayName: thematicForm.displayName,
              displayNameAr: thematicForm.displayNameAr || undefined,
            },
            locale: undefined, // Use displayNameAr instead of locale query param
            apiClient,
          })
        ).unwrap();

        showSuccess("Thematic updated successfully");
      } else {
        // Create new thematic
        await dispatch(
          createThematic({
            thematicData: {
              name: thematicForm.name,
              displayName: thematicForm.displayName,
              displayNameAr: thematicForm.displayNameAr || undefined,
            },
            locale: undefined, // Use displayNameAr instead of locale query param
            apiClient,
          })
        ).unwrap();

        showSuccess("Thematic created successfully");
      }

      handleFormClose();

      // Refresh the list
      dispatch(
        fetchThematics({
          apiClient,
          page: filters.page,
          limit: filters.limit,
          search: searchTerm && searchTerm.trim() ? searchTerm.trim() : undefined,
        })
      );
    } catch (error) {
      console.error(`Failed to ${isEditing ? "update" : "create"} thematic:`, error);
      // Error is already handled by the thunk and shown via toast
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (thematic) => {
    setDeleteModal({
      open: true,
      thematic,
    });
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setDeleteModal({
      open: false,
      thematic: null,
    });
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deleteModal.thematic || !deleteModal.thematic.id) {
      return;
    }

    setDeleteLoading(true);
    try {
      await dispatch(
        deleteThematic({
          id: deleteModal.thematic.id,
          apiClient,
        })
      ).unwrap();

      showSuccess("Thematic deleted successfully");
      handleDeleteModalClose();

      // Refresh the list
      dispatch(
        fetchThematics({
          apiClient,
          page: filters.page,
          limit: filters.limit,
          search: searchTerm && searchTerm.trim() ? searchTerm.trim() : undefined,
        })
      );
    } catch (error) {
      console.error("Failed to delete thematic:", error);
      // Error is already handled by the thunk and shown via toast
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Thematics</h1>
        <div className="flex items-center gap-4">
          {/* AR Toggle */}
          <div className="flex items-center gap-2">
            <Label htmlFor="ar-toggle" className="text-sm">
              AR
            </Label>
            <Switch
              id="ar-toggle"
              checked={isArabic}
              onCheckedChange={handleLocaleToggle}
            />
          </div>
          {/* Add Button */}
          <AddButton
            buttonValue="Add Thematic"
            onAdd={handleAddClick}
          />
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search thematics by name or display name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8 text-red-500">
          <p>Failed to load thematics. Please try again.</p>
        </div>
      )}

      {/* Thematics Grid */}
      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {thematicsWithLocale.map((thematic) => (
              <Card key={thematic.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {thematic.displayName || thematic.name}
                      </CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(thematic)}
                        className="ml-2"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(thematic)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {thematic.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {thematicsWithLocale.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No thematics found.</p>
              {searchTerm && (
                <p className="text-sm mt-2">
                  Try adjusting your search terms.
                </p>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} thematics
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="limit-select" className="text-sm">
                  Per page:
                </Label>
                <select
                  id="limit-select"
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="p-6">
          <SheetHeader className="mb-6">
            <SheetTitle>
              {isEditing ? "Edit Thematic" : "Add New Thematic"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update the thematic details. You can provide both English and Arabic translations."
                : "Create a new thematic. You can provide both English and Arabic translations."}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={thematicForm.name}
                onChange={(e) =>
                  setThematicForm({ ...thematicForm, name: e.target.value })
                }
                placeholder="e.g., luxury"
                required
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier for the thematic
              </p>
            </div>

            {/* Display Name (English) */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name (English) *</Label>
              <Input
                id="displayName"
                value={thematicForm.displayName}
                onChange={(e) =>
                  setThematicForm({ ...thematicForm, displayName: e.target.value })
                }
                placeholder="e.g., Luxury"
                required
                dir="ltr"
              />
            </div>

            {/* Display Name (Arabic) */}
            <div className="space-y-2">
              <Label htmlFor="displayNameAr">Display Name (Arabic)</Label>
              <Input
                id="displayNameAr"
                value={thematicForm.displayNameAr}
                onChange={(e) =>
                  setThematicForm({ ...thematicForm, displayNameAr: e.target.value })
                }
                placeholder="e.g., فاخر"
                dir="rtl"
              />
            </div>

            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleFormClose}
                disabled={submitLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Thematic"
                  : "Create Thematic"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={deleteModal.open}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Thematic"
        description={
          deleteModal.thematic
            ? `Are you sure you want to delete the thematic "${deleteModal.thematic.displayName || deleteModal.thematic.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this thematic? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={Trash2}
        isLoading={deleteLoading}
      />
    </div>
  );
}

