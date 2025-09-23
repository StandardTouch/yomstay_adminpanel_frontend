import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching hotels with search and filtering
export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.hotels) {
        throw new Error("API client is required");
      }

      // Extract filter parameters
      const {
        search,
        city,
        state,
        country,
        lat,
        lng,
        page = 1,
        pageSize = 20,
      } = filters;

      // Build opts object for StandardTouch API
      const opts = {
        search,
        city,
        state,
        country,
        lat,
        lng,
        page,
        pageSize,
        // Try to include images if the API supports it
        include: "images",
      };

      // Remove undefined values
      Object.keys(opts).forEach(
        (key) => opts[key] === undefined && delete opts[key]
      );

      const response = await apiClient.hotels.hotelsGet(opts);

      // Debug logging to see the actual API response
      console.log("fetchHotels - API response:", response);
      console.log("fetchHotels - response.data:", response.data);
      console.log("fetchHotels - response.data.hotels:", response.data?.hotels);
      console.log(
        "fetchHotels - first hotel structure:",
        response.data?.hotels?.[0]
      );
      console.log(
        "fetchHotels - first hotel images:",
        response.data?.hotels?.[0]?.images
      );
      console.log(
        "fetchHotels - first hotel featuredImage:",
        response.data?.hotels?.[0]?.featuredImage
      );

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch hotels");
    }
  }
);

// Async thunk for creating a new hotel
export const createHotel = createAsyncThunk(
  "hotels/createHotel",
  async ({ hotelData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.hotels) {
        throw new Error("API client is required");
      }

      const response = await apiClient.hotels.hotelsPost(hotelData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create hotel");
    }
  }
);

// Async thunk for updating a hotel
export const updateHotel = createAsyncThunk(
  "hotels/updateHotel",
  async ({ hotelId, hotelData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.hotels) {
        throw new Error("API client is required");
      }

      const response = await apiClient.hotels.hotelsIdPut(hotelId, hotelData);

      // Return only serializable data to avoid Redux warnings
      return {
        statusCode: response.statusCode,
        data: response.data ? JSON.parse(JSON.stringify(response.data)) : null,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update hotel");
    }
  }
);

// Async thunk for deleting a hotel
export const deleteHotel = createAsyncThunk(
  "hotels/deleteHotel",
  async ({ hotelId, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.hotels) {
        throw new Error("API client is required");
      }

      const response = await apiClient.hotels.hotelsIdDelete(hotelId);
      return { response, hotelId };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete hotel");
    }
  }
);

// Async thunk for fetching hotels for dropdown (optimized for dropdowns)
export const fetchHotelsForDropdown = createAsyncThunk(
  "hotels/fetchHotelsForDropdown",
  async (queryParams = {}, { rejectWithValue }) => {
    try {
      const { apiClient, ...filters } = queryParams;

      if (!apiClient?.hotels) {
        throw new Error("API client is required");
      }

      const {
        search = "",
        city = "",
        state = "",
        country = "",
        page = 1,
        pageSize = 100, // Larger page size for dropdown
      } = filters;

      const opts = {
        search,
        city,
        state,
        country,
        page,
        pageSize,
      };

      // Remove undefined values
      Object.keys(opts).forEach(
        (key) => opts[key] === undefined && delete opts[key]
      );

      const response = await apiClient.hotels.hotelsGet(opts);

      // Transform response for dropdown usage and ensure serializability
      if (response.success && response.data?.hotels) {
        const transformedHotels = response.data.hotels.map((hotel) => {
          // Deep clone the hotel object to ensure all nested objects are plain objects
          const serializedHotel = JSON.parse(JSON.stringify(hotel));

          return {
            id: serializedHotel.id,
            name: serializedHotel.name,
            status: serializedHotel.status || "active",
            address: serializedHotel.address,
            postalCode: serializedHotel.postalCode,
            description: serializedHotel.description,
            starRating: serializedHotel.starRating,
            numberOfRooms: serializedHotel.numberOfRooms,
            ownerId: serializedHotel.ownerId,
            location: serializedHotel.location,
            // Serialize nested objects to ensure they're plain objects
            country: serializedHotel.country
              ? {
                  id: serializedHotel.country.id,
                  name: serializedHotel.country.name,
                }
              : null,
            state: serializedHotel.state
              ? {
                  id: serializedHotel.state.id,
                  name: serializedHotel.state.name,
                }
              : null,
            city: serializedHotel.city
              ? {
                  id: serializedHotel.city.id,
                  name: serializedHotel.city.name,
                }
              : null,
            createdAt: serializedHotel.createdAt
              ? new Date(serializedHotel.createdAt).toISOString()
              : null,
            updatedAt: serializedHotel.updatedAt
              ? new Date(serializedHotel.updatedAt).toISOString()
              : null,
            // For dropdown display
            badge: serializedHotel.status || "active",
            searchableText: `${serializedHotel.name} ${
              serializedHotel.city?.name || ""
            } ${serializedHotel.state?.name || ""} ${
              serializedHotel.country?.name || ""
            }`.toLowerCase(),
          };
        });

        // Return only serializable data
        return {
          statusCode: response.statusCode,
          data: {
            hotels: transformedHotels,
            total: response.data.total || 0,
            page: response.data.page || 1,
            pageSize: response.data.pageSize || 100,
          },
          message: response.message,
          success: response.success,
        };
      }

      // Return serializable response even if no hotels
      return {
        statusCode: response.statusCode,
        data: {
          hotels: [],
          total: 0,
          page: 1,
          pageSize: 100,
        },
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch hotels for dropdown"
      );
    }
  }
);

const hotelsSlice = createSlice({
  name: "hotels",
  initialState: {
    // Main hotels data
    hotels: [],
    loading: false,
    error: null,

    // Pagination
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },

    // Filters
    filters: {
      search: "",
      city: "",
      state: "",
      country: "",
      lat: null,
      lng: null,
    },

    // Dropdown specific data
    dropdownHotels: [],
    dropdownLoading: false,
    dropdownError: null,

    // CRUD operations
    creating: false,
    updating: false,
    deleting: false,
  },
  reducers: {
    // Set filters
    setHotelFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Set pagination
    setHotelPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Clear filters
    clearHotelFilters: (state) => {
      state.filters = {
        search: "",
        city: "",
        state: "",
        country: "",
        lat: null,
        lng: null,
      };
    },

    // Clear errors
    clearHotelError: (state) => {
      state.error = null;
    },

    // Clear dropdown error
    clearDropdownError: (state) => {
      state.dropdownError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch hotels
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we store only serializable data
        const hotelsData = action.payload.data?.hotels || [];
        console.log("fetchHotels.fulfilled - hotelsData:", hotelsData);
        console.log("fetchHotels.fulfilled - first hotel:", hotelsData[0]);
        console.log(
          "fetchHotels.fulfilled - first hotel images:",
          hotelsData[0]?.images
        );

        // Ensure each hotel has an images array (fallback for API that doesn't return images)
        const hotelsWithImages = hotelsData.map((hotel) => ({
          ...hotel,
          images: hotel.images || [],
          featuredImage: hotel.featuredImage || null,
        }));

        state.hotels = JSON.parse(JSON.stringify(hotelsWithImages));
        if (action.payload.data) {
          state.pagination.total = action.payload.data.total || 0;
          state.pagination.page = action.payload.data.page || 1;
          state.pagination.pageSize = action.payload.data.pageSize || 20;
        }
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch hotels for dropdown
      .addCase(fetchHotelsForDropdown.pending, (state) => {
        state.dropdownLoading = true;
        state.dropdownError = null;
      })
      .addCase(fetchHotelsForDropdown.fulfilled, (state, action) => {
        state.dropdownLoading = false;
        // Ensure we store only serializable data
        const hotelsData = action.payload.data?.hotels || [];
        state.dropdownHotels = JSON.parse(JSON.stringify(hotelsData));
      })
      .addCase(fetchHotelsForDropdown.rejected, (state, action) => {
        state.dropdownLoading = false;
        state.dropdownError = action.payload;
      })

      // Create hotel
      .addCase(createHotel.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload.data) {
          state.hotels.unshift(action.payload.data);
          state.pagination.total += 1;
        }
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Update hotel
      .addCase(updateHotel.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.updating = false;
        if (action.payload.data) {
          const index = state.hotels.findIndex(
            (h) => h.id === action.payload.data.id
          );
          if (index !== -1) {
            state.hotels[index] = action.payload.data;
          }
        }
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete hotel
      .addCase(deleteHotel.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.deleting = false;
        const hotelId = action.payload.hotelId;
        state.hotels = state.hotels.filter((h) => h.id !== hotelId);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const {
  setHotelFilters,
  setHotelPagination,
  clearHotelFilters,
  clearHotelError,
  clearDropdownError,
} = hotelsSlice.actions;

export default hotelsSlice.reducer;
