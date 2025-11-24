import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import AddButton from "@/components/AddButton";
import {
  fetchConditions,
  reorderConditions,
  toggleConditionActive,
  createCondition,
  updateCondition,
  deleteCondition,
  setConditionsLocale,
  setActiveFilter,
  setRequiredFilter,
  setSort,
} from "../conditionsSlice";
import {
  selectConditionsLoading,
  selectConditionsError,
  selectConditionsFilters,
  selectConditionsTotalCount,
  selectFilteredConditions,
} from "../conditionsSelectors";
import { showError, showSuccess } from "../../../utils/toast";
import { Spinner } from "@/common/components/spinner";
import ConditionFilters from "../components/ConditionFilters";
import ConditionItem from "../components/ConditionItem";
import ConditionForm from "../components/ConditionForm";
import ConfirmationPopup from "@/common/components/Popup/ConfirmationPopup";
import { Trash2 } from "lucide-react";

export default function Conditions() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const loading = useSelector(selectConditionsLoading);
  const error = useSelector(selectConditionsError);
  const filters = useSelector(selectConditionsFilters);
  const totalCount = useSelector(selectConditionsTotalCount);
  const filteredConditions = useSelector(selectFilteredConditions);

  // Local state
  const [addOpen, setAddOpen] = useState(false);
  const [btnOpen, setBtnOpen] = useState(false);
  const [condition, setCondition] = useState({
    id: null,
    name: "",
    displayName: "",
    description: "",
    displayNameAr: "",
    descriptionAr: "",
    isActive: true,
    isRequired: false,
  });

  // Drag and drop state
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [orderedConditions, setOrderedConditions] = useState([]);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    condition: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // AR toggle state (locale)
  const isArabic = filters.locale === "ar";

  // Fetch conditions on mount and when filters change
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(
        fetchConditions({
          apiClient,
          isActive: filters.isActive,
          isRequired: filters.isRequired,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          search: filters.search && filters.search.trim() ? filters.search.trim() : undefined,
        })
      );
    }
  }, [
    dispatch,
    isLoaded,
    isSignedIn,
    apiClient,
    filters.isActive,
    filters.isRequired,
    filters.sortBy,
    filters.sortOrder,
    filters.search,
  ]);

  // Sync orderedConditions with filteredConditions when filters change or data loads
  // Also sync when Redux updates (for toggle active)
  useEffect(() => {
    if (!isDragging) {
      setOrderedConditions((prev) => {
        // If no previous order, use filtered conditions
        if (prev.length === 0) {
          return filteredConditions;
        }
        
        // Remove items that are no longer in filteredConditions (e.g., deleted items)
        const filteredIds = new Set(filteredConditions.map((c) => c.id));
        const remaining = prev.filter((c) => filteredIds.has(c.id));
        
        // Merge Redux updates into local ordered state while preserving order
        const merged = remaining.map((localCondition) => {
          const reduxCondition = filteredConditions.find(
            (c) => c.id === localCondition.id
          );
          // Use Redux data if available, otherwise keep local
          return reduxCondition ? { ...localCondition, ...reduxCondition } : localCondition;
        });
        
        // Add any new items from filteredConditions that aren't in the ordered list
        const existingIds = new Set(merged.map((c) => c.id));
        const newItems = filteredConditions.filter((c) => !existingIds.has(c.id));
        
        return [...merged, ...newItems];
      });
    }
  }, [filteredConditions, isDragging]);

  // Handle AR toggle
  const handleLocaleToggle = (checked) => {
    dispatch(setConditionsLocale(checked ? "ar" : "en"));
  };

  // Handle active filter
  const handleActiveFilterChange = (value) => {
    const filterValue =
      value === "all" ? undefined : value === "active" ? true : false;
    dispatch(setActiveFilter(filterValue));
  };

  // Handle required filter
  const handleRequiredFilterChange = (value) => {
    const filterValue =
      value === "all" ? undefined : value === "required" ? true : false;
    dispatch(setRequiredFilter(filterValue));
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortOrder) => {
    dispatch(setSort({ sortBy, sortOrder }));
  };

  // Handle toggle active status - optimistic update (like room types)
  const handleToggleActive = useCallback(
    (conditionId, nextStatus) => {
      if (!apiClient?.conditions) {
        return;
      }

      // Store previous state for potential revert
      const currentCondition = (
        orderedConditions.length ? orderedConditions : filteredConditions
      ).find((c) => c.id === conditionId);
      const previousStatus = currentCondition?.isActive;

      // Optimistic update: trust this is correct, API will succeed
      setOrderedConditions((prev) => {
        const base = prev && prev.length ? prev : filteredConditions;
        return base.map((c) =>
          c.id === conditionId ? { ...c, isActive: nextStatus } : c
        );
      });

      // Dispatch toggle - fire and forget, handle result
      const togglePromise = dispatch(
        toggleConditionActive({
          conditionId,
          isActive: nextStatus,
          apiClient,
        })
      );

      // Check the result asynchronously
      togglePromise
        .unwrap()
        .then(() => {
          // API succeeded - Redux will update, useEffect will sync
          // No need to do anything here, the optimistic update is already applied
        })
        .catch((err) => {
          // Error - revert to previous status
          setOrderedConditions((prev) => {
            const base = prev && prev.length ? prev : filteredConditions;
            return base.map((c) =>
              c.id === conditionId
                ? { ...c, isActive: previousStatus }
                : c
            );
          });
          showError(err || "Failed to update condition status");
        });
    },
    [apiClient, dispatch, orderedConditions, filteredConditions]
  );

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e, index) => {
      const base = orderedConditions.length ? orderedConditions : filteredConditions;
      const item = base[index];

      e.dataTransfer.setData("draggedId", item.id);
      e.dataTransfer.setData("draggedIndex", String(index));
      e.dataTransfer.effectAllowed = "move";

      // Create a custom drag image
      const dragImage = e.target.cloneNode(true);
      dragImage.style.opacity = "0.5";
      document.body.appendChild(dragImage);
      dragImage.style.position = "absolute";
      dragImage.style.top = "-1000px";
      e.dataTransfer.setDragImage(dragImage, 0, 0);
      setTimeout(() => document.body.removeChild(dragImage), 0);

      setDraggingIndex(index);
      setDraggedItem(item);
      setIsDragging(true);

      // Store original order before any drag modifications
      if (!orderedConditions.length) {
        setOrderedConditions([...base]);
      }
    },
    [orderedConditions, filteredConditions]
  );

  const handleDragOver = useCallback(
    (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      if (draggingIndex === null || draggingIndex === index || !draggedItem) {
        return;
      }

      const base = orderedConditions.length ? orderedConditions : filteredConditions;

      // Find current position of dragged item
      const currentDraggedIndex = base.findIndex(
        (item) => item.id === draggedItem.id
      );
      if (currentDraggedIndex === -1 || currentDraggedIndex === index) {
        return;
      }

      const preview = [...base];

      // Remove the dragged item from its current position
      const [moved] = preview.splice(currentDraggedIndex, 1);

      // Calculate where to insert
      let insertAt = index;
      if (currentDraggedIndex < index) {
        insertAt = index - 1;
      }

      // Insert at the calculated position
      preview.splice(insertAt, 0, moved);

      setOverIndex(index);
      setOrderedConditions(preview);
    },
    [draggingIndex, draggedItem, orderedConditions, filteredConditions]
  );

  const handleDrop = useCallback(
    (e, targetIndex) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedItem) {
        setDraggingIndex(null);
        setDraggedItem(null);
        setOverIndex(null);
        setIsDragging(false);
        return;
      }

      // Use the current preview order (from handleDragOver) as it's already correct
      const current = orderedConditions.length
        ? [...orderedConditions]
        : [...filteredConditions];

      // Verify the dragged item is in the current order
      const draggedItemIndex = current.findIndex(
        (item) => item.id === draggedItem.id
      );
      if (draggedItemIndex === -1) {
        // Item not found, reset
        setDraggingIndex(null);
        setDraggedItem(null);
        setOverIndex(null);
        setIsDragging(false);
        return;
      }

      // Store previous order for potential revert (from Redux)
      const previousOrder = [...filteredConditions];

      // Check if position actually changed
      const originalIndex = previousOrder.findIndex(
        (c) => c.id === draggedItem.id
      );
      const newIndex = current.findIndex((c) => c.id === draggedItem.id);

      // If position hasn't changed, don't call API
      if (originalIndex === newIndex) {
        setDraggingIndex(null);
        setDraggedItem(null);
        setOverIndex(null);
        setIsDragging(false);
        // Reset to original order since nothing changed
        setOrderedConditions(previousOrder);
        return;
      }

      // The order is already correct from handleDragOver, just ensure it's saved
      // Compute new absolute sortOrder values
      const orders = current.map((c, idx) => ({
        id: c.id,
        sortOrder: idx + 1, // Start from 1
      }));

      if (!apiClient?.conditions) {
        showError("API client not available");
        setOrderedConditions(previousOrder); // Revert
        setDraggingIndex(null);
        setDraggedItem(null);
        setOverIndex(null);
        setIsDragging(false);
        return;
      }

      // Fire and forget - handle result asynchronously
      dispatch(reorderConditions({ orders, apiClient }))
        .then(() => {
          // Success - keep optimistic state, no toast, no refetch
          // Redux will update when it confirms, and useEffect will sync
        })
        .catch((err) => {
          // Error - revert to previous order and show toast
          setOrderedConditions(previousOrder);
          showError(err || "Failed to reorder conditions");
        });

      setDraggingIndex(null);
      setDraggedItem(null);
      setOverIndex(null);
      setIsDragging(false);
    },
    [
      draggedItem,
      orderedConditions,
      filteredConditions,
      dispatch,
      apiClient,
    ]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null);
    setDraggedItem(null);
    setOverIndex(null);
    setIsDragging(false);

    // If no optimistic reorder, sync from Redux
    if (!orderedConditions.length) {
      setOrderedConditions(filteredConditions);
    }
  }, [orderedConditions, filteredConditions]);

  const handleEdit = (condition) => {
    setAddOpen(true);
    setBtnOpen(true);
    setCondition({
      id: condition.id,
      name: condition.name || "",
      displayName: condition.displayName || "",
      description: condition.description || "",
      displayNameAr: condition.ar?.displayName || "",
      descriptionAr: condition.ar?.description || "",
      isActive: condition.isActive ?? true,
      isRequired: condition.isRequired ?? false,
    });
  };

  const handleDelete = (condition) => {
    setDeleteModal({
      open: true,
      condition,
    });
  };

  const handleDeleteModalClose = () => {
    setDeleteModal({
      open: false,
      condition: null,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.condition || !deleteModal.condition.id) {
      return;
    }

    const deletedId = deleteModal.condition.id;
    setDeleteLoading(true);
    try {
      await dispatch(
        deleteCondition({
          id: deletedId,
          apiClient,
        })
      ).unwrap();

      showSuccess("Condition deleted successfully");
      handleDeleteModalClose();

      // Immediately remove from local orderedConditions if filter excludes inactive
      if (filters.isActive === true) {
        setOrderedConditions((prev) =>
          prev.filter((c) => c.id !== deletedId)
        );
      }

      // Refresh the list to get updated data (soft delete sets isActive to false)
      // This ensures the condition is filtered out if active filter is applied
      dispatch(
        fetchConditions({
          apiClient,
          isActive: filters.isActive,
          isRequired: filters.isRequired,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        })
      );
    } catch (error) {
      console.error("Failed to delete condition:", error);
      // Error is already handled by the thunk and shown via toast
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!condition.name || !condition.displayName) {
      showError("Please fill in the name and display name fields");
      return;
    }

    // Check if we're updating or creating
    const isUpdate = btnOpen && condition.id;

    if (isUpdate) {
      // Update existing condition
      try {
        // Build update payload according to API documentation
        const updateData = {};

        // Always include name if provided (can be updated)
        if (condition.name) {
          updateData.name = condition.name.trim().toLowerCase().replace(/\s+/g, "-");
        }

        // Always send both English and Arabic fields
        if (condition.displayName) {
          updateData.displayName = condition.displayName;
        }
        if (condition.description !== undefined) {
          updateData.description = condition.description || null;
        }
        if (condition.displayNameAr) {
          updateData.displayNameAr = condition.displayNameAr;
        }
        if (condition.descriptionAr !== undefined) {
          updateData.descriptionAr = condition.descriptionAr || null;
        }

        // Include isActive and isRequired
        if (condition.isActive !== undefined) {
          updateData.isActive = condition.isActive;
        }
        if (condition.isRequired !== undefined) {
          updateData.isRequired = condition.isRequired;
        }

        // Note: sortOrder is managed separately via reorder endpoint

        await dispatch(
          updateCondition({
            id: condition.id,
            conditionData: updateData,
            apiClient,
          })
        ).unwrap();

        showSuccess("Condition updated successfully");
        handleCancel();

        // Refresh the list to get updated data
        dispatch(
          fetchConditions({
            apiClient,
            isActive: filters.isActive,
            isRequired: filters.isRequired,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
          })
        );
      } catch (error) {
        console.error("Failed to update condition:", error);
        // Error is already handled by the thunk and shown via toast
      }
    } else {
      // Create new condition
      try {
        // Build create payload - required fields: name, displayName
        const createData = {
          name: condition.name.trim().toLowerCase().replace(/\s+/g, "-"), // Ensure lowercase, no spaces
          displayName: condition.displayName,
        };

        // Add optional fields
        if (condition.description) {
          createData.description = condition.description;
        }
        if (condition.displayNameAr) {
          createData.displayNameAr = condition.displayNameAr;
        }
        if (condition.descriptionAr) {
          createData.descriptionAr = condition.descriptionAr;
        }

        // Include isActive and isRequired (with defaults)
        if (condition.isActive !== undefined) {
          createData.isActive = condition.isActive;
        } else {
          createData.isActive = true; // Default to true
        }

        if (condition.isRequired !== undefined) {
          createData.isRequired = condition.isRequired;
        } else {
          createData.isRequired = false; // Default to false
        }

        // Sort order will be set by the backend (default: 0)

        await dispatch(
          createCondition({
            conditionData: createData,
            apiClient,
          })
        ).unwrap();

        showSuccess("Condition created successfully");
        handleCancel();

        // Refresh the list to show the new condition
        dispatch(
          fetchConditions({
            apiClient,
            isActive: filters.isActive,
            isRequired: filters.isRequired,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
          })
        );
      } catch (error) {
        console.error("Failed to create condition:", error);
        // Error is already handled by the thunk and shown via toast
      }
    }
  };

  const handleCancel = () => {
    setAddOpen(false);
    setBtnOpen(false);
    setCondition({
      id: null,
      name: "",
      displayName: "",
      description: "",
      displayNameAr: "",
      descriptionAr: "",
      isActive: true,
      isRequired: false,
    });
  };

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  if (!isLoaded) return <Spinner />;
  if (!isSignedIn) return <div>Please sign in.</div>;

  const displayConditions = orderedConditions.length
    ? orderedConditions
    : filteredConditions;

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Conditions</h1>
        <div className="flex items-center gap-4">
          {/* AR Toggle */}
          <div className="flex items-center gap-2">
            <Label htmlFor="ar-toggle-conditions" className="text-sm">
              English
            </Label>
            <Switch
              id="ar-toggle-conditions"
              checked={isArabic}
              onCheckedChange={handleLocaleToggle}
            />
            <Label htmlFor="ar-toggle-conditions" className="text-sm">
              Arabic
            </Label>
          </div>
          <AddButton
            buttonValue="Add Condition"
            onAdd={() => {
              setAddOpen(true);
              setBtnOpen(false);
              setCondition({
                id: null,
                name: "",
                displayName: "",
                description: "",
                displayNameAr: "",
                descriptionAr: "",
                isActive: true,
                isRequired: false,
              });
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <ConditionFilters
        filters={filters}
        onActiveFilterChange={handleActiveFilterChange}
        onRequiredFilterChange={handleRequiredFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-red-500 text-center py-4">{error}</div>
      )}

      {/* Conditions List */}
      {!loading && !error && (
        <div className="mt-4 rounded-2xl">
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredConditions.length} of {totalCount} conditions
          </div>
          {filteredConditions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No conditions found
            </div>
          ) : (
            displayConditions.map((condition, index) => {
              const isDraggedItem = draggedItem?.id === condition.id;
              const isDropTarget =
                isDragging && overIndex === index && draggingIndex !== index;

              return (
                <ConditionItem
                  key={condition.id}
                  condition={condition}
                  index={index}
                  isArabic={isArabic}
                  isDraggedItem={isDraggedItem}
                  isDropTarget={isDropTarget}
                  isDragging={isDragging}
                  draggingIndex={draggingIndex}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  onToggleActive={handleToggleActive}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  loading={loading}
                />
              );
            })
          )}
        </div>
      )}

      {/* Add/Edit Condition Form */}
      <ConditionForm
        isOpen={addOpen}
        onClose={handleCancel}
        condition={condition}
        onConditionChange={setCondition}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isUpdate={btnOpen}
        loading={loading}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationPopup
        isOpen={deleteModal.open}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Condition"
        description={
          deleteModal.condition
            ? `Are you sure you want to delete the condition "${
                isArabic
                  ? deleteModal.condition.ar?.displayName ||
                    deleteModal.condition.displayName
                  : deleteModal.condition.displayName
              }"? This action cannot be undone.`
            : "Are you sure you want to delete this condition? This action cannot be undone."
        }
        confirmText="Delete Condition"
        cancelText="Cancel"
        variant="danger"
        icon={Trash2}
        isLoading={deleteLoading}
      />
    </div>
  );
}
