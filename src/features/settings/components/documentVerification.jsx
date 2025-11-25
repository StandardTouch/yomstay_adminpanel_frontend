import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/common/components/spinner";
import {
  fetchDocumentTypes,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  toggleDocumentTypeActive,
  reorderDocumentTypes,
  setDocumentTypesSearch,
  setDocumentTypesActiveFilter,
  setDocumentTypesRequiredFilter,
  setDocumentTypesSort,
  setDocumentTypesLocale,
  clearDocumentTypesError,
  clearUpdateError,
  clearCreateError,
  clearDeleteError,
} from "../documentTypesSlice";
import {
  selectDocumentTypesLoading,
  selectDocumentTypesError,
  selectDocumentTypesFilters,
  selectDocumentTypesWithLocale,
} from "../documentTypesSelectors";
import { showError, showSuccess } from "../../../utils/toast";
import AddButton from "@/components/AddButton";
import DocumentTypeForm from "./DocumentTypeForm";
import DocumentTypeItem from "./DocumentTypeItem";
import ConfirmationPopup from "@/common/components/Popup/ConfirmationPopup";
import { Trash2 } from "lucide-react";
import ConditionFilters from "../../conditions/components/ConditionFilters";

export default function DocumentVerification() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const loading = useSelector(selectDocumentTypesLoading);
  const error = useSelector(selectDocumentTypesError);
  const filters = useSelector(selectDocumentTypesFilters);
  const documentTypes = useSelector(selectDocumentTypesWithLocale);

  // Local state
  const [formOpen, setFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDocumentType, setEditingDocumentType] = useState(null);
  const [documentTypeForm, setDocumentTypeForm] = useState({
    name: "",
    displayName: "",
    displayNameAr: "",
    description: "",
    descriptionAr: "",
    isActive: true,
    isRequired: false,
    order: null,
  });

  // Drag and drop state
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [orderedDocumentTypes, setOrderedDocumentTypes] = useState([]);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    documentType: null,
    force: false,
  });

  // AR toggle state (locale)
  const isArabic = filters.locale === "ar";

  // Fetch document types on mount and when filters change
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(
        fetchDocumentTypes({
          apiClient,
          page: 1,
          limit: 1000, // Fetch all for drag and drop
          search: filters.search,
          isActive: filters.isActive,
          isRequired: filters.isRequired,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        })
      );
    }
  }, [
    dispatch,
    isLoaded,
    isSignedIn,
    apiClient,
    filters.search,
    filters.isActive,
    filters.isRequired,
    filters.sortBy,
    filters.sortOrder,
  ]);

  // Sync orderedDocumentTypes with documentTypes when filters change or data loads
  // Also sync when Redux updates (for toggle active)
  useEffect(() => {
    if (!isDragging) {
      setOrderedDocumentTypes((prev) => {
        // If no previous order, use document types
        if (prev.length === 0) {
          return documentTypes;
        }
        
        // Remove items that are no longer in documentTypes (e.g., deleted items)
        const filteredIds = new Set(documentTypes.map((dt) => dt.id));
        const remaining = prev.filter((dt) => filteredIds.has(dt.id));
        
        // Merge Redux updates into local ordered state while preserving order
        const merged = remaining.map((localDocType) => {
          const reduxDocType = documentTypes.find(
            (dt) => dt.id === localDocType.id
          );
          // Use Redux data if available, otherwise keep local
          return reduxDocType ? { ...localDocType, ...reduxDocType } : localDocType;
        });
        
        // Add any new items from documentTypes that aren't in the ordered list
        const existingIds = new Set(merged.map((dt) => dt.id));
        const newItems = documentTypes.filter((dt) => !existingIds.has(dt.id));
        
        return [...merged, ...newItems];
      });
    }
  }, [documentTypes, isDragging]);

  // Display errors
  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearDocumentTypesError());
    }
  }, [error, dispatch]);

  const updating = useSelector((state) => state.documentTypes.updating);
  const updateError = useSelector((state) => state.documentTypes.updateError);
  const creating = useSelector((state) => state.documentTypes.creating);
  const createError = useSelector((state) => state.documentTypes.createError);
  const deleting = useSelector((state) => state.documentTypes.deleting);
  const deleteError = useSelector((state) => state.documentTypes.deleteError);

  useEffect(() => {
    if (updateError) {
      showError(updateError);
      dispatch(clearUpdateError());
    }
  }, [updateError, dispatch]);

  useEffect(() => {
    if (createError) {
      showError(createError);
      dispatch(clearCreateError());
    }
  }, [createError, dispatch]);

  useEffect(() => {
    if (deleteError) {
      showError(deleteError);
      dispatch(clearDeleteError());
    }
  }, [deleteError, dispatch]);

  // Handle AR toggle
  const handleLocaleToggle = (checked) => {
    dispatch(setDocumentTypesLocale(checked ? "ar" : "en"));
  };

  // Handle active filter
  const handleActiveFilterChange = (value) => {
    const filterValue =
      value === "all" ? undefined : value === "active" ? true : false;
    dispatch(setDocumentTypesActiveFilter(filterValue));
  };

  // Handle required filter
  const handleRequiredFilterChange = (value) => {
    const filterValue =
      value === "all" ? undefined : value === "required" ? true : false;
    dispatch(setDocumentTypesRequiredFilter(filterValue));
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortOrder) => {
    dispatch(
      setDocumentTypesSort({
        sortBy,
        sortOrder,
      })
    );
  };

  // Handle toggle active status - optimistic update (like conditions)
  const handleToggleActive = useCallback(
    (documentTypeId, nextStatus) => {
      if (!apiClient?.documentTypes) {
        return;
      }

      // Store previous state for potential revert
      const currentDocType = (
        orderedDocumentTypes.length ? orderedDocumentTypes : documentTypes
      ).find((dt) => dt.id === documentTypeId);
      const previousStatus = currentDocType?.isActive;

      // Optimistic update: trust this is correct, API will succeed
      setOrderedDocumentTypes((prev) => {
        const base = prev && prev.length ? prev : documentTypes;
        return base.map((dt) =>
          dt.id === documentTypeId ? { ...dt, isActive: nextStatus } : dt
        );
      });

      // Dispatch toggle - fire and forget, handle result
      const togglePromise = dispatch(
        toggleDocumentTypeActive({
          documentTypeId,
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
          setOrderedDocumentTypes((prev) => {
            const base = prev && prev.length ? prev : documentTypes;
            return base.map((dt) =>
              dt.id === documentTypeId
                ? { ...dt, isActive: previousStatus }
                : dt
            );
          });
          showError(err || "Failed to update document type status");
        });
    },
    [apiClient, orderedDocumentTypes, documentTypes]
  );

  // Drag and drop handlers
  const handleDragStart = useCallback(
    (e, index) => {
      const base = orderedDocumentTypes.length ? orderedDocumentTypes : documentTypes;
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
      if (!orderedDocumentTypes.length) {
        setOrderedDocumentTypes([...base]);
      }
    },
    [orderedDocumentTypes, documentTypes]
  );

  const handleDragOver = useCallback(
    (e, index) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      if (draggingIndex === null || draggingIndex === index || !draggedItem) {
        return;
      }

      const base = orderedDocumentTypes.length ? orderedDocumentTypes : documentTypes;

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
      setOrderedDocumentTypes(preview);
    },
    [draggingIndex, draggedItem, orderedDocumentTypes, documentTypes]
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
      const current = orderedDocumentTypes.length
        ? [...orderedDocumentTypes]
        : [...documentTypes];

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
      const previousOrder = [...documentTypes];

      // Check if position actually changed
      const originalIndex = previousOrder.findIndex(
        (dt) => dt.id === draggedItem.id
      );
      const newIndex = current.findIndex((dt) => dt.id === draggedItem.id);

      // If position hasn't changed, don't call API
      if (originalIndex === newIndex) {
        setDraggingIndex(null);
        setDraggedItem(null);
        setOverIndex(null);
        setIsDragging(false);
        // Reset to original order since nothing changed
        setOrderedDocumentTypes(previousOrder);
        return;
      }

      // The order is already correct from handleDragOver, just ensure it's saved
      // Compute new absolute order values
      const orders = current.map((dt, idx) => ({
        id: dt.id,
        order: idx + 1, // Start from 1
      }));

      if (!apiClient?.documentTypes) {
        showError("API client not available");
        setOrderedDocumentTypes(previousOrder); // Revert
        setDraggingIndex(null);
        setDraggedItem(null);
        setOverIndex(null);
        setIsDragging(false);
        return;
      }

      // Fire and forget - handle result asynchronously
      dispatch(reorderDocumentTypes({ orders, apiClient }))
        .then(() => {
          // Success - keep optimistic state, no toast, no refetch
          // Redux will update when it confirms, and useEffect will sync
        })
        .catch((err) => {
          // Error - revert to previous order and show toast
          setOrderedDocumentTypes(previousOrder);
          showError(err || "Failed to reorder document types");
        });

      setDraggingIndex(null);
      setDraggedItem(null);
      setOverIndex(null);
      setIsDragging(false);
    },
    [
      draggedItem,
      orderedDocumentTypes,
      documentTypes,
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
    if (!orderedDocumentTypes.length) {
      setOrderedDocumentTypes(documentTypes);
    }
  }, [orderedDocumentTypes, documentTypes]);

  // Handle edit button click
  const handleEditClick = (docType) => {
    setIsEditing(true);
    setEditingDocumentType(docType);
    setDocumentTypeForm({
      name: docType.name || "",
      displayName: docType.displayName || "",
      displayNameAr: docType.ar?.displayName || "",
      description: docType.description || "",
      descriptionAr: docType.ar?.description || "",
      isActive: docType.isActive !== undefined ? docType.isActive : true,
      isRequired: docType.isRequired !== undefined ? docType.isRequired : false,
      order: docType.order !== null && docType.order !== undefined ? docType.order : null,
    });
    setFormOpen(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setFormOpen(false);
    setIsEditing(false);
    setEditingDocumentType(null);
    setDocumentTypeForm({
      name: "",
      displayName: "",
      displayNameAr: "",
      description: "",
      descriptionAr: "",
      isActive: true,
      isRequired: false,
      order: null,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiClient) return;

    if (isEditing && editingDocumentType) {
      // Update existing document type
      try {
        const updateData = {};
        
        // Only include fields that have changed
        if (documentTypeForm.displayName !== editingDocumentType.displayName) {
          updateData.displayName = documentTypeForm.displayName;
        }
        if (documentTypeForm.displayNameAr !== (editingDocumentType.ar?.displayName || "")) {
          updateData.displayNameAr = documentTypeForm.displayNameAr || null;
        }
        if (documentTypeForm.description !== (editingDocumentType.description || "")) {
          updateData.description = documentTypeForm.description || null;
        }
        if (documentTypeForm.descriptionAr !== (editingDocumentType.ar?.description || "")) {
          updateData.descriptionAr = documentTypeForm.descriptionAr || null;
        }
        if (documentTypeForm.isActive !== editingDocumentType.isActive) {
          updateData.isActive = documentTypeForm.isActive;
        }
        if (documentTypeForm.isRequired !== editingDocumentType.isRequired) {
          updateData.isRequired = documentTypeForm.isRequired;
        }
        if (documentTypeForm.order !== (editingDocumentType.order !== null && editingDocumentType.order !== undefined ? editingDocumentType.order : null)) {
          updateData.order = documentTypeForm.order;
        }

        // If nothing changed, don't make API call
        if (Object.keys(updateData).length === 0) {
          showError("No changes to save");
          return;
        }

        await dispatch(
          updateDocumentType({
            id: editingDocumentType.id,
            updateData,
            apiClient,
          })
        ).unwrap();

        showSuccess("Document type updated successfully");
        handleFormClose();
        
        // Refresh the list
        dispatch(
          fetchDocumentTypes({
            apiClient,
            page: 1,
            limit: 1000,
            search: filters.search,
            isActive: filters.isActive,
            isRequired: filters.isRequired,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
          })
        );
      } catch (error) {
        // Error is already handled by the thunk and shown via toast
        console.error("Failed to update document type:", error);
      }
    } else {
      // Create new document type
      try {
        const createData = {
          name: documentTypeForm.name,
          displayName: documentTypeForm.displayName,
          displayNameAr: documentTypeForm.displayNameAr || null,
          description: documentTypeForm.description || null,
          descriptionAr: documentTypeForm.descriptionAr || null,
          isActive: documentTypeForm.isActive !== undefined ? documentTypeForm.isActive : true,
          isRequired: documentTypeForm.isRequired !== undefined ? documentTypeForm.isRequired : false,
          order: documentTypeForm.order !== null && documentTypeForm.order !== undefined ? documentTypeForm.order : null,
        };

        await dispatch(
          createDocumentType({
            createData,
            apiClient,
          })
        ).unwrap();

        showSuccess("Document type created successfully");
        handleFormClose();
        
        // Refresh the list
        dispatch(
          fetchDocumentTypes({
            apiClient,
            page: 1,
            limit: 1000,
            search: filters.search,
            isActive: filters.isActive,
            isRequired: filters.isRequired,
            sortBy: filters.sortBy,
            sortOrder: filters.sortOrder,
          })
        );
      } catch (error) {
        // Error is already handled by the thunk and shown via toast
        console.error("Failed to create document type:", error);
      }
    }
  };

  // Handle delete button click
  const handleDeleteClick = (docType) => {
    setDeleteModal({
      open: true,
      documentType: docType,
      force: false,
    });
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setDeleteModal({
      open: false,
      documentType: null,
      force: false,
    });
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!apiClient || !deleteModal.documentType) return;

    try {
      await dispatch(
        deleteDocumentType({
          id: deleteModal.documentType.id,
          force: deleteModal.force,
          apiClient,
        })
      ).unwrap();

      showSuccess("Document type deleted successfully");
      handleDeleteModalClose();
      
      // Refresh the list
      dispatch(
        fetchDocumentTypes({
          apiClient,
          page: 1,
          limit: 1000,
          search: filters.search,
          isActive: filters.isActive,
          isRequired: filters.isRequired,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
        })
      );
    } catch (error) {
      // Error is already handled by the thunk and shown via toast
      console.error("Failed to delete document type:", error);
    }
  };

  if (!isSignedIn) return <div>Please sign in.</div>;

  const displayDocumentTypes = orderedDocumentTypes.length
    ? orderedDocumentTypes
    : documentTypes;

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Document Verification</h1>
        <div className="flex items-center gap-4">
          {/* AR Toggle */}
          <div className="flex items-center gap-2">
            <Label htmlFor="ar-toggle" className="text-sm">
              English
            </Label>
            <Switch
              id="ar-toggle"
              checked={isArabic}
              onCheckedChange={handleLocaleToggle}
            />
            <Label htmlFor="ar-toggle" className="text-sm">
              Arabic
            </Label>
          </div>
          <AddButton
            buttonValue="Add New Document"
            onAdd={() => {
              setIsEditing(false);
              setEditingDocumentType(null);
              setDocumentTypeForm({
                name: "",
                displayName: "",
                displayNameAr: "",
                description: "",
                descriptionAr: "",
                isActive: true,
                isRequired: false,
                order: null,
              });
              setFormOpen(true);
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

      {/* Document Types List */}
      {!loading && !error && (
        <div className="mt-4 rounded-2xl">
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {documentTypes.length} document types
          </div>
          {documentTypes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No document types found
            </div>
          ) : (
            displayDocumentTypes.map((docType, index) => {
              const isDraggedItem = draggedItem?.id === docType.id;
              const isDropTarget =
                isDragging && overIndex === index && draggingIndex !== index;

              return (
                <DocumentTypeItem
                  key={docType.id}
                  documentType={docType}
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
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  loading={loading}
                />
              );
            })
          )}
        </div>
      )}

      {/* Add/Edit Document Type Form */}
      <DocumentTypeForm
        isOpen={formOpen}
        onClose={handleFormClose}
        documentType={documentTypeForm}
        onDocumentTypeChange={setDocumentTypeForm}
        onSubmit={handleSubmit}
        onCancel={handleFormClose}
        isUpdate={isEditing}
        loading={isEditing ? updating : creating}
      />

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={deleteModal.open}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Document Type"
        description={
          deleteModal.documentType
            ? `Are you sure you want to delete the document type "${deleteModal.documentType.displayName || deleteModal.documentType.name}"? This action cannot be undone.`
            : "Are you sure you want to delete this document type? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={Trash2}
        isLoading={deleting}
      />
    </div>
  );
}
