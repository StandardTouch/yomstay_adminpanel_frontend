import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectThematicsState = (state) => state.thematics;
export const selectThematics = (state) => state.thematics.thematics;
export const selectThematicsLoading = (state) => state.thematics.loading;
export const selectThematicsError = (state) => state.thematics.error;
export const selectThematicsPagination = (state) => state.thematics.pagination;
export const selectThematicsFilters = (state) => state.thematics.filters;

// Individual filter selectors
export const selectThematicsPage = (state) => state.thematics.filters.page;
export const selectThematicsLimit = (state) => state.thematics.filters.limit;
export const selectThematicsSearch = (state) => state.thematics.filters.search;
export const selectThematicsLocale = (state) => state.thematics.filters.locale;

// Memoized computed selectors
export const selectThematicsTotal = createSelector(
  [selectThematicsPagination],
  (pagination) => pagination.total
);

export const selectThematicsTotalPages = createSelector(
  [selectThematicsPagination],
  (pagination) => pagination.totalPages
);

export const selectThematicsCurrentPage = createSelector(
  [selectThematicsPagination],
  (pagination) => pagination.page
);

// Select thematics with locale-aware display names
export const selectThematicsWithLocale = createSelector(
  [selectThematics, selectThematicsLocale],
  (thematics, locale) => {
    return thematics.map((thematic) => ({
      ...thematic,
      displayName:
        locale === "ar" && thematic.ar?.displayName
          ? thematic.ar.displayName
          : thematic.displayName,
    }));
  }
);

