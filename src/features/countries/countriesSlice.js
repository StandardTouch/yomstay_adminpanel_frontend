import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch countries
export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async ({ search = "", apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.locations) {
        throw new Error("API client is required");
      }

      const response = await apiClient.locations.listCountries(search);
      return response;
    } catch (error) {
      console.error("fetchCountries error:", error);
      return rejectWithValue(error.message || "Failed to fetch countries");
    }
  }
);

const countriesSlice = createSlice({
  name: "countries",
  initialState: {
    data: [],
    loading: false,
    error: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearCountries: (state) => {
      state.data = [];
      state.error = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCountries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, clearCountries, clearErrors } =
  countriesSlice.actions;
export default countriesSlice.reducer;
