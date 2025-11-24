import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching terms of use
export const fetchTermsOfUse = createAsyncThunk(
  "termsOfUse/fetchTermsOfUse",
  async ({ apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.policies) {
        throw new Error("API client is required");
      }

      const response = await apiClient.policies.getTermsOfUse();

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error fetching terms of use:", error);

      // Handle specific error types
      if (
        error.statusCode === 404 ||
        error.status === 404 ||
        error.message?.includes("404") ||
        error.message?.includes("not found")
      ) {
        return rejectWithValue("Terms of use not found.");
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
          "You don't have permission to view terms of use."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to fetch terms of use"
      );
    }
  }
);

// Async thunk for updating terms of use
export const updateTermsOfUse = createAsyncThunk(
  "termsOfUse/updateTermsOfUse",
  async ({ updateData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.policies) {
        throw new Error("API client is required");
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error("At least one field must be provided for update");
      }

      const response = await apiClient.policies.updateTermsOfUse(updateData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error updating terms of use:", error);

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
        return rejectWithValue("Terms of use not found.");
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
          "You don't have permission to update terms of use."
        );
      }

      return rejectWithValue(
        error?.message || error?.toString() || "Failed to update terms of use"
      );
    }
  }
);

const termsOfUseSlice = createSlice({
  name: "termsOfUse",
  initialState: {
    termsOfUse: null,
    loading: false,
    error: null,
    updating: false,
    updateError: null,
  },
  reducers: {
    clearTermsOfUseError: (state) => {
      state.error = null;
    },
    clearUpdateError: (state) => {
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Terms of Use
      .addCase(fetchTermsOfUse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTermsOfUse.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.success) {
          state.termsOfUse = action.payload.data?.termsOfUse || null;
        }
      })
      .addCase(fetchTermsOfUse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Terms of Use
      .addCase(updateTermsOfUse.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateTermsOfUse.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload && action.payload.success) {
          state.termsOfUse = action.payload.data?.termsOfUse || null;
        }
      })
      .addCase(updateTermsOfUse.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      });
  },
});

export const { clearTermsOfUseError, clearUpdateError } = termsOfUseSlice.actions;

export default termsOfUseSlice.reducer;

