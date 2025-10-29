import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching hotel requests
export const fetchHotelRequests = createAsyncThunk(
  "hotelRequests/fetchHotelRequests",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.hotelRequests) {
        throw new Error("API client is required");
      }

      const response = await apiClient.hotelRequests.listRequests(filters);

      // Debug logging to see the actual API response
      console.log("fetchHotelRequests - API response:", response);
      console.log("fetchHotelRequests - response.data:", response.data);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch hotel requests");
    }
  }
);

// Async thunk for handling hotel request (approve, reject, needs_completion)
export const handleHotelRequest = createAsyncThunk(
  "hotelRequests/handleHotelRequest",
  async ({ requestId, status, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.hotelRequests) {
        throw new Error("API client is required");
      }

      const response = await apiClient.hotelRequests.handleRequest(
        requestId,
        status
      );

      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
        requestId,
        status,
      };
    } catch (error) {
      return rejectWithValue(
        error.message || `Failed to ${status} hotel request`
      );
    }
  }
);

const hotelRequestsSlice = createSlice({
  name: "hotelRequests",
  initialState: {
    // Main hotel requests data
    hotelRequests: [],
    loading: false,
    error: null,

    // CRUD operations
    handling: false,

    // Action errors
    handleError: null,
  },
  reducers: {
    // Clear errors
    clearHotelRequestError: (state) => {
      state.error = null;
    },

    // Clear action errors
    clearHandleError: (state) => {
      state.handleError = null;
    },

    // Clear all errors
    clearAllErrors: (state) => {
      state.error = null;
      state.handleError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hotel requests
      .addCase(fetchHotelRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotelRequests.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the updated API structure with nested hotelRequests
        const requestsData = action.payload.data?.hotelRequests || [];
        console.log(
          "fetchHotelRequests.fulfilled - requestsData:",
          requestsData
        );
        console.log(
          "fetchHotelRequests.fulfilled - first request:",
          requestsData[0]
        );
        console.log(
          "fetchHotelRequests.fulfilled - first hotel location:",
          requestsData[0]?.hotel?.country,
          requestsData[0]?.hotel?.state,
          requestsData[0]?.hotel?.city
        );
        console.log(
          "fetchHotelRequests.fulfilled - first hotel object:",
          requestsData[0]?.hotel
        );

        state.hotelRequests = JSON.parse(JSON.stringify(requestsData));
      })
      .addCase(fetchHotelRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle hotel request (approve, reject, needs_completion)
      .addCase(handleHotelRequest.pending, (state) => {
        state.handling = true;
        state.handleError = null;
      })
      .addCase(handleHotelRequest.fulfilled, (state, action) => {
        state.handling = false;
        if (action.payload.success) {
          // Update the request status in the list
          const index = state.hotelRequests.findIndex(
            (req) => req.id === action.payload.requestId
          );
          if (index !== -1) {
            state.hotelRequests[index].status = action.payload.status;
          }
        }
      })
      .addCase(handleHotelRequest.rejected, (state, action) => {
        state.handling = false;
        state.handleError = action.payload;
      });
  },
});

export const { clearHotelRequestError, clearHandleError, clearAllErrors } =
  hotelRequestsSlice.actions;

export default hotelRequestsSlice.reducer;
