import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch countries
export const fetchCountries = createAsyncThunk(
  "locations/fetchCountries",
  async ({ search = "", apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.locations) {
        throw new Error("API client is required");
      }

      const response = await apiClient.locations.listCountries(search);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch countries");
    }
  }
);

// Async thunk to fetch states
export const fetchStates = createAsyncThunk(
  "locations/fetchStates",
  async ({ countryId, search = "", apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.locations) {
        throw new Error("API client is required");
      }

      const response = await apiClient.locations.listStates(
        countryId || "",
        search
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch states");
    }
  }
);

// Async thunk to fetch cities
export const fetchCities = createAsyncThunk(
  "locations/fetchCities",
  async (
    { countryId, stateId, search = "", limit, apiClient },
    { rejectWithValue }
  ) => {
    try {
      if (!apiClient?.locations) {
        throw new Error("API client is required");
      }

      const response = await apiClient.locations.listCities({
        countryId,
        stateId,
        search,
        limit,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch cities");
    }
  }
);

const locationSlice = createSlice({
  name: "locations",
  initialState: {
    // Countries
    countries: {
      data: [],
      loading: false,
      error: null,
      searchTerm: "",
    },
    // States
    states: {
      data: [],
      loading: false,
      error: null,
      searchTerm: "",
      countryId: null,
    },
    // Cities
    cities: {
      data: [],
      loading: false,
      error: null,
      searchTerm: "",
      countryId: null,
      stateId: null,
    },
  },
  reducers: {
    // Countries actions
    setCountriesSearchTerm: (state, action) => {
      state.countries.searchTerm = action.payload;
    },
    clearCountries: (state) => {
      state.countries.data = [];
      state.countries.error = null;
    },
    clearCountriesError: (state) => {
      state.countries.error = null;
    },

    // States actions
    setStatesSearchTerm: (state, action) => {
      state.states.searchTerm = action.payload;
    },
    setStatesCountryId: (state, action) => {
      state.states.countryId = action.payload;
      // Clear states when country changes
      state.states.data = [];
      state.states.searchTerm = "";
    },
    clearStates: (state) => {
      state.states.data = [];
      state.states.error = null;
    },
    clearStatesError: (state) => {
      state.states.error = null;
    },

    // Cities actions
    setCitiesSearchTerm: (state, action) => {
      state.cities.searchTerm = action.payload;
    },
    setCitiesCountryId: (state, action) => {
      state.cities.countryId = action.payload;
      // Clear cities when country changes
      state.cities.data = [];
      state.cities.stateId = null;
      state.cities.searchTerm = "";
    },
    setCitiesStateId: (state, action) => {
      state.cities.stateId = action.payload;
      // Clear cities when state changes
      state.cities.data = [];
      state.cities.searchTerm = "";
    },
    clearCities: (state) => {
      state.cities.data = [];
      state.cities.error = null;
    },
    clearCitiesError: (state) => {
      state.cities.error = null;
    },

    // Clear all location data
    clearAllLocations: (state) => {
      state.countries = {
        data: [],
        loading: false,
        error: null,
        searchTerm: "",
      };
      state.states = {
        data: [],
        loading: false,
        error: null,
        searchTerm: "",
        countryId: null,
      };
      state.cities = {
        data: [],
        loading: false,
        error: null,
        searchTerm: "",
        countryId: null,
        stateId: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Countries
      .addCase(fetchCountries.pending, (state) => {
        state.countries.loading = true;
        state.countries.error = null;
      })
      .addCase(fetchCountries.fulfilled, (state, action) => {
        state.countries.loading = false;
        state.countries.data = action.payload.data || action.payload;
        state.countries.error = null;
      })
      .addCase(fetchCountries.rejected, (state, action) => {
        state.countries.loading = false;
        state.countries.error = action.payload;
      })
      // States
      .addCase(fetchStates.pending, (state) => {
        state.states.loading = true;
        state.states.error = null;
      })
      .addCase(fetchStates.fulfilled, (state, action) => {
        state.states.loading = false;
        state.states.data = action.payload.data || action.payload;
        state.states.error = null;
      })
      .addCase(fetchStates.rejected, (state, action) => {
        state.states.loading = false;
        state.states.error = action.payload;
      })
      // Cities
      .addCase(fetchCities.pending, (state) => {
        state.cities.loading = true;
        state.cities.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.cities.loading = false;
        state.cities.data = action.payload.data || action.payload;
        state.cities.error = null;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.cities.loading = false;
        state.cities.error = action.payload;
      });
  },
});

export const {
  setCountriesSearchTerm,
  clearCountries,
  clearCountriesError,
  setStatesSearchTerm,
  setStatesCountryId,
  clearStates,
  clearStatesError,
  setCitiesSearchTerm,
  setCitiesCountryId,
  setCitiesStateId,
  clearCities,
  clearCitiesError,
  clearAllLocations,
} = locationSlice.actions;

export default locationSlice.reducer;
