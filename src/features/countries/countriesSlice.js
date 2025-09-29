import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch countries
export const fetchCountries = createAsyncThunk(
  "countries/fetchCountries",
  async ({ search = "", apiClient }, { rejectWithValue }) => {
    try {
      console.log("fetchCountries called with:", { search, apiClient });

      if (!apiClient?.locations) {
        console.error("API client or locations not available:", apiClient);
        throw new Error("API client is required");
      }

      // Build query parameters
      const opts = {};
      if (search) {
        opts.search = search;
      }

      // Remove undefined values
      Object.keys(opts).forEach(
        (key) => opts[key] === undefined && delete opts[key]
      );

      console.log("Calling countriesGet with opts:", opts);

      // Try using the generated method first, but with a different approach
      // Let's see if we can use the LocationApi method and handle the 404 differently
      try {
        const response = await apiClient.locations.countriesGet(opts);
        return response;
      } catch (error) {
        // If the generated method fails with 404, try with raw fetch
        if (error.status === 404 || error.response?.status === 404) {
          console.log("Generated method returned 404, trying raw fetch...");

          // Get the base URL and token
          const baseUrl =
            apiClient.locations.apiClient.basePath || "https://api.yomstay.com";
          const token =
            apiClient.locations.apiClient.authentications.bearerAuth
              .accessToken;

          const url = new URL("/api/v1/location/countries", baseUrl);
          if (opts.search) {
            url.searchParams.set("search", opts.search);
          }

          const response = await fetch(url.toString(), {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          return data;
        }
        throw error;
      }
    } catch (error) {
      console.error("fetchCountries error:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        response: error.response,
        body: error.body,
      });
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
