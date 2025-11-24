import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching privacy policy
export const fetchPrivacyPolicy = createAsyncThunk(
  "privacyPolicy/fetchPrivacyPolicy",
  async ({ apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.policies) {
        throw new Error("API client is required");
      }

      const response = await apiClient.policies.getPrivacyPolicy();

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error fetching privacy policy:", error);

      // Handle specific error types
      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Privacy policy not found.");
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
          "You don't have permission to view privacy policy."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch privacy policy"
      );
    }
  }
);

// Async thunk for updating privacy policy
export const updatePrivacyPolicy = createAsyncThunk(
  "privacyPolicy/updatePrivacyPolicy",
  async ({ updateData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.policies) {
        throw new Error("API client is required");
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error("At least one field must be provided for update");
      }

      const response = await apiClient.policies.updatePrivacyPolicy(updateData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error updating privacy policy:", error);

      // Handle specific error types
      if (
        error.statusCode === 400 ||
        error.status === 400 ||
        error.message?.includes("400") ||
        error.message?.includes("Bad request") ||
        error.message?.includes("Validation")
      ) {
        // Handle validation errors
        const validationErrors = error.data?.errors || [];
        const errorMessages = validationErrors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");
        return rejectWithValue(
          errorMessages || error.data?.message || "Validation failed. Please check your input."
        );
      }

      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Privacy policy not found.");
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
          "You don't have permission to update privacy policy."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to update privacy policy"
      );
    }
  }
);

const privacyPolicySlice = createSlice({
  name: "privacyPolicy",
  initialState: {
    privacyPolicy: null,
    loading: false,
    error: null,
    updating: false,
    updateError: null,
  },
  reducers: {
    clearPrivacyPolicyError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Privacy Policy
      .addCase(fetchPrivacyPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrivacyPolicy.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.privacyPolicy = action.payload.data?.privacyPolicy || null;
        }
      })
      .addCase(fetchPrivacyPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Privacy Policy
      .addCase(updatePrivacyPolicy.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updatePrivacyPolicy.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload && action.payload.success) {
          state.privacyPolicy = action.payload.data?.privacyPolicy || null;
        }
      })
      .addCase(updatePrivacyPolicy.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearPrivacyPolicyError, clearUpdateError } = privacyPolicySlice.actions;

export default privacyPolicySlice.reducer;

