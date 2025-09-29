import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectSingleHotelState = (state) => state.singleHotel;
export const selectSingleHotel = (state) => state.singleHotel.hotel;
export const selectSingleHotelLoading = (state) => state.singleHotel.loading;
export const selectSingleHotelError = (state) => state.singleHotel.error;
export const selectSingleHotelUpdating = (state) => state.singleHotel.updating;
export const selectSingleHotelUpdateError = (state) =>
  state.singleHotel.updateError;

// Computed selectors
export const selectSingleHotelExists = createSelector(
  [selectSingleHotel],
  (hotel) => !!hotel
);

export const selectSingleHotelBasicInfo = createSelector(
  [selectSingleHotel],
  (hotel) => {
    if (!hotel) return null;
    return {
      id: hotel.id,
      name: hotel.name,
      status: hotel.status,
      slug: hotel.slug,
      address: hotel.address,
      neighborhood: hotel.neighborhood,
      postalCode: hotel.postalCode,
      description: hotel.description,
      countryCode: hotel.countryCode,
      starRating: hotel.starRating,
      numberOfRooms: hotel.numberOfRooms,
      freeCancellationPolicy: hotel.freeCancellationPolicy,
    };
  }
);

export const selectSingleHotelLocation = createSelector(
  [selectSingleHotel],
  (hotel) => {
    if (!hotel) return null;
    return {
      location: hotel.location,
      country: hotel.country,
      state: hotel.state,
      city: hotel.city,
    };
  }
);

export const selectSingleHotelMedia = createSelector(
  [selectSingleHotel],
  (hotel) => {
    if (!hotel) return null;
    return {
      featuredImage: hotel.featuredImage,
      images: hotel.images || [],
    };
  }
);

export const selectSingleHotelContent = createSelector(
  [selectSingleHotel],
  (hotel) => {
    if (!hotel) return null;
    return {
      amenities: hotel.amenities || [],
      thematics: hotel.thematics || [],
      conditions: hotel.conditions || [],
      faq: hotel.faq || [],
    };
  }
);

export const selectSingleHotelReviews = createSelector(
  [selectSingleHotel],
  (hotel) => {
    if (!hotel) return null;
    return {
      review: hotel.review,
      reviews: hotel.reviews || [],
    };
  }
);

export const selectSingleHotelFinancial = createSelector(
  [selectSingleHotel],
  (hotel) => {
    if (!hotel) return null;
    return {
      taxes: hotel.taxes || [],
      platform: hotel.platform,
    };
  }
);

export const selectSingleHotelRooms = createSelector(
  [selectSingleHotel],
  (hotel) => {
    if (!hotel) return null;
    return hotel.rooms || [];
  }
);

export const selectSingleHotelDocuments = createSelector(
  [selectSingleHotel],
  (hotel) => {
    if (!hotel) return null;
    return {
      documents: hotel.documents || [],
      documentRequirements: hotel.documentRequirements || [],
      documentProgress: hotel.documentProgress,
    };
  }
);

// Status selectors
export const selectSingleHotelStatus = createSelector(
  [selectSingleHotel],
  (hotel) => hotel?.status || "pending"
);

export const selectSingleHotelIsApproved = createSelector(
  [selectSingleHotelStatus],
  (status) => status === "approved"
);

export const selectSingleHotelIsPending = createSelector(
  [selectSingleHotelStatus],
  (status) => status === "pending"
);

export const selectSingleHotelIsRejected = createSelector(
  [selectSingleHotelStatus],
  (status) => status === "rejected"
);

export const selectSingleHotelIsSuspended = createSelector(
  [selectSingleHotelStatus],
  (status) => status === "suspended"
);
