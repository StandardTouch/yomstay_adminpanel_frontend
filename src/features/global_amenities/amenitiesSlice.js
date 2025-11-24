import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching amenities with query parameters
export const fetchAmenities = createAsyncThunk(
  "amenities/fetchAmenities",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Extract API client from query params
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.amenities) {
        throw new Error("API client is required");
      }

      const response = await apiClient.amenities.listAmenities(filters);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch amenities"
      );
    }
  }
);

// Async thunk for creating an amenity
export const createAmenity = createAsyncThunk(
  "amenities/createAmenity",
  async ({ amenityData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.amenities) {
        throw new Error("API client is required");
      }

      const response = await apiClient.amenities.createAmenity(amenityData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error creating amenity:", error);

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
            `Validation failed: ${errorMessages || error.data.message || "Invalid amenity data"}`
          );
        }
        return rejectWithValue(
          error.data?.message || "Invalid amenity data. Please check your input."
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
          "You don't have permission to create amenities."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to create amenity"
      );
    }
  }
);

// Async thunk for updating an amenity
export const updateAmenity = createAsyncThunk(
  "amenities/updateAmenity",
  async ({ id, amenityData, locale, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.amenities) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Amenity ID is required");
      }

      const response = await apiClient.amenities.updateAmenity(
        id,
        amenityData,
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
      console.error("Error updating amenity:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request")
      ) {
        return rejectWithValue("Invalid amenity data. Please check your input.");
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Amenity not found.");
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

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to update amenity"
      );
    }
  }
);

// Async thunk for deleting an amenity
export const deleteAmenity = createAsyncThunk(
  "amenities/deleteAmenity",
  async ({ id, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.amenities) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Amenity ID is required");
      }

      const response = await apiClient.amenities.deleteAmenity(id);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        id, // Return the deleted ID for state update
      };
    } catch (error) {
      console.error("Error deleting amenity:", error);

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
            `Cannot delete: ${errorMessages || error.data.message || "Amenity is being used by hotels or rooms"}`
          );
        }
        return rejectWithValue(
          error.data?.message || "Cannot delete amenity. It may be in use by hotels or rooms."
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Amenity not found.");
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
          "You don't have permission to delete amenities."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to delete amenity"
      );
    }
  }
);

const amenitiesSlice = createSlice({
  name: "amenities",
  initialState: {
    amenities: [],
    loading: false,
    error: null,
    // Pagination state
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
    // Filter state
    filters: {
      search: "",
      type: "hotel", // "room" or "hotel" - default to "hotel"
      locale: "en", // "en" or "ar"
    },
  },
  reducers: {
    clearAmenitiesError: (state) => {
      state.error = null;
    },
    // Update filters
    setAmenitiesFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filters change
      state.pagination.page = 1;
    },
    // Update pagination
    setAmenitiesPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    // Set locale (en/ar)
    setAmenitiesLocale: (state, action) => {
      state.filters.locale = action.payload;
      // Reset to first page when locale changes
      state.pagination.page = 1;
    },
    // Set type filter (room/hotel)
    setAmenitiesType: (state, action) => {
      state.filters.type = action.payload;
      // Reset to first page when type changes
      state.pagination.page = 1;
    },
    // Clear filters
    clearAmenitiesFilters: (state) => {
      state.filters = {
        search: "",
        type: "",
        locale: "en",
      };
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Amenities
      .addCase(fetchAmenities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAmenities.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success && action.payload.data) {
          const responseData = action.payload.data;
          // Ensure we store only serializable data
          state.amenities = JSON.parse(
            JSON.stringify(responseData.amenities || [])
          );
          if (responseData.pagination) {
            state.pagination = {
              total: responseData.pagination.total || 0,
              page: responseData.pagination.page || 1,
              limit: responseData.pagination.limit || 20,
              totalPages: responseData.pagination.totalPages || 0,
            };
          }
        }
      })
      .addCase(fetchAmenities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Amenity
      .addCase(createAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAmenity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success && action.payload.data) {
          const newAmenity = action.payload.data;
          // Add the new amenity to the beginning of the list
          state.amenities.unshift(JSON.parse(JSON.stringify(newAmenity)));
          // Update pagination total
          state.pagination.total += 1;
        }
      })
      .addCase(createAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Amenity
      .addCase(updateAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAmenity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success && action.payload.data) {
          const updatedAmenity = action.payload.data;
          // Find and update the amenity in the list
          const index = state.amenities.findIndex(
            (a) => a.id === updatedAmenity.id
          );
          if (index !== -1) {
            // Update the amenity with new data
            state.amenities[index] = JSON.parse(
              JSON.stringify(updatedAmenity)
            );
          } else {
            // If not found, add it (shouldn't happen, but handle it)
            state.amenities.push(JSON.parse(JSON.stringify(updatedAmenity)));
          }
        }
      })
      .addCase(updateAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Amenity
      .addCase(deleteAmenity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAmenity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Remove the deleted amenity from the list
          state.amenities = state.amenities.filter(
            (a) => a.id !== action.payload.id
          );
          // Update pagination total
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      })
      .addCase(deleteAmenity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearAmenitiesError,
  setAmenitiesFilters,
  setAmenitiesPagination,
  setAmenitiesLocale,
  setAmenitiesType,
  clearAmenitiesFilters,
} = amenitiesSlice.actions;
export default amenitiesSlice.reducer;

