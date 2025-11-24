import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching contact requests with query parameters
export const fetchContactRequests = createAsyncThunk(
  "contactRequests/fetchContactRequests",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      // Extract API client from query params
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.contactRequests) {
        throw new Error("API client is required");
      }

      const response = await apiClient.contactRequests.getContactRequests(filters);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch contact requests"
      );
    }
  }
);

// Async thunk for fetching a single contact request by ID
export const fetchContactRequestById = createAsyncThunk(
  "contactRequests/fetchContactRequestById",
  async ({ id, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.contactRequests) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Contact request ID is required");
      }

      const response = await apiClient.contactRequests.getContactRequestById(id);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error fetching contact request:", error);

      // Handle specific error types
      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Contact request not found.");
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
          "You don't have permission to view contact requests."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch contact request"
      );
    }
  }
);

// Async thunk for updating contact request status
export const updateContactRequestStatus = createAsyncThunk(
  "contactRequests/updateContactRequestStatus",
  async ({ id, status, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.contactRequests) {
        throw new Error("API client is required");
      }

      if (!id) {
        throw new Error("Contact request ID is required");
      }

      if (!status) {
        throw new Error("Status is required");
      }

      const response = await apiClient.contactRequests.updateContactRequestStatus(id, status);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error updating contact request status:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request")
      ) {
        return rejectWithValue(
          error.data?.message || "Invalid status. Please check your input."
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Contact request not found.");
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
          "You don't have permission to update contact requests."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to update contact request status"
      );
    }
  }
);

const contactRequestsSlice = createSlice({
  name: "contactRequests",
  initialState: {
    requests: [],
    currentRequest: null,
    pastRequests: [], // Past contact requests from the same email
    loading: false,
    loadingSingle: false,
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
      status: undefined, // open, in_progress, resolved, closed
      search: undefined,
    },
  },
  reducers: {
    clearContactRequestsError: (state) => {
      state.error = null;
    },
    // Update filters
    setContactRequestsFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Set status filter
    setContactRequestsStatus: (state, action) => {
      state.filters.status = action.payload;
      state.filters.page = 1; // Reset to first page when status changes
    },
    // Set search query
    setContactRequestsSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    // Set pagination
    setContactRequestsPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setContactRequestsLimit: (state, action) => {
      state.filters.limit = action.payload;
      state.filters.page = 1; // Reset to first page when limit changes
    },
    // Clear current request
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
      state.pastRequests = [];
    },
    // Clear all filters
    clearContactRequestsFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 50,
        status: undefined,
        search: undefined,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Contact Requests
      .addCase(fetchContactRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactRequests.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.requests = action.payload.data?.requests || [];
          state.pagination = action.payload.data?.pagination || {
            total: 0,
            page: 1,
            limit: 50,
            totalPages: 0,
          };
        }
      })
      .addCase(fetchContactRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Contact Request
      .addCase(fetchContactRequestById.pending, (state) => {
        state.loadingSingle = true;
        state.error = null;
      })
      .addCase(fetchContactRequestById.fulfilled, (state, action) => {
        state.loadingSingle = false;
        if (action.payload && action.payload.success) {
          state.currentRequest = action.payload.data?.request || null;
          state.pastRequests = action.payload.data?.pastRequests || [];
        }
      })
      .addCase(fetchContactRequestById.rejected, (state, action) => {
        state.loadingSingle = false;
        state.error = action.payload;
      })
      // Update Contact Request Status
      .addCase(updateContactRequestStatus.pending, (state) => {
        state.loadingSingle = true;
        state.error = null;
      })
      .addCase(updateContactRequestStatus.fulfilled, (state, action) => {
        state.loadingSingle = false;
        if (action.payload && action.payload.success) {
          const updated = action.payload.data?.request;
          if (updated?.id) {
            // Update current request if it's the one being updated
            if (state.currentRequest?.id === updated.id) {
              state.currentRequest = {
                ...state.currentRequest,
                ...updated,
              };
            }
            // Update in requests list if it exists there
            const index = state.requests.findIndex((r) => r.id === updated.id);
            if (index !== -1) {
              state.requests[index] = {
                ...state.requests[index],
                ...updated,
              };
            }
          }
        }
      })
      .addCase(updateContactRequestStatus.rejected, (state, action) => {
        state.loadingSingle = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearContactRequestsError,
  setContactRequestsFilters,
  setContactRequestsStatus,
  setContactRequestsSearch,
  setContactRequestsPage,
  setContactRequestsLimit,
  clearCurrentRequest,
  clearContactRequestsFilters,
} = contactRequestsSlice.actions;

export default contactRequestsSlice.reducer;

