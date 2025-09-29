import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectHotelsState = (state) => state.hotels;
export const selectHotels = (state) => state.hotels.hotels;
export const selectHotelsLoading = (state) => state.hotels.loading;
export const selectHotelsError = (state) => state.hotels.error;
export const selectHotelsPagination = (state) => state.hotels.pagination;
export const selectHotelsFilters = (state) => state.hotels.filters;

// Dropdown selectors
export const selectDropdownHotels = (state) => state.hotels.dropdownHotels;
export const selectDropdownLoading = (state) => state.hotels.dropdownLoading;
export const selectDropdownError = (state) => state.hotels.dropdownError;

// CRUD loading selectors
export const selectHotelsCreating = (state) => state.hotels.creating;
export const selectHotelsUpdating = (state) => state.hotels.updating;
export const selectHotelsDeleting = (state) => state.hotels.deleting;

// Individual filter selectors
export const selectHotelsSearchFilter = (state) => state.hotels.filters.search;
export const selectHotelsCityFilter = (state) => state.hotels.filters.city;
export const selectHotelsStateFilter = (state) => state.hotels.filters.state;
export const selectHotelsCountryFilter = (state) =>
  state.hotels.filters.country;
export const selectHotelsStatusFilter = (state) => state.hotels.filters.status;
export const selectHotelsLatFilter = (state) => state.hotels.filters.lat;
export const selectHotelsLngFilter = (state) => state.hotels.filters.lng;

// Pagination selectors
export const selectHotelsPage = (state) => state.hotels.pagination.page;
export const selectHotelsPageSize = (state) => state.hotels.pagination.pageSize;
export const selectHotelsTotal = (state) => state.hotels.pagination.total;

// Computed selectors
export const selectHasNextPage = createSelector(
  [selectHotelsPage, selectHotelsPageSize, selectHotelsTotal],
  (page, pageSize, total) => {
    return page * pageSize < total;
  }
);

export const selectHasPreviousPage = createSelector(
  [selectHotelsPage],
  (page) => page > 1
);

export const selectPageInfo = createSelector(
  [selectHotelsPage, selectHotelsPageSize, selectHotelsTotal],
  (page, pageSize, total) => {
    const startItem = (page - 1) * pageSize + 1;
    const endItem = Math.min(page * pageSize, total);
    const totalPages = Math.ceil(total / pageSize);

    return {
      startItem,
      endItem,
      totalPages,
      currentPage: page,
      pageSize,
      total,
    };
  }
);

// Memoized filtered hotels selector
export const selectFilteredHotels = createSelector(
  [
    selectHotels,
    selectHotelsSearchFilter,
    selectHotelsCityFilter,
    selectHotelsStateFilter,
    selectHotelsCountryFilter,
  ],
  (hotels, searchFilter, cityFilter, stateFilter, countryFilter) => {
    let filteredHotels = hotels;

    // Apply search filter
    if (searchFilter) {
      const searchTerm = searchFilter.toLowerCase();
      filteredHotels = filteredHotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchTerm) ||
          hotel.address?.toLowerCase().includes(searchTerm) ||
          hotel.city?.name?.toLowerCase().includes(searchTerm) ||
          hotel.state?.name?.toLowerCase().includes(searchTerm) ||
          hotel.country?.name?.toLowerCase().includes(searchTerm) ||
          hotel.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply city filter
    if (cityFilter) {
      filteredHotels = filteredHotels.filter(
        (hotel) =>
          hotel.city?.id === cityFilter ||
          hotel.city?.name?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }

    // Apply state filter
    if (stateFilter) {
      filteredHotels = filteredHotels.filter(
        (hotel) =>
          hotel.state?.id === stateFilter ||
          hotel.state?.name?.toLowerCase().includes(stateFilter.toLowerCase())
      );
    }

    // Apply country filter
    if (countryFilter) {
      filteredHotels = filteredHotels.filter(
        (hotel) =>
          hotel.country?.id === countryFilter ||
          hotel.country?.name
            ?.toLowerCase()
            .includes(countryFilter.toLowerCase())
      );
    }

    return filteredHotels;
  }
);

// Hotels grouped by status
export const selectHotelsByStatus = createSelector([selectHotels], (hotels) => {
  return hotels.reduce((acc, hotel) => {
    const status = hotel.status || "unknown";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(hotel);
    return acc;
  }, {});
});

// Hotel statistics
export const selectHotelStats = createSelector([selectHotels], (hotels) => {
  const stats = {
    total: hotels.length,
    approved: 0,
    pending: 0,
    rejected: 0,
    suspended: 0,
    totalRooms: 0,
    averageRating: 0,
  };

  hotels.forEach((hotel) => {
    // Count by status
    switch (hotel.status) {
      case "approved":
        stats.approved++;
        break;
      case "pending":
        stats.pending++;
        break;
      case "rejected":
        stats.rejected++;
        break;
      case "suspended":
        stats.suspended++;
        break;
    }

    // Sum rooms
    if (hotel.numberOfRooms) {
      stats.totalRooms += hotel.numberOfRooms;
    }
  });

  // Calculate average rating
  const hotelsWithRating = hotels.filter((h) => h.starRating);
  if (hotelsWithRating.length > 0) {
    stats.averageRating =
      hotelsWithRating.reduce((sum, h) => sum + h.starRating, 0) /
      hotelsWithRating.length;
  }

  return stats;
});

// Dropdown specific selectors
export const selectDropdownHotelsFormatted = createSelector(
  [selectDropdownHotels],
  (hotels) => {
    return hotels.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      value: hotel.id,
      label: hotel.name,
      ...hotel, // Include all hotel data
    }));
  }
);

// Hotels by location
export const selectHotelsByLocation = createSelector(
  [selectHotels],
  (hotels) => {
    const byCountry = {};
    const byState = {};
    const byCity = {};

    hotels.forEach((hotel) => {
      // Group by country
      if (hotel.country?.name) {
        if (!byCountry[hotel.country.name]) {
          byCountry[hotel.country.name] = [];
        }
        byCountry[hotel.country.name].push(hotel);
      }

      // Group by state
      if (hotel.state?.name) {
        if (!byState[hotel.state.name]) {
          byState[hotel.state.name] = [];
        }
        byState[hotel.state.name].push(hotel);
      }

      // Group by city
      if (hotel.city?.name) {
        if (!byCity[hotel.city.name]) {
          byCity[hotel.city.name] = [];
        }
        byCity[hotel.city.name].push(hotel);
      }
    });

    return {
      byCountry,
      byState,
      byCity,
    };
  }
);

// Search options for dropdowns
export const selectStatusOptions = createSelector([selectHotels], (hotels) => {
  // Standard status options from API specification
  const standardStatuses = ["pending", "approved", "rejected", "suspended"];

  // Get statuses from actual hotel data
  const dataStatuses = [
    ...new Set(hotels.map((h) => h.status).filter(Boolean)),
  ];

  // Combine and deduplicate
  const allStatuses = [...new Set([...standardStatuses, ...dataStatuses])];

  return [
    { value: "", label: "All Statuses" },
    ...allStatuses.map((status) => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1),
    })),
  ];
});

export const selectCityOptions = createSelector([selectHotels], (hotels) => {
  const cities = [...new Set(hotels.map((h) => h.city?.name).filter(Boolean))];
  return [
    { value: "all", label: "All Cities" },
    ...cities.map((city) => ({
      value: city,
      label: city,
    })),
  ];
});

export const selectStateOptions = createSelector([selectHotels], (hotels) => {
  const states = [...new Set(hotels.map((h) => h.state?.name).filter(Boolean))];
  return [
    { value: "all", label: "All States" },
    ...states.map((state) => ({
      value: state,
      label: state,
    })),
  ];
});

export const selectCountryOptions = createSelector([selectHotels], (hotels) => {
  const countries = [
    ...new Set(hotels.map((h) => h.country?.name).filter(Boolean)),
  ];
  return [
    { value: "all", label: "All Countries" },
    ...countries.map((country) => ({
      value: country,
      label: country,
    })),
  ];
});
