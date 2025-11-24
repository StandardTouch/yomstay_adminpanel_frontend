import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectAmenitiesState = (state) => state.amenities;
export const selectAmenities = (state) => state.amenities.amenities;
export const selectAmenitiesLoading = (state) => state.amenities.loading;
export const selectAmenitiesError = (state) => state.amenities.error;
export const selectAmenitiesPagination = (state) => state.amenities.pagination;
export const selectAmenitiesFilters = (state) => state.amenities.filters;

// Individual filter selectors
export const selectAmenitiesSearchFilter = (state) =>
  state.amenities.filters.search;
export const selectAmenitiesTypeFilter = (state) => state.amenities.filters.type;
export const selectAmenitiesLocaleFilter = (state) =>
  state.amenities.filters.locale;

// Memoized computed selectors
export const selectFilteredAmenities = createSelector(
  [selectAmenities, selectAmenitiesTypeFilter],
  (amenities, typeFilter) => {
    // If type filter is set, filter by type
    if (typeFilter && typeFilter !== "") {
      return amenities.filter((amenity) => amenity.type === typeFilter);
    }
    return amenities;
  }
);

// Separate hotel and room amenities
export const selectHotelAmenities = createSelector(
  [selectAmenities],
  (amenities) => amenities.filter((amenity) => amenity.type === "hotel")
);

export const selectRoomAmenities = createSelector(
  [selectAmenities],
  (amenities) => amenities.filter((amenity) => amenity.type === "room")
);

// Pagination helpers
export const selectHasNextPage = createSelector(
  [selectAmenitiesPagination],
  (pagination) => pagination.page < pagination.totalPages
);

export const selectHasPreviousPage = createSelector(
  [selectAmenitiesPagination],
  (pagination) => pagination.page > 1
);

export const selectPageInfo = createSelector(
  [selectAmenitiesPagination],
  (pagination) => ({
    startItem: (pagination.page - 1) * pagination.limit + 1,
    endItem: Math.min(pagination.page * pagination.limit, pagination.total),
    total: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
  })
);

// Type filter options
export const selectTypeFilterOptions = () => [
  { value: "", label: "All Types" },
  { value: "hotel", label: "Hotel" },
  { value: "room", label: "Room" },
];

// Locale options
export const selectLocaleOptions = () => [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
];

