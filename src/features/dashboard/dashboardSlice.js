import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching dashboard data
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async ({ topHotelsLimit, recentBookingsLimit, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.dashboard) {
        throw new Error("API client is required");
      }

      const opts = {};
      if (topHotelsLimit !== undefined) {
        opts.topHotelsLimit = topHotelsLimit;
      }
      if (recentBookingsLimit !== undefined) {
        opts.recentBookingsLimit = recentBookingsLimit;
      }

      const response = await apiClient.dashboard.getDashboard(opts);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

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
          "You don't have permission to view dashboard data."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch dashboard data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    kpis: null,
    bookingTrends: [],
    topHotels: [],
    recentBookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success && action.payload.data) {
          state.kpis = action.payload.data.kpis || null;
          state.bookingTrends = action.payload.data.bookingTrends || [];
          state.topHotels = action.payload.data.topHotels || [];
          state.recentBookings = action.payload.data.recentBookings || [];
        }
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

