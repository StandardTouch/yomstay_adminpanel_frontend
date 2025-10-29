import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch single hotel by ID
export const fetchSingleHotel = createAsyncThunk(
  "singleHotel/fetchSingleHotel",
  async ({ hotelId, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      const response = await apiClient.admin.getHotelById(hotelId);

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

// Async thunk to update hotel overview (base info)
export const updateHotelOverview = createAsyncThunk(
  "singleHotel/updateHotelOverview",
  async ({ hotelId, hotelData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      // Build payload with only hotel base fields
      const payload = {
        hotel: {
          name: hotelData.name,
          status: hotelData.status,
          address: hotelData.address,
          neighborhood: hotelData.neighborhood,
          postalCode: hotelData.postalCode,
          description: hotelData.description,
          countryCode: hotelData.countryCode,
          starRating: hotelData.starRating,
          numberOfRooms: hotelData.numberOfRooms,
          freeCancellationPolicy: hotelData.freeCancellationPolicy,
          latitude: hotelData.location?.lat,
          longitude: hotelData.location?.lng,
        },
      };

      // Remove undefined values
      Object.keys(payload.hotel).forEach(
        (key) => payload.hotel[key] === undefined && delete payload.hotel[key]
      );

      const response = await apiClient.admin.updateHotel(hotelId, payload);

      return {
        data: response.data || response,
        statusCode: response.statusCode,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updateHotelOverview error:", error);
      return rejectWithValue(
        error.message || "Failed to update hotel overview"
      );
    }
  }
);

// Async thunk to update amenities and FAQs
export const updateHotelAmenitiesAndFaqs = createAsyncThunk(
  "singleHotel/updateHotelAmenitiesAndFaqs",
  async ({ hotelId, amenities, faq, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      const payload = {
        amenities: amenities.map((a) => a.id), // Extract IDs only
        faq: faq.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
      };

      const response = await apiClient.admin.updateHotel(hotelId, payload);

      return {
        data: response.data || response,
        statusCode: response.statusCode,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updateHotelAmenitiesAndFaqs error:", error);
      return rejectWithValue(
        error.message || "Failed to update amenities and FAQs"
      );
    }
  }
);

// Async thunk to update thematics
export const updateHotelThematics = createAsyncThunk(
  "singleHotel/updateHotelThematics",
  async ({ hotelId, thematics, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      const payload = {
        thematics: thematics.map((t) => t.id), // Extract IDs only
      };

      const response = await apiClient.admin.updateHotel(hotelId, payload);

      return {
        data: response.data || response,
        statusCode: response.statusCode,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updateHotelThematics error:", error);
      return rejectWithValue(error.message || "Failed to update thematics");
    }
  }
);

// Async thunk to update conditions
export const updateHotelConditions = createAsyncThunk(
  "singleHotel/updateHotelConditions",
  async ({ hotelId, conditions, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      const payload = {
        conditions: conditions.map((c) => ({
          conditionId: c.conditionId || c.id,
          isAccepted: c.isAccepted,
        })),
      };

      const response = await apiClient.admin.updateHotel(hotelId, payload);

      return {
        data: response.data || response,
        statusCode: response.statusCode,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updateHotelConditions error:", error);
      return rejectWithValue(error.message || "Failed to update conditions");
    }
  }
);

// Async thunk to update taxes
export const updateHotelTaxes = createAsyncThunk(
  "singleHotel/updateHotelTaxes",
  async ({ hotelId, taxes, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.admin) {
        throw new Error("API client is required");
      }

      const payload = {
        taxes: taxes.map((t) => ({
          name: t.name,
          taxType: t.taxType,
          rate: t.taxType === "percentage" ? t.rate : undefined,
          amount: t.taxType === "fixed_fee" ? t.amount : undefined,
          description: t.description,
          isActive: t.isActive,
        })),
      };

      // Remove undefined values from each tax object
      payload.taxes.forEach((tax) => {
        Object.keys(tax).forEach(
          (key) => tax[key] === undefined && delete tax[key]
        );
      });

      const response = await apiClient.admin.updateHotel(hotelId, payload);

      return {
        data: response.data || response,
        statusCode: response.statusCode,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("updateHotelTaxes error:", error);
      return rejectWithValue(error.message || "Failed to update taxes");
    }
  }
);

// Legacy update method - kept for backward compatibility
export const updateSingleHotel = createAsyncThunk(
  "singleHotel/updateSingleHotel",
  async ({ hotelId, hotelData, apiClient }, { rejectWithValue }) => {
    try {
      if (!apiClient?.hotels) {
        throw new Error("API client is required");
      }

      // Use the regular hotels API for updates
      const response = await apiClient.hotels.updateHotel(hotelId, hotelData);

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

    // Legacy update state (deprecated - use section-specific states)
    updating: false,
    updateError: null,

    // Section-specific loading states
    updatingOverview: false,
    updatingAmenities: false,
    updatingThematics: false,
    updatingConditions: false,
    updatingTaxes: false,

    // Section-specific error states
    overviewError: null,
    amenitiesError: null,
    thematicsError: null,
    conditionsError: null,
    taxesError: null,
  },
  reducers: {
    clearSingleHotel: (state) => {
      state.hotel = null;
      state.error = null;
      state.updateError = null;
      state.overviewError = null;
      state.amenitiesError = null;
      state.thematicsError = null;
      state.conditionsError = null;
      state.taxesError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.overviewError = null;
      state.amenitiesError = null;
      state.thematicsError = null;
      state.conditionsError = null;
      state.taxesError = null;
    },
    clearSectionError: (state, action) => {
      const section = action.payload;
      if (section === "overview") state.overviewError = null;
      if (section === "amenities") state.amenitiesError = null;
      if (section === "thematics") state.thematicsError = null;
      if (section === "conditions") state.conditionsError = null;
      if (section === "taxes") state.taxesError = null;
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

      // Update hotel overview
      .addCase(updateHotelOverview.pending, (state) => {
        state.updatingOverview = true;
        state.overviewError = null;
      })
      .addCase(updateHotelOverview.fulfilled, (state, action) => {
        state.updatingOverview = false;
        // Update hotel data with response
        state.hotel = action.payload.data?.hotel || action.payload.data;
        state.overviewError = null;
      })
      .addCase(updateHotelOverview.rejected, (state, action) => {
        state.updatingOverview = false;
        state.overviewError = action.payload;
      })

      // Update amenities and FAQs
      .addCase(updateHotelAmenitiesAndFaqs.pending, (state) => {
        state.updatingAmenities = true;
        state.amenitiesError = null;
      })
      .addCase(updateHotelAmenitiesAndFaqs.fulfilled, (state, action) => {
        state.updatingAmenities = false;
        state.hotel = action.payload.data?.hotel || action.payload.data;
        state.amenitiesError = null;
      })
      .addCase(updateHotelAmenitiesAndFaqs.rejected, (state, action) => {
        state.updatingAmenities = false;
        state.amenitiesError = action.payload;
      })

      // Update thematics
      .addCase(updateHotelThematics.pending, (state) => {
        state.updatingThematics = true;
        state.thematicsError = null;
      })
      .addCase(updateHotelThematics.fulfilled, (state, action) => {
        state.updatingThematics = false;
        state.hotel = action.payload.data?.hotel || action.payload.data;
        state.thematicsError = null;
      })
      .addCase(updateHotelThematics.rejected, (state, action) => {
        state.updatingThematics = false;
        state.thematicsError = action.payload;
      })

      // Update conditions
      .addCase(updateHotelConditions.pending, (state) => {
        state.updatingConditions = true;
        state.conditionsError = null;
      })
      .addCase(updateHotelConditions.fulfilled, (state, action) => {
        state.updatingConditions = false;
        state.hotel = action.payload.data?.hotel || action.payload.data;
        state.conditionsError = null;
      })
      .addCase(updateHotelConditions.rejected, (state, action) => {
        state.updatingConditions = false;
        state.conditionsError = action.payload;
      })

      // Update taxes
      .addCase(updateHotelTaxes.pending, (state) => {
        state.updatingTaxes = true;
        state.taxesError = null;
      })
      .addCase(updateHotelTaxes.fulfilled, (state, action) => {
        state.updatingTaxes = false;
        state.hotel = action.payload.data?.hotel || action.payload.data;
        state.taxesError = null;
      })
      .addCase(updateHotelTaxes.rejected, (state, action) => {
        state.updatingTaxes = false;
        state.taxesError = action.payload;
      })

      // Legacy update single hotel (kept for backward compatibility)
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

export const { clearSingleHotel, clearErrors, clearSectionError } =
  singleHotelSlice.actions;
export default singleHotelSlice.reducer;
