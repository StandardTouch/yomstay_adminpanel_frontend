import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching document types
export const fetchDocumentTypes = createAsyncThunk(
  "documentTypes/fetchDocumentTypes",
  async ({ apiClient, page, limit, search, isActive, isRequired, sortBy, sortOrder }, { rejectWithValue }) => {
    try {
      if (!apiClient?.documentTypes) {
        throw new Error("API client is required");
      }

      // Build opts object
      const opts = {};
      if (page !== undefined) opts.page = page;
      if (limit !== undefined) opts.limit = limit;
      if (search) opts.search = search;
      if (isActive !== undefined) opts.isActive = isActive;
      if (isRequired !== undefined) opts.isRequired = isRequired;
      if (sortBy) opts.sortBy = sortBy;
      if (sortOrder) opts.sortOrder = sortOrder;

      const response = await apiClient.documentTypes.listDocumentTypes(opts);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error fetching document types:", error);

      // Handle specific error types
      if (
        error.statusCode === 401 ||
        error.status === 401 ||
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page."
        );
      }

      if (
        error.statusCode === 403 ||
        error.status === 403 ||
        error.message?.includes("403") ||
        error.message?.includes("Forbidden")
      ) {
        return rejectWithValue(
          "You don't have permission to view document types."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch document types"
      );
    }
  }
);

// Async thunk for updating document type
export const updateDocumentType = createAsyncThunk(
  "documentTypes/updateDocumentType",
  async ({ id, updateData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.documentTypes) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Document type ID is required");
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error("At least one field must be provided for update");
      }

      const response = await apiClient.documentTypes.updateDocumentType(id, updateData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error updating document type:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request") ||
        error.message?.includes("Validation")
      ) {
        // Handle validation errors
        const validationErrors = error.data?.errors || [];
        const errorMessages = validationErrors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        return rejectWithValue(
          errorMessages || error.data?.message || "Validation failed. Please check your input."
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Document type not found.");
      }

      if (
        error.statusCode === 401 ||
        error.status === 401 ||
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page."
        );
      }

      if (
        error.statusCode === 403 ||
        error.status === 403 ||
        error.message?.includes("403") ||
        error.message?.includes("Forbidden")
      ) {
        return rejectWithValue(
          "You don't have permission to update document types."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to update document type"
      );
    }
  }
);

// Async thunk for creating document type
export const createDocumentType = createAsyncThunk(
  "documentTypes/createDocumentType",
  async ({ createData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.documentTypes) {
        throw new Error("API client is required");
      }

      if (!createData || !createData.name || !createData.displayName) {
        throw new Error("Name and displayName are required");
      }

      const response = await apiClient.documentTypes.createDocumentType(createData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error creating document type:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request") ||
        error.message?.includes("Validation")
      ) {
        // Handle validation errors
        const validationErrors = error.data?.errors || [];
        const errorMessages = validationErrors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        return rejectWithValue(
          errorMessages || error.data?.message || "Validation failed. Please check your input."
        );
      }

      if (
        error.statusCode === 401 ||
        error.status === 401 ||
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page."
        );
      }

      if (
        error.statusCode === 403 ||
        error.status === 403 ||
        error.message?.includes("403") ||
        error.message?.includes("Forbidden")
      ) {
        return rejectWithValue(
          "You don't have permission to create document types."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to create document type"
      );
    }
  }
);

// Async thunk for deleting document type
export const deleteDocumentType = createAsyncThunk(
  "documentTypes/deleteDocumentType",
  async ({ id, force, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.documentTypes) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Document type ID is required");
      }

      const response = await apiClient.documentTypes.deleteDocumentType(id, force);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        id, // Return ID for removing from list
      };
    } catch (error) {
      console.error("Error deleting document type:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request")
      ) {
        return rejectWithValue(
          error.data?.message || "Cannot delete document type with existing documents. Use force delete to remove all related documents."
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Document type not found.");
      }

      if (
        error.statusCode === 401 ||
        error.status === 401 ||
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page."
        );
      }

      if (
        error.statusCode === 403 ||
        error.status === 403 ||
        error.message?.includes("403") ||
        error.message?.includes("Forbidden")
      ) {
        return rejectWithValue(
          "You don't have permission to delete document types."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to delete document type"
      );
    }
  }
);

// Async thunk for toggling document type active status
export const toggleDocumentTypeActive = createAsyncThunk(
  "documentTypes/toggleDocumentTypeActive",
  async ({ documentTypeId, isActive, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.documentTypes) {
        throw new Error("API client is required");
      }

      if (!documentTypeId) {
        throw new Error("Document type ID is required");
      }

      const response = await apiClient.documentTypes.toggleDocumentTypeActive(
        documentTypeId,
        isActive
      );

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        id: documentTypeId,
      };
    } catch (error) {
      console.error("Error toggling document type active status:", error);

      // Handle specific error types
      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Document type not found.");
      }

      if (
        error.statusCode === 401 ||
        error.status === 401 ||
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page."
        );
      }

      if (
        error.statusCode === 403 ||
        error.status === 403 ||
        error.message?.includes("403") ||
        error.message?.includes("Forbidden")
      ) {
        return rejectWithValue(
          "You don't have permission to toggle document type status."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to toggle document type status"
      );
    }
  }
);

// Async thunk for reordering document types
export const reorderDocumentTypes = createAsyncThunk(
  "documentTypes/reorderDocumentTypes",
  async ({ orders, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.documentTypes) {
        throw new Error("API client is required");
      }

      if (!orders || !Array.isArray(orders) || orders.length === 0) {
        throw new Error("Orders array is required");
      }

      const response = await apiClient.documentTypes.reorderDocumentTypes(orders);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        orders, // Return orders for updating Redux state
      };
    } catch (error) {
      console.error("Error reordering document types:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request") ||
        error.message?.includes("Validation")
      ) {
        // Handle validation errors
        const validationErrors = error.data?.errors || [];
        const errorMessages = validationErrors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        return rejectWithValue(
          errorMessages || error.data?.message || "Validation failed. Please check your input."
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Some document types not found.");
      }

      if (
        error.statusCode === 401 ||
        error.status === 401 ||
        error.message?.includes("401") ||
        error.message?.includes("Unauthorized")
      ) {
        return rejectWithValue(
          "Authentication failed. Please try refreshing the page."
        );
      }

      if (
        error.statusCode === 403 ||
        error.status === 403 ||
        error.message?.includes("403") ||
        error.message?.includes("Forbidden")
      ) {
        return rejectWithValue(
          "You don't have permission to reorder document types."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to reorder document types"
      );
    }
  }
);

const documentTypesSlice = createSlice({
  name: "documentTypes",
  initialState: {
    documentTypes: [],
    loading: false,
    error: null,
    updating: false,
    updateError: null,
    creating: false,
    createError: null,
    deleting: false,
    deleteError: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    filters: {
      search: undefined,
      isActive: undefined,
      isRequired: undefined,
      sortBy: "order",
      sortOrder: "asc",
      locale: "en", // For display only (client-side)
    },
  },
  reducers: {
    setDocumentTypesPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setDocumentTypesLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; // Reset to first page when limit changes
    },
    setDocumentTypesSearch: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.page = 1; // Reset to first page when search changes
    },
    setDocumentTypesActiveFilter: (state, action) => {
      state.filters.isActive = action.payload;
      state.pagination.page = 1; // Reset to first page when filter changes
    },
    setDocumentTypesRequiredFilter: (state, action) => {
      state.filters.isRequired = action.payload;
      state.pagination.page = 1; // Reset to first page when filter changes
    },
    setDocumentTypesSort: (state, action) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
      state.pagination.page = 1; // Reset to first page when sort changes
    },
    setDocumentTypesLocale: (state, action) => {
      state.filters.locale = action.payload; // For display only (client-side)
    },
    clearDocumentTypesError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Document Types
      .addCase(fetchDocumentTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentTypes.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.documentTypes = action.payload.data?.documentTypes || [];
          if (action.payload.data?.pagination) {
            state.pagination = {
              ...state.pagination,
              ...action.payload.data.pagination,
            };
          }
        }
      })
      .addCase(fetchDocumentTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Document Type
      .addCase(updateDocumentType.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateDocumentType.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload && action.payload.success) {
          const updated = action.payload.data?.documentType;
          if (updated?.id) {
            // Update in document types list
            const index = state.documentTypes.findIndex((dt) => dt.id === updated.id);
            if (index !== -1) {
              state.documentTypes[index] = {
                ...state.documentTypes[index],
                ...updated,
              };
            }
          }
        }
      })
      .addCase(updateDocumentType.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })
      // Create Document Type
      .addCase(createDocumentType.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createDocumentType.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload && action.payload.success) {
          const newDocType = action.payload.data?.documentType;
          if (newDocType?.id) {
            // Add to document types list
            state.documentTypes.push(newDocType);
            // Update pagination total
            if (state.pagination.total !== undefined) {
              state.pagination.total += 1;
            }
          }
        }
      })
      .addCase(createDocumentType.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })
      // Delete Document Type
      .addCase(deleteDocumentType.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })
      .addCase(deleteDocumentType.fulfilled, (state, action) => {
        state.deleting = false;
        if (action.payload && action.payload.success) {
          // Remove from document types list
          state.documentTypes = state.documentTypes.filter(
            (dt) => dt.id !== action.payload.id
          );
          // Update pagination total
          if (state.pagination.total > 0) {
            state.pagination.total -= 1;
          }
        }
      })
      .addCase(deleteDocumentType.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload;
      })
      // Toggle Document Type Active
      .addCase(toggleDocumentTypeActive.pending, (state) => {
        // No loading state for optimistic updates
      })
      .addCase(toggleDocumentTypeActive.fulfilled, (state, action) => {
        if (action.payload && action.payload.success) {
          const updated = action.payload.data?.documentType;
          if (updated?.id) {
            // Update in document types list
            const index = state.documentTypes.findIndex((dt) => dt.id === updated.id);
            if (index !== -1) {
              state.documentTypes[index] = {
                ...state.documentTypes[index],
                ...updated,
              };
            }
          }
        }
      })
      .addCase(toggleDocumentTypeActive.rejected, (state, action) => {
        // Error handling is done in component with optimistic revert
      })
      // Reorder Document Types
      .addCase(reorderDocumentTypes.pending, (state) => {
        // No loading state for optimistic updates
      })
      .addCase(reorderDocumentTypes.fulfilled, (state, action) => {
        if (action.payload && action.payload.success && action.payload.orders) {
          // Update order values in document types
          const orderMap = new Map(
            action.payload.orders.map(({ id, order }) => [id, order])
          );
          state.documentTypes.forEach((dt) => {
            if (orderMap.has(dt.id)) {
              dt.order = orderMap.get(dt.id);
            }
          });
        }
      })
      .addCase(reorderDocumentTypes.rejected, (state, action) => {
        // Error handling is done in component with optimistic revert
      });
  },
});

export const {
  setDocumentTypesPage,
  setDocumentTypesLimit,
  setDocumentTypesSearch,
  setDocumentTypesActiveFilter,
  setDocumentTypesRequiredFilter,
  setDocumentTypesSort,
  setDocumentTypesLocale,
  clearDocumentTypesError,
  clearUpdateError,
  clearCreateError,
  clearDeleteError,
} = documentTypesSlice.actions;

export default documentTypesSlice.reducer;

