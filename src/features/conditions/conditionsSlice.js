import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching conditions with query parameters
export const fetchConditions = createAsyncThunk(
  "conditions/fetchConditions",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Extract API client from query params
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.conditions) {
        throw new Error("API client is required");
      }

      const response = await apiClient.conditions.listConditions(filters);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch conditions"
      );
    }
  }
);

// Async thunk for reordering conditions
export const reorderConditions = createAsyncThunk(
  "conditions/reorderConditions",
  async ({ orders, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.conditions) {
        throw new Error("API client is required");
      }

      if (!Array.isArray(orders) || orders.length === 0) {
        throw new Error("orders array is required");
      }

      const payload = {
        orders: orders.map(({ id, sortOrder }) => ({ id, sortOrder })),
      };

      const response = await apiClient.conditions.reorderConditions(payload);
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)),
        message: response.message,
        success: response.success,
        orders: payload.orders,
      };
    } catch (error) {
      console.error("Error reordering conditions:", error);

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

      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized. Please sign in again.");
      }

      if (error.response?.status === 403) {
        return rejectWithValue("Forbidden. Admin access required.");
      }

      if (error.response?.status === 404) {
        return rejectWithValue("Some conditions not found.");
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reorder conditions"
      );
    }
  }
);

// Async thunk for toggling active status
export const toggleConditionActive = createAsyncThunk(
  "conditions/toggleConditionActive",
  async ({ conditionId, isActive, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.conditions) {
        throw new Error("API client is required");
      }

      if (!conditionId) {
        throw new Error("Condition ID is required");
      }

      const body = {};
      if (typeof isActive === "boolean") {
        body.isActive = isActive;
      }

      const response = await apiClient.conditions.toggleActive(conditionId, isActive);
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)),
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error toggling active status:", error);

      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized. Please sign in again.");
      }

      if (error.response?.status === 403) {
        return rejectWithValue("Forbidden. Admin access required.");
      }

      if (error.response?.status === 404) {
        return rejectWithValue("Condition not found.");
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status"
      );
    }
  }
);

// Async thunk for creating a condition
export const createCondition = createAsyncThunk(
  "conditions/createCondition",
  async ({ conditionData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.conditions) {
        throw new Error("API client is required");
      }

      if (!conditionData) {
        throw new Error("Condition data is required");
      }

      if (!conditionData.name || !conditionData.displayName) {
        throw new Error("Name and displayName are required");
      }

      const response = await apiClient.conditions.createCondition(conditionData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error creating condition:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request")
      ) {
        // Check if there are validation errors in the response
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          const errorMessages = error.data.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          return rejectWithValue(`Validation failed: ${errorMessages}`);
        }
        return rejectWithValue(
          error.data?.message || "Invalid condition data"
        );
      }

      if (
        error.statusCode === 409 ||
        error.status === 409 ||
        error.message?.includes("409") ||
        error.message?.includes("Conflict")
      ) {
        return rejectWithValue(
          error.data?.message || "Condition name already exists"
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
          "You don't have permission to create conditions."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to create condition"
      );
    }
  }
);

// Async thunk for updating a condition (full update)
export const updateCondition = createAsyncThunk(
  "conditions/updateCondition",
  async ({ id, conditionData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.conditions) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Condition ID is required");
      }

      if (!conditionData) {
        throw new Error("Condition data is required");
      }

      const response = await apiClient.conditions.updateCondition(
        id,
        conditionData
      );

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        id,
      };
    } catch (error) {
      console.error("Error updating condition:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request")
      ) {
        // Check if there are validation errors in the response
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          const errorMessages = error.data.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          return rejectWithValue(`Validation failed: ${errorMessages}`);
        }
        return rejectWithValue(
          error.data?.message || "Invalid condition data"
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Condition not found.");
      }

      if (
        error.statusCode === 409 ||
        error.status === 409 ||
        error.message?.includes("409") ||
        error.message?.includes("Conflict")
      ) {
        return rejectWithValue(
          error.data?.message || "Condition name already exists"
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
          "You don't have permission to update conditions."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to update condition"
      );
    }
  }
);

// Async thunk for deleting a condition
export const deleteCondition = createAsyncThunk(
  "conditions/deleteCondition",
  async ({ id, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.conditions) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Condition ID is required");
      }

      const response = await apiClient.conditions.deleteCondition(id);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        id, // Return the deleted ID for state update
      };
    } catch (error) {
      console.error("Error deleting condition:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request")
      ) {
        return rejectWithValue(
          error.data?.message || "Cannot delete condition"
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Condition not found.");
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
          "You don't have permission to delete conditions."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to delete condition"
      );
    }
  }
);

const conditionsSlice = createSlice({
  name: "conditions",
  initialState: {
    conditions: [],
    loading: false,
    error: null,
    totalCount: 0,
    // Filter state
    filters: {
      isActive: true, // Default to active only (exclude soft-deleted conditions)
      isRequired: undefined, // undefined = all, true = required only, false = optional only
      sortBy: "sortOrder",
      sortOrder: "asc",
      search: "", // Search query
      locale: "en", // "en" or "ar" - for display only
    },
  },
  reducers: {
    clearConditionsError: (state) => {
      state.error = null;
    },
    // Update filters
    setConditionsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Set locale (en/ar) - for display only
    setConditionsLocale: (state, action) => {
      state.filters.locale = action.payload;
    },
    // Toggle active filter
    setActiveFilter: (state, action) => {
      state.filters.isActive = action.payload; // true, false, or undefined
    },
    // Toggle required filter
    setRequiredFilter: (state, action) => {
      state.filters.isRequired = action.payload; // true, false, or undefined
    },
    // Set sort
    setSort: (state, action) => {
      state.filters.sortBy = action.payload.sortBy;
      state.filters.sortOrder = action.payload.sortOrder;
    },
    // Set search
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    // Clear filters
    clearConditionsFilters: (state) => {
      state.filters = {
        isActive: undefined,
        isRequired: undefined,
        sortBy: "sortOrder",
        sortOrder: "asc",
        search: "",
        locale: "en",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Conditions
      .addCase(fetchConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConditions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success && action.payload.data) {
          const responseData = action.payload.data;
          // Ensure we store only serializable data
          state.conditions = JSON.parse(
            JSON.stringify(responseData.conditions || [])
          );
          state.totalCount = responseData.totalCount || 0;
        }
      })
      .addCase(fetchConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reorder Conditions
      .addCase(reorderConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderConditions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          const orders = action.payload.orders;
          const idToOrder = new Map(orders.map((o) => [o.id, o.sortOrder]));
          state.conditions = state.conditions
            .map((c) =>
              idToOrder.has(c.id)
                ? { ...c, sortOrder: idToOrder.get(c.id) }
                : c
            )
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        }
      })
      .addCase(reorderConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Toggle Active
      .addCase(toggleConditionActive.pending, (state, action) => {
        const id = action.meta.arg?.conditionId;
        if (id) {
          state.togglingIds = state.togglingIds || {};
          state.togglingIds[id] = true;
        }
        state.toggleError = null;
      })
      .addCase(toggleConditionActive.fulfilled, (state, action) => {
        const updated = action.payload.data?.condition;
        if (updated?.id) {
          const index = state.conditions.findIndex((c) => c.id === updated.id);
          if (index !== -1) {
            state.conditions[index] = updated;
          }
          if (state.togglingIds) {
            delete state.togglingIds[updated.id];
          }
        } else {
          // Fallback: clear all toggling flags
          if (state.togglingIds) {
            state.togglingIds = {};
          }
        }
      })
      .addCase(toggleConditionActive.rejected, (state, action) => {
        const id = action.meta.arg?.conditionId;
        if (id && state.togglingIds) {
          delete state.togglingIds[id];
        }
        state.toggleError = action.payload;
      })
      // Update Condition (Full Update)
      .addCase(updateCondition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCondition.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          const { id, data } = action.payload;
          // API returns data.condition with the updated condition
          const updatedCondition = data?.condition;
          if (updatedCondition) {
            const index = state.conditions.findIndex((c) => c.id === id);
            if (index !== -1) {
              state.conditions[index] = {
                ...state.conditions[index],
                ...updatedCondition,
              };
            }
          }
        }
      })
      .addCase(updateCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Condition
      .addCase(createCondition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCondition.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          const newCondition = action.payload.data?.condition;
          if (newCondition) {
            // Add the new condition to the list
            state.conditions.push(newCondition);
            state.totalCount = (state.totalCount || 0) + 1;
          }
        }
      })
      .addCase(createCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Condition (soft delete - sets isActive to false)
      .addCase(deleteCondition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCondition.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Soft delete: Update the condition's isActive to false instead of removing it
          const updated = action.payload.data?.condition;
          if (updated?.id) {
            const index = state.conditions.findIndex((c) => c.id === updated.id);
            if (index !== -1) {
              // Update the condition with the response data (which has isActive: false)
              state.conditions[index] = {
                ...state.conditions[index],
                ...updated,
                isActive: false, // Ensure isActive is false after soft delete
              };
            } else {
              // If condition not in current list, add it (shouldn't happen, but handle it)
              state.conditions.push({ ...updated, isActive: false });
            }
          } else {
            // Fallback: if condition not in response, find by id and set isActive to false
            const deletedId = action.meta.arg?.id;
            if (deletedId) {
              const condition = state.conditions.find((c) => c.id === deletedId);
              if (condition) {
                condition.isActive = false;
              }
            }
          }
        }
      })
      .addCase(deleteCondition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearConditionsError,
  setConditionsFilters,
  setConditionsLocale,
  setActiveFilter,
  setRequiredFilter,
  setSort,
  setSearch,
  clearConditionsFilters,
} = conditionsSlice.actions;
export default conditionsSlice.reducer;

