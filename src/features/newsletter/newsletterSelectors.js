import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectNewsletterState = (state) => state.newsletter;
export const selectNewsletterSubscriptions = (state) => state.newsletter.subscriptions;
export const selectNewsletterLoading = (state) => state.newsletter.loading;
export const selectNewsletterError = (state) => state.newsletter.error;
export const selectNewsletterPagination = (state) => state.newsletter.pagination;
export const selectNewsletterFilters = (state) => state.newsletter.filters;

// Individual filter selectors
export const selectNewsletterPage = (state) => state.newsletter.filters.page;
export const selectNewsletterLimit = (state) => state.newsletter.filters.limit;
export const selectNewsletterSearch = (state) => state.newsletter.filters.search;

// Memoized computed selectors
export const selectNewsletterTotal = createSelector(
  [selectNewsletterPagination],
  (pagination) => pagination.total
);

export const selectNewsletterTotalPages = createSelector(
  [selectNewsletterPagination],
  (pagination) => pagination.totalPages
);

export const selectNewsletterCurrentPage = createSelector(
  [selectNewsletterPagination],
  (pagination) => pagination.page
);

// Pagination helpers
export const selectHasNextPage = createSelector(
  [selectNewsletterPagination],
  (pagination) => pagination.page < pagination.totalPages
);

export const selectHasPreviousPage = createSelector(
  [selectNewsletterPagination],
  (pagination) => pagination.page > 1
);

export const selectPageInfo = createSelector(
  [selectNewsletterPagination],
  (pagination) => ({
    startItem: (pagination.page - 1) * pagination.limit + 1,
    endItem: Math.min(pagination.page * pagination.limit, pagination.total),
    total: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
  })
);

