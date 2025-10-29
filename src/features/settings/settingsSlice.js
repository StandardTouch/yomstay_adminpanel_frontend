import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Fetch platform settings from API
 */
export const fetchPlatformSettings = createAsyncThunk(
  "settings/fetchPlatformSettings",
  async ({ apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      const response = await apiClient.admin.getPlatformSettings();
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)), // Ensure serializable
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("fetchPlatformSettings error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch platform settings"
      );
    }
  }
);

/**
 * Update platform settings
 */
export const updatePlatformSettings = createAsyncThunk(
  "settings/updatePlatformSettings",
  async ({ settingsData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      if (!settingsData) {
        throw new Error("Platform settings data is required");
      }

      // Prepare payload (exclude id, createdAt, updatedAt from update)
      const { id, updatedAt, createdAt, ...updateData } = settingsData;

      const response = await apiClient.admin.updatePlatformSettings(updateData);
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)), // Ensure serializable
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updatePlatformSettings error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update platform settings"
      );
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    platformSettings: {
      id: "",
      minStartHour: 6,
      maxEndHour: 22,
      minDuration: 2,
      maxDuration: 10,
      minCheckInTime: "06:00",
      maxCheckOutTime: "22:00",
      defaultDuration: 8,
      commissionPercentage: 10,
      platformTaxPercentage: 10,
      updatedAt: null,
    },
    loading: false,
    error: null,
    updating: false,
    updateError: null,
  },
  reducers: {
    updatePlatformSettingsLocal: (state, action) => {
      state.platformSettings = {
        ...state.platformSettings,
        ...action.payload,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
    resetPlatformSettings: (state) => {
      // Reset to initial state or last fetched state
      state.platformSettings = {
        id: "",
        minStartHour: 6,
        maxEndHour: 22,
        minDuration: 2,
        maxDuration: 10,
        minCheckInTime: "06:00",
        maxCheckOutTime: "22:00",
        defaultDuration: 8,
        commissionPercentage: 10,
        platformTaxPercentage: 10,
        updatedAt: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch platform settings
      .addCase(fetchPlatformSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlatformSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.data) {
          state.platformSettings = {
            id: action.payload.data.id || "",
            minStartHour: action.payload.data.minStartHour ?? 6,
            maxEndHour: action.payload.data.maxEndHour ?? 22,
            minDuration: action.payload.data.minDuration ?? 2,
            maxDuration: action.payload.data.maxDuration ?? 10,
            minCheckInTime: action.payload.data.minCheckInTime || "06:00",
            maxCheckOutTime: action.payload.data.maxCheckOutTime || "22:00",
            defaultDuration: action.payload.data.defaultDuration ?? 8,
            commissionPercentage:
              action.payload.data.commissionPercentage ?? 10,
            platformTaxPercentage:
              action.payload.data.platformTaxPercentage ?? 10,
            updatedAt: action.payload.data.updatedAt || null,
          };
        }
      })
      .addCase(fetchPlatformSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update platform settings
      .addCase(updatePlatformSettings.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updatePlatformSettings.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload.data) {
          state.platformSettings = {
            ...state.platformSettings,
            ...action.payload.data,
            updatedAt:
              action.payload.data.updatedAt || new Date().toISOString(),
          };
        }
      })
      .addCase(updatePlatformSettings.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
  },
});

export const {
  updatePlatformSettingsLocal,
  clearError,
  clearUpdateError,
  resetPlatformSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
