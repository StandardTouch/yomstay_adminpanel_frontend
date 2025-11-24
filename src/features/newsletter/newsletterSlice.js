import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching newsletter subscriptions with query parameters
export const fetchNewsletterSubscriptions = createAsyncThunk(
  "newsletter/fetchNewsletterSubscriptions",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Extract API client from query params
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.newsletter) {
        throw new Error("API client is required");
      }

      const response = await apiClient.newsletter.getNewsletterSubscriptions(filters);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch newsletter subscriptions"
      );
    }
  }
);

// Async thunk for deleting a newsletter subscription
export const deleteNewsletterSubscription = createAsyncThunk(
  "newsletter/deleteNewsletterSubscription",
  async ({ id, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.newsletter) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Newsletter subscription ID is required");
      }

      const response = await apiClient.newsletter.deleteNewsletterSubscription(id);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        id, // Return the deleted ID for state update
      };
    } catch (error) {
      console.error("Error deleting newsletter subscription:", error);

      // Handle specific error types
      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Newsletter subscription not found.");
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
          "You don't have permission to delete newsletter subscriptions."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to delete newsletter subscription"
      );
    }
  }
);

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    subscriptions: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
    },
    filters: {
      page: 1,
      limit: 50,
      search: undefined,
    },
  },
  reducers: {
    clearNewsletterError: (state) => {
      state.error = null;
    },
    // Update filters
    setNewsletterFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Set search query
    setNewsletterSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    // Set pagination
    setNewsletterPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setNewsletterLimit: (state, action) => {
      state.filters.limit = action.payload;
      state.filters.page = 1; // Reset to first page when limit changes
    },
    // Clear all filters
    clearNewsletterFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 50,
        search: undefined,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Newsletter Subscriptions
      .addCase(fetchNewsletterSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsletterSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.subscriptions = action.payload.data?.subscriptions || [];
          state.pagination = action.payload.data?.pagination || {
            total: 0,
            page: 1,
            limit: 50,
            totalPages: 0,
          };
        }
      })
      .addCase(fetchNewsletterSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Newsletter Subscription
      .addCase(deleteNewsletterSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNewsletterSubscription.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          // Remove the deleted subscription from the list
          state.subscriptions = state.subscriptions.filter(
            (s) => s.id !== action.payload.id
          );
          // Update pagination total
          state.pagination.total = Math.max(0, state.pagination.total - 1);
        }
      })
      .addCase(deleteNewsletterSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearNewsletterError,
  setNewsletterFilters,
  setNewsletterSearch,
  setNewsletterPage,
  setNewsletterLimit,
  clearNewsletterFilters,
} = newsletterSlice.actions;

export default newsletterSlice.reducer;

