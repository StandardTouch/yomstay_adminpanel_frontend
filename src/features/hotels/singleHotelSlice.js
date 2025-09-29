import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch single hotel by ID
export const fetchSingleHotel = createAsyncThunk(
  "singleHotel/fetchSingleHotel",
  async ({ hotelId, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      const response = await apiClient.admin.adminHotelsIdGet(hotelId);
      // Extract only the serializable data from the API response
      return {
        data: response.data || response,
        statusCode: response.statusCode,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("fetchSingleHotel error:", error);
      return rejectWithValue(error.message || "Failed to fetch hotel details");
    }
  }
);

// Async thunk to update single hotel
export const updateSingleHotel = createAsyncThunk(
  "singleHotel/updateSingleHotel",
  async ({ hotelId, hotelData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.hotels) {
        throw new Error("API client is required");
      }

      // Use the regular hotels API for updates since admin API doesn't have PUT method
      const response = await apiClient.hotels.hotelsIdPut(hotelId, hotelData);
      // Extract only the serializable data from the API response
      return {
        data: response.data || response,
        statusCode: response.statusCode,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updateSingleHotel error:", error);
      return rejectWithValue(error.message || "Failed to update hotel");
    }
  }
);

const singleHotelSlice = createSlice({
  name: "singleHotel",
  initialState: {
    hotel: null,
    loading: false,
    error: null,
    updating: false,
    updateError: null,
  },
  reducers: {
    clearSingleHotel: (state) => {
      state.hotel = null;
      state.error = null;
      state.updateError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch single hotel
      .addCase(fetchSingleHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleHotel.fulfilled, (state, action) => {
        state.loading = false;
        // Store the serialized hotel data - extract from nested structure
        state.hotel = action.payload.data?.hotel || action.payload.data;
        state.error = null;
      })
      .addCase(fetchSingleHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hotel = null;
      })
      // Update single hotel
      .addCase(updateSingleHotel.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateSingleHotel.fulfilled, (state, action) => {
        state.updating = false;
        // Store the serialized hotel data - extract from nested structure
        state.hotel = action.payload.data?.hotel || action.payload.data;
        state.updateError = null;
      })
      .addCase(updateSingleHotel.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearSingleHotel, clearErrors } = singleHotelSlice.actions;
export default singleHotelSlice.reducer;
