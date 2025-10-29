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
 * According to Swagger spec:
 * - Required: minStartHour, maxEndHour, minDuration, maxDuration
 * - Optional: minCheckInTime, maxCheckOutTime, defaultDuration, commissionPercentage, platformTaxPercentage
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

      // Validate required fields
      const requiredFields = [
        "minStartHour",
        "maxEndHour",
        "minDuration",
        "maxDuration",
      ];
      for (const field of requiredFields) {
        if (settingsData[field] === undefined || settingsData[field] === null) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Client-side validation based on Swagger spec
      const { minStartHour, maxEndHour, minDuration, maxDuration } =
        settingsData;

      // Validate minStartHour: 0-23
      if (minStartHour < 0 || minStartHour > 23) {
        throw new Error("minStartHour must be between 0 and 23");
      }

      // Validate maxEndHour: 1-23, must be > minStartHour
      if (maxEndHour < 1 || maxEndHour > 23) {
        throw new Error("maxEndHour must be between 1 and 23");
      }
      if (maxEndHour <= minStartHour) {
        throw new Error("maxEndHour must be greater than minStartHour");
      }

      // Validate durations: 1-24
      if (minDuration < 1 || minDuration > 24) {
        throw new Error("minDuration must be between 1 and 24 hours");
      }
      if (maxDuration < 1 || maxDuration > 24) {
        throw new Error("maxDuration must be between 1 and 24 hours");
      }
      if (maxDuration < minDuration) {
        throw new Error(
          "maxDuration must be greater than or equal to minDuration"
        );
      }

      // Prepare payload according to Swagger spec
      // Required fields
      const payload = {
        minStartHour,
        maxEndHour,
        minDuration,
        maxDuration,
      };

      // Optional fields - only include if they exist
      if (settingsData.minCheckInTime !== undefined) {
        payload.minCheckInTime = settingsData.minCheckInTime;
      }
      if (settingsData.maxCheckOutTime !== undefined) {
        payload.maxCheckOutTime = settingsData.maxCheckOutTime;
      }
      if (settingsData.defaultDuration !== undefined) {
        payload.defaultDuration = settingsData.defaultDuration;
      }
      if (settingsData.commissionPercentage !== undefined) {
        payload.commissionPercentage = settingsData.commissionPercentage;
      }
      if (settingsData.platformTaxPercentage !== undefined) {
        payload.platformTaxPercentage = settingsData.platformTaxPercentage;
      }

      const response = await apiClient.admin.updatePlatformSettings(payload);
      const data = response.data || response;

      return {
        statusCode: response.statusCode,
        data: JSON.parse(JSON.stringify(data)), // Ensure serializable
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updatePlatformSettings error:", error);

      // Handle validation errors (client-side or API)
      // Client-side validation errors are thrown as Error objects
      if (error instanceof Error && !error.response) {
        return rejectWithValue(error.message);
      }

      // Handle API validation errors (400 status)
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
        // Fallback for 400 without structured errors
        return rejectWithValue(
          error.response?.data?.message ||
            "Validation failed. Please check your input values."
        );
      }

      // Handle other API errors (401, 403, 500, etc.)
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
          "Failed to update platform settings. Please try again."
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
