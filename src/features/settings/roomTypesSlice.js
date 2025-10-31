import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import React from "react";

/**
 * Fetch room types from API
 */
export const fetchRoomTypes = createAsyncThunk(
  "roomTypes/fetchRoomTypes",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      const response = await apiClient.admin.listRoomTypes(filters);
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)), // Ensure serializable
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("fetchRoomTypes error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch room types"
      );
    }
  }
);

/**
 * Create room type
 */
export const createRoomType = createAsyncThunk(
  "roomTypes/createRoomType",
  async ({ roomTypeData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      if (!roomTypeData) {
        throw new Error("Room type data is required");
      }

      // Validate required fields
      if (!roomTypeData.name || roomTypeData.name.trim() === "") {
        throw new Error("name is required");
      }
      if (!roomTypeData.displayName || roomTypeData.displayName.trim() === "") {
        throw new Error("displayName is required");
      }

      // Convert React icon component to emoji if needed
      let iconValue = roomTypeData.icon;
      if (typeof iconValue === "object" && React.isValidElement(iconValue)) {
        // Map React component back to emoji
        const iconMap = {
          Bed: "🛏️",
          BedDouble: "🛏️",
          Building: "🏢",
          Briefcase: "💼",
          Crown: "👑",
          Users: "👥",
          Link: "🔗",
          Accessibility: "♿",
        };
        const componentName =
          iconValue.type?.displayName || iconValue.type?.name;
        iconValue = iconMap[componentName] || null;
      }

      // Prepare create payload
      const payload = {
        name: roomTypeData.name.trim(),
        displayName: roomTypeData.displayName.trim(),
      };

      // Optional fields
      if (roomTypeData.description !== undefined) {
        payload.description = roomTypeData.description?.trim() || null;
      }
      if (iconValue !== undefined) {
        payload.icon = iconValue || null;
      }
      if (roomTypeData.isActive !== undefined) {
        payload.isActive = roomTypeData.isActive;
      } else {
        payload.isActive = true; // Default value
      }
      if (roomTypeData.sortOrder !== undefined) {
        payload.sortOrder = roomTypeData.sortOrder;
      } else {
        payload.sortOrder = 0; // Default value
      }

      const response = await apiClient.admin.createRoomType(payload);
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)), // Ensure serializable
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("createRoomType error:", error);

      // Handle validation errors (400 status)
      if (error.response?.status === 400) {
        if (
          error.response?.data?.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const validationErrors = error.response.data.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          return rejectWithValue(`Validation failed: ${validationErrors}`);
        }
        return rejectWithValue(
          error.response?.data?.message ||
            "Validation failed. Please check your input values."
        );
      }

      // Handle other API errors
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized. Please sign in again.");
      }
      if (error.response?.status === 403) {
        return rejectWithValue("Forbidden. Admin access required.");
      }

      // Handle network errors or other errors
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create room type. Please try again."
      );
    }
  }
);

/**
 * Update room type
 */
export const updateRoomType = createAsyncThunk(
  "roomTypes/updateRoomType",
  async ({ roomTypeId, roomTypeData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      if (!roomTypeId) {
        throw new Error("Room type ID is required");
      }

      if (!roomTypeData) {
        throw new Error("Room type data is required");
      }

      // Validate required fields for update
      if (
        roomTypeData.displayName === undefined ||
        roomTypeData.displayName === ""
      ) {
        throw new Error("displayName is required");
      }

      // Convert React icon component to emoji if needed
      let iconValue = roomTypeData.icon;
      if (typeof iconValue === "object" && React.isValidElement(iconValue)) {
        // Map React component back to emoji
        const iconMap = {
          Bed: "🛏️",
          BedDouble: "🛏️",
          Building: "🏢",
          Briefcase: "💼",
          Crown: "👑",
          Users: "👥",
          Link: "🔗",
          Accessibility: "♿",
        };
        const componentName =
          iconValue.type?.displayName || iconValue.type?.name;
        iconValue = iconMap[componentName] || "🛏️";
      }

      // Prepare update payload
      const payload = {};
      if (roomTypeData.name !== undefined) payload.name = roomTypeData.name;
      if (roomTypeData.displayName !== undefined)
        payload.displayName = roomTypeData.displayName;
      if (roomTypeData.description !== undefined)
        payload.description = roomTypeData.description || null;
      if (iconValue !== undefined) payload.icon = iconValue || null;
      if (roomTypeData.isActive !== undefined)
        payload.isActive = roomTypeData.isActive;
      if (roomTypeData.sortOrder !== undefined)
        payload.sortOrder = roomTypeData.sortOrder;

      const response = await apiClient.admin.updateRoomType(
        roomTypeId,
        payload
      );
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)), // Ensure serializable
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updateRoomType error:", error);

      // Handle validation errors (400 status)
      if (error.response?.status === 400) {
        if (
          error.response?.data?.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const validationErrors = error.response.data.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          return rejectWithValue(`Validation failed: ${validationErrors}`);
        }
        return rejectWithValue(
          error.response?.data?.message ||
            "Validation failed. Please check your input values."
        );
      }

      // Handle other API errors
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized. Please sign in again.");
      }
      if (error.response?.status === 403) {
        return rejectWithValue("Forbidden. Admin access required.");
      }
      if (error.response?.status === 404) {
        return rejectWithValue("Room type not found.");
      }

      // Handle network errors or other errors
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update room type. Please try again."
      );
    }
  }
);

/**
 * Reorder room types
 */
export const reorderRoomTypes = createAsyncThunk(
  "roomTypes/reorderRoomTypes",
  async ({ orders, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }
      if (!Array.isArray(orders) || orders.length === 0) {
        throw new Error("orders array is required");
      }

      const payload = {
        orders: orders.map(({ id, sortOrder }) => ({ id, sortOrder })),
      };
      const response = await apiClient.admin.reorderRoomTypes(payload);
      const data = response.data || response;
      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)),
        message: response.message,
        success: response.success,
        orders: payload.orders,
      };
    } catch (error) {
      if (error.response?.status === 400) {
        if (Array.isArray(error.response?.data?.errors)) {
          const validationErrors = error.response.data.errors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ");
          return rejectWithValue(`Validation failed: ${validationErrors}`);
        }
        return rejectWithValue(
          error.response?.data?.message || "Validation failed for reorder"
        );
      }
      if (error.response?.status === 401)
        return rejectWithValue("Unauthorized. Please sign in again.");
      if (error.response?.status === 403)
        return rejectWithValue("Forbidden. Admin access required.");
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reorder room types"
      );
    }
  }
);

/**
 * Toggle active
 */
export const toggleRoomTypeActive = createAsyncThunk(
  "roomTypes/toggleRoomTypeActive",
  async ({ roomTypeId, isActive, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) throw new Error("API client is required");
      if (!roomTypeId) throw new Error("Room type ID is required");
      const body = {};
      if (typeof isActive === "boolean") body.isActive = isActive;
      const response = await apiClient.admin.toggleRoomTypeActive(
        roomTypeId,
        body
      );
      const data = response.data || response;
      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)),
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      if (error.response?.status === 401)
        return rejectWithValue("Unauthorized. Please sign in again.");
      if (error.response?.status === 403)
        return rejectWithValue("Forbidden. Admin access required.");
      if (error.response?.status === 404)
        return rejectWithValue("Room type not found.");
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status"
      );
    }
  }
);
/**
 * Delete room type
 */
export const deleteRoomType = createAsyncThunk(
  "roomTypes/deleteRoomType",
  async ({ roomTypeId, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }
      if (!roomTypeId) {
        throw new Error("Room type ID is required");
      }

      const response = await apiClient.admin.deleteRoomType(roomTypeId);
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)),
        message: response.message,
        success: response.success,
        deletedId: roomTypeId,
      };
    } catch (error) {
      console.error("deleteRoomType error:", error);

      if (error.response?.status === 400) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Cannot delete room type with existing rooms."
        );
      }
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized. Please sign in again.");
      }
      if (error.response?.status === 403) {
        return rejectWithValue("Forbidden. Admin access required.");
      }
      if (error.response?.status === 404) {
        return rejectWithValue("Room type not found.");
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete room type. Please try again."
      );
    }
  }
);

const roomTypesSlice = createSlice({
  name: "roomTypes",
  initialState: {
    roomTypes: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    loading: false,
    error: null,
    updating: false,
    updateError: null,
    deletingIds: {},
    deleteError: null,
    reordering: false,
    reorderError: null,
    togglingIds: {},
    toggleError: null,
    creating: false,
    createError: null,
    filters: {
      search: "",
      isActive: undefined,
      page: 1,
      limit: 20,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
      state.filters.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.filters.limit = action.payload;
      state.pagination.page = 1; // Reset to first page when limit changes
    },
    clearError: (state) => {
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
    clearReorderError: (state) => {
      state.reorderError = null;
    },
    clearToggleError: (state) => {
      state.toggleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch room types
      .addCase(fetchRoomTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomTypes.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.roomTypes =
            action.payload.data.roomTypes || action.payload.data || [];
          if (action.payload.data.pagination) {
            state.pagination = {
              total: action.payload.data.pagination.total || 0,
              page: action.payload.data.pagination.page || 1,
              limit: action.payload.data.pagination.limit || 20,
              totalPages: action.payload.data.pagination.totalPages || 0,
            };
          }
        }
      })
      .addCase(fetchRoomTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update room type
      .addCase(updateRoomType.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateRoomType.fulfilled, (state, action) => {
        state.updating = false;
        // Update the room type in the list
        if (action.payload.data) {
          const updatedRoomType = action.payload.data;
          const index = state.roomTypes.findIndex(
            (rt) => rt.id === updatedRoomType.id
          );
          if (index !== -1) {
            state.roomTypes[index] = updatedRoomType;
          }
        }
      })
      .addCase(updateRoomType.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })
      // Create room type
      .addCase(createRoomType.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })
      .addCase(createRoomType.fulfilled, (state, action) => {
        state.creating = false;
        // Add the new room type to the list
        if (action.payload.data) {
          const newRoomType = action.payload.data;
          state.roomTypes.push(newRoomType);
          // Update pagination if needed
          state.pagination.total = (state.pagination.total || 0) + 1;
        }
      })
      .addCase(createRoomType.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload;
      })
      // Delete room type
      .addCase(deleteRoomType.pending, (state, action) => {
        const id = action.meta.arg?.roomTypeId;
        if (id) state.deletingIds[id] = true;
        state.deleteError = null;
      })
      .addCase(deleteRoomType.fulfilled, (state, action) => {
        const deletedId = action.payload.deletedId;
        if (deletedId) delete state.deletingIds[deletedId];
        state.roomTypes = state.roomTypes.filter((rt) => rt.id !== deletedId);
        // Update pagination total if present
        if (state.pagination && typeof state.pagination.total === "number") {
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      })
      .addCase(deleteRoomType.rejected, (state, action) => {
        const id = action.meta.arg?.roomTypeId;
        if (id) delete state.deletingIds[id];
        state.deleteError = action.payload;
      })
      // Reorder room types
      .addCase(reorderRoomTypes.pending, (state) => {
        state.reordering = true;
        state.reorderError = null;
      })
      .addCase(reorderRoomTypes.fulfilled, (state, action) => {
        state.reordering = false;
        const orders = action.payload.orders;
        const idToOrder = new Map(orders.map((o) => [o.id, o.sortOrder]));
        state.roomTypes = state.roomTypes
          .map((rt) =>
            idToOrder.has(rt.id)
              ? { ...rt, sortOrder: idToOrder.get(rt.id) }
              : rt
          )
          .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
      })
      .addCase(reorderRoomTypes.rejected, (state, action) => {
        state.reordering = false;
        state.reorderError = action.payload;
      })
      // Toggle active
      .addCase(toggleRoomTypeActive.pending, (state, action) => {
        const id = action.meta.arg?.roomTypeId;
        if (id) state.togglingIds[id] = true;
        state.toggleError = null;
      })
      .addCase(toggleRoomTypeActive.fulfilled, (state, action) => {
        const updated = action.payload.data;
        if (updated?.id) {
          const index = state.roomTypes.findIndex((rt) => rt.id === updated.id);
          if (index !== -1) state.roomTypes[index] = updated;
          delete state.togglingIds[updated.id];
        } else {
          // Fallback: clear all toggling flags
          state.togglingIds = {};
        }
      })
      .addCase(toggleRoomTypeActive.rejected, (state, action) => {
        const id = action.meta.arg?.roomTypeId;
        if (id) delete state.togglingIds[id];
        state.toggleError = action.payload;
      });
  },
});

export const {
  setFilters,
  setPage,
  setLimit,
  clearError,
  clearUpdateError,
  clearCreateError,
  clearDeleteError,
  clearReorderError,
  clearToggleError,
} = roomTypesSlice.actions;
export default roomTypesSlice.reducer;
