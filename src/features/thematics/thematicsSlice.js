import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching thematics with query parameters
export const fetchThematics = createAsyncThunk(
  "thematics/fetchThematics",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Extract API client from query params
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.thematics) {
        throw new Error("API client is required");
      }

      const response = await apiClient.thematics.listThematics(filters);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch thematics"
      );
    }
  }
);

// Async thunk for creating a thematic
export const createThematic = createAsyncThunk(
  "thematics/createThematic",
  async ({ thematicData, locale, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.thematics) {
        throw new Error("API client is required");
      }

      const response = await apiClient.thematics.createThematic(
        thematicData,
        locale
      );

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error creating thematic:", error);

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
          return rejectWithValue(
            `Validation failed: ${errorMessages || error.data.message || "Invalid thematic data"}`
          );
        }
        return rejectWithValue(
          error.data?.message || "Invalid thematic data. Please check your input."
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
          "You don't have permission to create thematics."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to create thematic"
      );
    }
  }
);

// Async thunk for updating a thematic
export const updateThematic = createAsyncThunk(
  "thematics/updateThematic",
  async ({ id, thematicData, locale, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.thematics) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Thematic ID is required");
      }

      const response = await apiClient.thematics.updateThematic(
        id,
        thematicData,
        locale
      );

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error updating thematic:", error);

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
          return rejectWithValue(
            `Validation failed: ${errorMessages || error.data.message || "Invalid thematic data"}`
          );
        }
        return rejectWithValue(
          error.data?.message || "Invalid thematic data. Please check your input."
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Thematic not found.");
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
          "You don't have permission to update thematics."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to update thematic"
      );
    }
  }
);

// Async thunk for deleting a thematic
export const deleteThematic = createAsyncThunk(
  "thematics/deleteThematic",
  async ({ id, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.thematics) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Thematic ID is required");
      }

      const response = await apiClient.thematics.deleteThematic(id);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        id, // Return the deleted ID for state update
      };
    } catch (error) {
      console.error("Error deleting thematic:", error);

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
          return rejectWithValue(
            `Cannot delete: ${errorMessages || error.data.message || "Thematic is being used by hotels"}`
          );
        }
        return rejectWithValue(
          error.data?.message || "Cannot delete thematic. It may be in use by hotels."
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Thematic not found.");
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
          "You don't have permission to delete thematics."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to delete thematic"
      );
    }
  }
);

const thematicsSlice = createSlice({
  name: "thematics",
  initialState: {
    thematics: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    filters: {
      page: 1,
      limit: 20,
      search: undefined,
      locale: "en", // "en" or "ar" - for display only
    },
  },
  reducers: {
    clearThematicsError: (state) => {
      state.error = null;
    },
    // Update filters
    setThematicsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Set locale (en/ar) - for display only
    setThematicsLocale: (state, action) => {
      state.filters.locale = action.payload;
    },
    // Set search query
    setThematicsSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    // Set pagination
    setThematicsPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setThematicsLimit: (state, action) => {
      state.filters.limit = action.payload;
      state.filters.page = 1; // Reset to first page when limit changes
    },
    // Clear all filters
    clearThematicsFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 20,
        search: undefined,
        locale: "en",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Thematics
      .addCase(fetchThematics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThematics.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.thematics = action.payload.data?.thematics || [];
          state.pagination = action.payload.data?.pagination || {
            total: 0,
            page: 1,
            limit: 20,
            totalPages: 0,
          };
        }
      })
      .addCase(fetchThematics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Thematic
      .addCase(createThematic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThematic.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          const newThematic = action.payload.data?.thematic;
          if (newThematic) {
            state.thematics.unshift(newThematic);
            // Update pagination total
            state.pagination.total = (state.pagination.total || 0) + 1;
          }
        }
      })
      .addCase(createThematic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Thematic
      .addCase(updateThematic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateThematic.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          const updated = action.payload.data?.thematic;
          if (updated?.id) {
            const index = state.thematics.findIndex((t) => t.id === updated.id);
            if (index !== -1) {
              state.thematics[index] = {
                ...state.thematics[index],
                ...updated,
              };
            }
          }
        }
      })
      .addCase(updateThematic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Thematic
      .addCase(deleteThematic.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteThematic.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Remove the deleted thematic from the list
          state.thematics = state.thematics.filter(
            (t) => t.id !== action.payload.id
          );
          // Update pagination total
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      })
      .addCase(deleteThematic.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearThematicsError,
  setThematicsFilters,
  setThematicsLocale,
  setThematicsSearch,
  setThematicsPage,
  setThematicsLimit,
  clearThematicsFilters,
} = thematicsSlice.actions;

export default thematicsSlice.reducer;

