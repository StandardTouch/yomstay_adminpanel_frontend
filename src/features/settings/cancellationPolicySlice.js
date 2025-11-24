import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching cancellation policy
export const fetchCancellationPolicy = createAsyncThunk(
  "cancellationPolicy/fetchCancellationPolicy",
  async ({ apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.policies) {
        throw new Error("API client is required");
      }

      const response = await apiClient.policies.getCancellationPolicy();

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error fetching cancellation policy:", error);

      // Handle specific error types
      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Cancellation policy not found.");
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
          "You don't have permission to view cancellation policy."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch cancellation policy"
      );
    }
  }
);

// Async thunk for updating cancellation policy
export const updateCancellationPolicy = createAsyncThunk(
  "cancellationPolicy/updateCancellationPolicy",
  async ({ updateData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.policies) {
        throw new Error("API client is required");
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error("At least one field must be provided for update");
      }

      const response = await apiClient.policies.updateCancellationPolicy(updateData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error updating cancellation policy:", error);

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
        return rejectWithValue("Cancellation policy not found.");
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
          "You don't have permission to update cancellation policy."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to update cancellation policy"
      );
    }
  }
);

const cancellationPolicySlice = createSlice({
  name: "cancellationPolicy",
  initialState: {
    policy: null,
    loading: false,
    error: null,
    updating: false,
    updateError: null,
  },
  reducers: {
    clearCancellationPolicyError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cancellation Policy
      .addCase(fetchCancellationPolicy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCancellationPolicy.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.policy = action.payload.data?.policy || null;
        }
      })
      .addCase(fetchCancellationPolicy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cancellation Policy
      .addCase(updateCancellationPolicy.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateCancellationPolicy.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload && action.payload.success) {
          state.policy = action.payload.data?.policy || null;
        }
      })
      .addCase(updateCancellationPolicy.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearCancellationPolicyError, clearUpdateError } = cancellationPolicySlice.actions;

export default cancellationPolicySlice.reducer;

