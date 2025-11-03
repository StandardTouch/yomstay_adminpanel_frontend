import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import {
  fetchRoomTypes,
  createRoomType as createRoomTypeAction,
  updateRoomType as updateRoomTypeAction,
  reorderRoomTypes as reorderRoomTypesAction,
  toggleRoomTypeActive as toggleRoomTypeActiveAction,
  deleteRoomType as deleteRoomTypeAction,
  setFilters,
  clearError,
  clearUpdateError,
  clearCreateError,
} from "../roomTypesSlice";
import {
  selectRoomTypes,
  selectRoomTypesLoading,
  selectRoomTypesError,
  selectRoomTypesPagination,
  selectRoomTypesFilters,
  selectRoomTypesSortedByOrder,
  selectRoomTypesUpdating,
  selectRoomTypesUpdateError,
  selectRoomTypesCreating,
  selectRoomTypesCreateError,
  selectRoomTypesDeletingIds,
  selectRoomTypesDeleteError,
  selectRoomTypesReordering,
  selectRoomTypesReorderError,
  selectRoomTypesTogglingIds,
  selectRoomTypesToggleError,
} from "../roomTypesSelectors";
import { showSuccess, showError } from "../../../utils/toast";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accessibility,
  Bed,
  BedDouble,
  Briefcase,
  Building,
  Crown,
  Link,
  SquarePen,
  Users,
  Loader2,
  Search,
} from "lucide-react";
import { Spinner } from "../../../common/components/spinner";

export default function RoomType() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const roomTypes = useSelector(selectRoomTypesSortedByOrder);
  const loading = useSelector(selectRoomTypesLoading);
  const error = useSelector(selectRoomTypesError);
  const pagination = useSelector(selectRoomTypesPagination);
  const filters = useSelector(selectRoomTypesFilters);
  const updating = useSelector(selectRoomTypesUpdating);
  const updateError = useSelector(selectRoomTypesUpdateError);
  const creating = useSelector(selectRoomTypesCreating);
  const createError = useSelector(selectRoomTypesCreateError);
  const deletingIds = useSelector(selectRoomTypesDeletingIds);
  const deleteError = useSelector(selectRoomTypesDeleteError);
  const reordering = useSelector(selectRoomTypesReordering);
  const reorderError = useSelector(selectRoomTypesReorderError);
  const togglingIds = useSelector(selectRoomTypesTogglingIds);
  const toggleError = useSelector(selectRoomTypesToggleError);

  // Local UI state
  const [addOpen, setAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [newRoomData, setNewRoomData] = useState({
    id: Math.random().toString(),
    name: "",
    displayName: "",
    description: "",
    icon: "",
    isActive: false,
    sortOrder: 0,
  });
  // Drag & drop local state for responsive visuals
  const [orderedRoomTypes, setOrderedRoomTypes] = useState([]);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  // Track optimistically updated room types - trust these until error
  const [optimisticUpdates, setOptimisticUpdates] = useState({});
  // Track if we have an optimistic reorder in progress
  const [optimisticReorder, setOptimisticReorder] = useState(null);

  // Sync from Redux, but always preserve optimistic updates
  // Also auto-remove optimistic updates when Redux confirms the value
  useEffect(() => {
    if (!isDragging) {
      setOrderedRoomTypes((prev) => {
        // If we have an optimistic reorder in progress, check if Redux has caught up
        if (optimisticReorder) {
          // Check if Redux order matches our optimistic order (by comparing IDs in sequence)
          const reduxIds = roomTypes.map((rt) => rt.id).join(",");
          const optimisticIds = optimisticReorder.map((rt) => rt.id).join(",");

          // If Redux order matches optimistic, remove the optimistic reorder tracking
          if (reduxIds === optimisticIds) {
            setOptimisticReorder(null);
          } else {
            // Still waiting for Redux to update, keep optimistic order
            return optimisticReorder.map((rt) => {
              if (optimisticUpdates[rt.id]) {
                return { ...rt, isActive: optimisticUpdates[rt.id].isActive };
              }
              return rt;
            });
          }
        }

        // Start with Redux state (source of truth)
        const base = [...roomTypes];

        // Apply optimistic updates on top (these override Redux until confirmed)
        // Also check if we can remove optimistic updates that match Redux
        const updatedOptimistic = { ...optimisticUpdates };
        base.forEach((rt) => {
          if (
            optimisticUpdates[rt.id] &&
            rt.isActive === optimisticUpdates[rt.id].isActive
          ) {
            // Redux now has the correct value, remove from optimistic tracking
            delete updatedOptimistic[rt.id];
          }
        });

        // Update optimistic tracking if any were removed
        if (
          Object.keys(updatedOptimistic).length !==
          Object.keys(optimisticUpdates).length
        ) {
          setOptimisticUpdates(updatedOptimistic);
        }

        return base.map((rt) => {
          if (optimisticUpdates[rt.id]) {
            return { ...rt, isActive: optimisticUpdates[rt.id].isActive };
          }
          return rt;
        });
      });
    }
  }, [roomTypes, isDragging, optimisticUpdates, optimisticReorder]);

  // Icon options for selection (React components for UI)
  const iconOptions = useMemo(
    () => [
      { key: "bed", component: <Bed />, emoji: "🛏️" },
      { key: "bedDouble", component: <BedDouble />, emoji: "🛏️🛏️" },
      { key: "building", component: <Building />, emoji: "🏢" },
      { key: "briefcase", component: <Briefcase />, emoji: "💼" },
      { key: "crown", component: <Crown />, emoji: "👑" },
      { key: "users", component: <Users />, emoji: "👥" },
      { key: "link", component: <Link />, emoji: "🔗" },
      { key: "accessibility", component: <Accessibility />, emoji: "♿" },
    ],
    []
  );

  // Helper to render icon
  // API returns icon as string (emoji), but we also support React components for editing
  const renderIcon = useCallback(
    (icon) => {
      if (!icon) {
        return <Bed className="w-5 h-5 text-muted-foreground" />;
      }

      // If it's a React component (when editing locally)
      if (typeof icon === "object" && React.isValidElement(icon)) {
        return <span className="text-2xl">{icon}</span>;
      }

      // If it's a string from API (emoji or key name)
      if (typeof icon === "string") {
        // Check if it's an emoji (Unicode range check)
        if (
          /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
            icon
          )
        ) {
          return <span className="text-2xl">{icon}</span>;
        }
        // If it's a key name, find matching icon option
        const iconOption = iconOptions.find(
          (opt) => opt.key === icon.toLowerCase()
        );
        if (iconOption) {
          return <span>{iconOption.component}</span>;
        }
      }

      return <Bed className="w-5 h-5 text-muted-foreground" />;
    },
    [iconOptions]
  );

  // Memoized API parameters
  const apiParams = useMemo(
    () => ({
      apiClient,
      page: pagination.page,
      limit: pagination.limit,
      search: searchTerm || undefined,
      isActive: filters.isActive,
    }),
    [apiClient, pagination.page, pagination.limit, searchTerm, filters.isActive]
  );

  // Fetch room types on mount and when dependencies change
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient?.admin) {
      dispatch(fetchRoomTypes(apiParams));
    }
  }, [dispatch, isLoaded, isSignedIn, apiClient, apiParams]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Handle update errors
  useEffect(() => {
    if (updateError) {
      showError(updateError);
      dispatch(clearUpdateError());
    }
  }, [updateError, dispatch]);

  // Handle create errors
  useEffect(() => {
    if (createError) {
      showError(createError);
      dispatch(clearCreateError());
    }
  }, [createError, dispatch]);

  // Handle delete errors
  useEffect(() => {
    if (deleteError) {
      showError(deleteError);
      // No explicit clear here; handled when new delete starts or navigate away
    }
  }, [deleteError]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== filters.search) {
        dispatch(setFilters({ search: searchTerm }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filters.search, dispatch]);

  // Handle drag start
  const handleDragStart = useCallback(
    (e, index) => {
      const base = orderedRoomTypes.length ? orderedRoomTypes : roomTypes;
      const item = base[index];

      e.dataTransfer.setData("draggedId", item.id);
      e.dataTransfer.setData("draggedIndex", String(index));
      e.dataTransfer.effectAllowed = "move";

      // Create a custom drag image (transparent)
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
      if (!orderedRoomTypes.length) {
        setOrderedRoomTypes([...base]);
      }
    },
    [roomTypes, orderedRoomTypes]
  );

  // Handle drag over
  const handleDragOver = useCallback(
    (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      if (draggingIndex === null || draggingIndex === index || !draggedItem) {
        return;
      }

      // Use current display order
      const base = orderedRoomTypes.length ? orderedRoomTypes : roomTypes;

      // Find current position of dragged item (it may have moved during previous drag overs)
      const currentDraggedIndex = base.findIndex(
        (item) => item.id === draggedItem.id
      );
      if (currentDraggedIndex === -1 || currentDraggedIndex === index) {
        return;
      }

      const preview = [...base];

      // Remove the dragged item from its current position
      const [moved] = preview.splice(currentDraggedIndex, 1);

      // Calculate where to insert based on target index
      // If dragging down, target index shifts left by 1 after removal
      let insertAt = index;
      if (currentDraggedIndex < index) {
        insertAt = index - 1; // After removal, target shifts left
      }
      // If dragging up, no adjustment needed (target stays same)

      // Insert at the calculated position
      preview.splice(insertAt, 0, moved);

      setOverIndex(index);
      setOrderedRoomTypes(preview);
    },
    [draggingIndex, draggedItem, orderedRoomTypes, roomTypes]
  );

  // Handle drop - optimistic local update with revert on error
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
      const current = orderedRoomTypes.length
        ? [...orderedRoomTypes]
        : [...roomTypes];

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
      const previousOrder = [...roomTypes];

      // The order is already correct from handleDragOver, just ensure it's saved
      setOptimisticReorder(current); // Track optimistic reorder

      // Compute new absolute sortOrder values using pagination offset
      const pageStartIndex =
        (pagination?.page ? pagination.page - 1 : 0) *
        (pagination?.limit || current.length);
      const orders = current.map((rt, idx) => ({
        id: rt.id,
        sortOrder: pageStartIndex + idx,
      }));

      if (!apiClient?.admin) {
        showError("API client not available");
        setOrderedRoomTypes(previousOrder); // Revert
        setOptimisticReorder(null); // Clear optimistic reorder
        setDraggingIndex(null);
        setDraggedItem(null);
        setOverIndex(null);
        setIsDragging(false);
        return;
      }

      // Fire and forget - handle result asynchronously
      dispatch(reorderRoomTypesAction({ orders, apiClient }))
        .unwrap()
        .then(() => {
          // Success - keep optimistic state, no toast, no refetch
          // Redux will update when it confirms, and useEffect will sync
          // The optimistic reorder will be cleared when Redux order matches
        })
        .catch((err) => {
          // Error - revert to previous order and show toast
          setOrderedRoomTypes(previousOrder);
          setOptimisticReorder(null); // Clear optimistic reorder
          showError(err || "Failed to reorder room types");
        });

      setDraggingIndex(null);
      setDraggedItem(null);
      setOverIndex(null);
      setIsDragging(false);
    },
    [roomTypes, apiClient, dispatch, pagination, orderedRoomTypes, draggedItem]
  );

  const handleDragEnd = useCallback(() => {
    // Reset drag state
    setDraggingIndex(null);
    setDraggedItem(null);
    setOverIndex(null);
    setIsDragging(false);

    // If we have an optimistic reorder, keep it; otherwise sync from Redux
    if (!optimisticReorder && !orderedRoomTypes.length) {
      setOrderedRoomTypes(roomTypes);
    }
  }, [orderedRoomTypes.length, roomTypes, optimisticReorder]);

  const handleCancel = useCallback(() => {
    setAddOpen(false);
    setNewRoomData({
      id: Math.random().toString(),
      name: "",
      displayName: "",
      description: "",
      icon: "",
      isActive: true, // Default to true for new room types
      sortOrder: 0,
    });
  }, []);

  // Helper to generate name from displayName (for new room types)
  const generateNameFromDisplayName = useCallback((displayName) => {
    if (!displayName) return "";
    return displayName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const handleSave = useCallback(async () => {
    if (!newRoomData.displayName || !newRoomData.displayName.trim()) {
      showError("Display name is required");
      return;
    }

    if (!apiClient?.admin) {
      showError("API client not available");
      return;
    }

    // Check if this is an update (has an existing ID from the API)
    const existingRoomType = roomTypes.find((rt) => rt.id === newRoomData.id);

    if (existingRoomType) {
      // Update existing room type
      if (!newRoomData.description || !newRoomData.description.trim()) {
        showError("Description is required");
        return;
      }

      try {
        // Prepare data for update
        const updateData = {
          displayName: newRoomData.displayName.trim(),
          description: newRoomData.description.trim() || null,
          icon: newRoomData.icon, // Will be converted to emoji in the thunk
          isActive: newRoomData.isActive,
          sortOrder: newRoomData.sortOrder || existingRoomType.sortOrder,
        };

        // Optional: include name if it was changed
        if (newRoomData.name && newRoomData.name !== existingRoomType.name) {
          updateData.name = newRoomData.name.trim();
        }

        const result = await dispatch(
          updateRoomTypeAction({
            roomTypeId: existingRoomType.id,
            roomTypeData: updateData,
            apiClient,
          })
        ).unwrap();

        showSuccess("Room type updated successfully!");
        handleCancel();

        // Refresh the list to get updated data
        dispatch(fetchRoomTypes(apiParams));
      } catch (error) {
        console.error("Failed to update room type:", error);
        // Error is handled by useEffect for updateError
      }
    } else {
      // Create new room type
      try {
        // Generate name from displayName if not provided
        const roomName =
          newRoomData.name && newRoomData.name.trim()
            ? newRoomData.name.trim()
            : generateNameFromDisplayName(newRoomData.displayName);

        if (!roomName) {
          showError("Unable to generate a valid name from display name");
          return;
        }

        // Prepare data for create
        const createData = {
          name: roomName,
          displayName: newRoomData.displayName.trim(),
          description: newRoomData.description?.trim() || null,
          icon: newRoomData.icon, // Will be converted to emoji in the thunk
          isActive:
            newRoomData.isActive !== undefined ? newRoomData.isActive : true,
          sortOrder:
            newRoomData.sortOrder !== undefined ? newRoomData.sortOrder : 0,
        };

        const result = await dispatch(
          createRoomTypeAction({
            roomTypeData: createData,
            apiClient,
          })
        ).unwrap();

        showSuccess("Room type created successfully!");
        handleCancel();

        // Refresh the list to get new data
        dispatch(fetchRoomTypes(apiParams));
      } catch (error) {
        console.error("Failed to create room type:", error);
        // Error is handled by useEffect for createError
      }
    }
  }, [
    newRoomData,
    roomTypes,
    apiClient,
    dispatch,
    apiParams,
    handleCancel,
    generateNameFromDisplayName,
  ]);

  const handleToggleActive = useCallback(
    (roomTypeId, nextStatus) => {
      if (!apiClient?.admin) {
        return;
      }

      // Store previous state for potential revert
      const currentRoomType = (
        orderedRoomTypes.length ? orderedRoomTypes : roomTypes
      ).find((rt) => rt.id === roomTypeId);
      const previousStatus = currentRoomType?.isActive;

      // Optimistic update: trust this is correct, API will succeed
      setOptimisticUpdates((prev) => ({
        ...prev,
        [roomTypeId]: { isActive: nextStatus, previousStatus },
      }));

      setOrderedRoomTypes((prev) => {
        const base = prev && prev.length ? prev : roomTypes;
        return base.map((rt) =>
          rt.id === roomTypeId ? { ...rt, isActive: nextStatus } : rt
        );
      });

      // Dispatch toggle - fire and forget, handle result
      const togglePromise = dispatch(
        toggleRoomTypeActiveAction({
          roomTypeId,
          isActive: nextStatus,
          apiClient,
        })
      );

      // Check the result asynchronously
      togglePromise
        .unwrap()
        .then(() => {
          // API succeeded - verify Redux has the correct value before removing optimistic update
          // Use a small delay to ensure Redux state has updated
          setTimeout(() => {
            const reduxRoomType = roomTypes.find((rt) => rt.id === roomTypeId);
            // Only remove optimistic update if Redux has the correct value
            if (reduxRoomType?.isActive === nextStatus) {
              setOptimisticUpdates((prev) => {
                const next = { ...prev };
                delete next[roomTypeId];
                return next;
              });
            }
            // If Redux doesn't have the correct value yet, keep optimistic update
            // It will be removed when Redux updates correctly (via useEffect)
          }, 100);
        })
        .catch((error) => {
          // API failed - immediately revert optimistic update
          setOptimisticUpdates((prev) => {
            const next = { ...prev };
            delete next[roomTypeId];
            return next;
          });
          setOrderedRoomTypes((prev) => {
            const base = prev && prev.length ? prev : roomTypes;
            return base.map((rt) =>
              rt.id === roomTypeId ? { ...rt, isActive: previousStatus } : rt
            );
          });
          showError(error || "Failed to update status");
        });
    },
    [apiClient, dispatch, roomTypes, orderedRoomTypes]
  );

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Loading state
  if (loading && roomTypes.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Room Types</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage room type configurations for your hotels
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)} className="w-full sm:w-auto">
          Add Room Type
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search room types..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Loading overlay for refresh */}
      {loading && roomTypes.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Room Types Grid */}
      {roomTypes.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bed className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No room types found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            {searchTerm
              ? "No room types match your search. Try a different term."
              : "Get started by adding your first room type."}
          </p>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(orderedRoomTypes.length ? orderedRoomTypes : roomTypes).map(
            (item, index) => {
              const isDraggedItem = isDragging && draggingIndex === index;
              const isDropTarget =
                isDragging && overIndex === index && draggingIndex !== index;

              return (
                <React.Fragment key={item.id}>
                  {/* Insertion placeholder - show above the target card */}
                  {isDropTarget &&
                    draggingIndex !== null &&
                    draggingIndex < index && (
                      <div className="col-span-full sm:col-span-2 lg:col-span-3 h-2 my-2 mx-4 bg-primary/20 border-2 border-dashed border-primary rounded-md animate-pulse" />
                    )}

                  <Card
                    className={`flex flex-col justify-between gap-4 hover:shadow-md transition-all duration-200 ${
                      isDraggedItem
                        ? "opacity-40 scale-95 cursor-grabbing"
                        : isDropTarget
                        ? "ring-2 ring-primary ring-offset-2 scale-105"
                        : ""
                    } ${isDragging && !isDraggedItem ? "cursor-pointer" : ""}`}
                    draggable={!isDragging}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between gap-4">
                          <div className="rounded-md bg-muted w-fit p-2 capitalize">
                            {renderIcon(item.icon)}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              // When editing, store the icon as-is (string from API or keep it)
                              setNewRoomData({
                                id: item.id,
                                name: item.name || "",
                                displayName: item.displayName,
                                description: item.description || "",
                                icon: item.icon || "", // Keep as string from API
                                isActive: item.isActive,
                                sortOrder: item.sortOrder || 0,
                              });
                              setAddOpen(true);
                            }}
                            disabled={updating || creating}
                          >
                            <SquarePen className="w-4 h-4" />
                          </Button>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">
                            {item.displayName}
                          </div>
                          <div className="text-muted-foreground text-sm mt-1">
                            {item.description || "No description"}
                          </div>
                          {item.name && (
                            <div className="text-xs text-muted-foreground mt-1">
                              ID: {item.name}
                            </div>
                          )}
                          <div className="mt-3 flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                if (!apiClient?.admin) {
                                  showError("API client not available");
                                  return;
                                }
                                const confirmed = window.confirm(
                                  `Delete room type "${item.displayName}"? This action cannot be undone.`
                                );
                                if (!confirmed) return;
                                try {
                                  await dispatch(
                                    deleteRoomTypeAction({
                                      roomTypeId: item.id,
                                      apiClient,
                                    })
                                  ).unwrap();
                                  showSuccess(
                                    "Room type deleted successfully!"
                                  );
                                  // Optionally refresh list to sync pagination
                                  dispatch(fetchRoomTypes(apiParams));
                                } catch (err) {
                                  // Error shown via toast in useEffect
                                }
                              }}
                              disabled={
                                Boolean(deletingIds[item.id]) ||
                                updating ||
                                creating
                              }
                            >
                              {deletingIds[item.id] ? (
                                <span className="flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin" />{" "}
                                  Deleting...
                                </span>
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="flex justify-between items-center w-full">
                        <Switch
                          checked={item.isActive}
                          onCheckedChange={(checked) =>
                            handleToggleActive(item.id, checked)
                          }
                        />
                        <div
                          className={`${
                            item.isActive ? "text-green-500" : "text-red-500"
                          } text-sm font-semibold`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>

                  {/* Insertion placeholder - show below the target card when dragging up */}
                  {isDropTarget &&
                    draggingIndex !== null &&
                    draggingIndex > index && (
                      <div className="col-span-full sm:col-span-2 lg:col-span-3 h-2 my-2 mx-4 bg-primary/20 border-2 border-dashed border-primary rounded-md animate-pulse" />
                    )}
                </React.Fragment>
              );
            }
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 py-4">
          <Button
            variant="outline"
            onClick={() => dispatch(setPage(Math.max(1, pagination.page - 1)))}
            disabled={pagination.page === 1 || loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-2">
            Page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </span>
          <Button
            variant="outline"
            onClick={() =>
              dispatch(
                setPage(Math.min(pagination.totalPages, pagination.page + 1))
              )
            }
            disabled={pagination.page >= pagination.totalPages || loading}
            size="sm"
            className="w-full sm:w-auto"
          >
            Next
          </Button>
        </div>
      )}

      {/* Add/Edit Room Type Sheet */}
      <Sheet open={addOpen} onOpenChange={setAddOpen}>
        <SheetContent className="overflow-y-auto p-5">
          <SheetHeader>
            <SheetTitle>
              {newRoomData.id && roomTypes.find((r) => r.id === newRoomData.id)
                ? "Edit Room Type"
                : "Add New Room Type"}
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-4 mt-6 border-b-2 pb-4 last:border-b-0">
            {/* Name field - only show for new room types or allow editing name */}
            {!roomTypes.find((r) => r.id === newRoomData.id) && (
              <div className="flex flex-col gap-2">
                <label htmlFor="roomnamefield" className="font-semibold">
                  Room Name <span className="text-red-500">*</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (Auto-generated from display name if not provided)
                  </span>
                </label>
                <Input
                  id="roomnamefield"
                  value={
                    newRoomData.name ||
                    generateNameFromDisplayName(newRoomData.displayName)
                  }
                  onChange={(e) =>
                    setNewRoomData({
                      ...newRoomData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., standard-room"
                  pattern="[a-z0-9-]+"
                  title="Lowercase letters, numbers, and hyphens only"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label htmlFor="roomname" className="font-semibold">
                Room Display Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="roomname"
                value={newRoomData.displayName}
                onChange={(e) =>
                  setNewRoomData({
                    ...newRoomData,
                    displayName: e.target.value,
                  })
                }
                placeholder="e.g., Standard Room"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="roomdescription" className="font-semibold">
                Room Description
                {roomTypes.find((r) => r.id === newRoomData.id) && (
                  <span className="text-red-500">*</span>
                )}
              </label>
              <Textarea
                id="roomdescription"
                value={newRoomData.description}
                onChange={(e) =>
                  setNewRoomData({
                    ...newRoomData,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the room type..."
                rows={4}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="isActive" className="font-semibold">
                Active Status
              </label>
              <div className="flex gap-5 items-center mt-2">
                <Switch
                  checked={newRoomData.isActive}
                  onCheckedChange={(checked) =>
                    setNewRoomData({ ...newRoomData, isActive: checked })
                  }
                />
                <div
                  className={`${
                    newRoomData.isActive ? "text-green-500" : "text-red-500"
                  } text-sm font-semibold`}
                >
                  {newRoomData.isActive ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="roomicon" className="font-semibold">
                Room Icon
              </label>
              {newRoomData.icon ? (
                <div className="rounded-md bg-muted w-fit p-2">
                  {renderIcon(newRoomData.icon)}
                </div>
              ) : (
                <div className="rounded-md bg-muted w-fit p-2 text-muted-foreground">
                  No icon selected
                </div>
              )}
              <div className="grid grid-cols-4 gap-4 mt-2">
                {iconOptions.map((option) => {
                  // Check if selected: compare emoji from API or React component
                  const currentIcon = newRoomData.icon;
                  const isSelected =
                    (typeof currentIcon === "string" &&
                      currentIcon === option.emoji) ||
                    (typeof currentIcon === "object" &&
                      React.isValidElement(currentIcon) &&
                      currentIcon.type === option.component.type) ||
                    currentIcon === option.key;

                  return (
                    <div
                      key={option.key}
                      className={`${
                        isSelected ? "bg-accent" : ""
                      } rounded-md w-fit p-2 cursor-pointer hover:bg-accent transition-colors`}
                      onClick={() => {
                        // Store as React component for local editing
                        // Will be converted to emoji string in handleSave
                        setNewRoomData({
                          ...newRoomData,
                          icon: option.component,
                        });
                      }}
                      title={option.key}
                    >
                      {option.component}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={updating || creating}
              >
                {updating || creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {updating ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
                disabled={updating || creating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
