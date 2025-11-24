import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectContactRequestsState = (state) => state.contactRequests;
export const selectContactRequests = (state) => state.contactRequests.requests;
export const selectCurrentContactRequest = (state) => state.contactRequests.currentRequest;
export const selectPastContactRequests = (state) => state.contactRequests.pastRequests;
export const selectContactRequestsLoading = (state) => state.contactRequests.loading;
export const selectContactRequestsLoadingSingle = (state) => state.contactRequests.loadingSingle;
export const selectContactRequestsError = (state) => state.contactRequests.error;
export const selectContactRequestsPagination = (state) => state.contactRequests.pagination;
export const selectContactRequestsFilters = (state) => state.contactRequests.filters;

// Individual filter selectors
export const selectContactRequestsPage = (state) => state.contactRequests.filters.page;
export const selectContactRequestsLimit = (state) => state.contactRequests.filters.limit;
export const selectContactRequestsStatus = (state) => state.contactRequests.filters.status;
export const selectContactRequestsSearch = (state) => state.contactRequests.filters.search;

// Memoized computed selectors
export const selectContactRequestsTotal = createSelector(
  [selectContactRequestsPagination],
  (pagination) => pagination.total
);

export const selectContactRequestsTotalPages = createSelector(
  [selectContactRequestsPagination],
  (pagination) => pagination.totalPages
);

export const selectContactRequestsCurrentPage = createSelector(
  [selectContactRequestsPagination],
  (pagination) => pagination.page
);

// Filter by status
export const selectFilteredContactRequests = createSelector(
  [selectContactRequests, selectContactRequestsStatus],
  (requests, statusFilter) => {
    if (!statusFilter) return requests;
    return requests.filter((request) => request.status === statusFilter);
  }
);

// Pagination helpers
export const selectHasNextPage = createSelector(
  [selectContactRequestsPagination],
  (pagination) => pagination.page < pagination.totalPages
);

export const selectHasPreviousPage = createSelector(
  [selectContactRequestsPagination],
  (pagination) => pagination.page > 1
);

export const selectPageInfo = createSelector(
  [selectContactRequestsPagination],
  (pagination) => ({
    startItem: (pagination.page - 1) * pagination.limit + 1,
    endItem: Math.min(pagination.page * pagination.limit, pagination.total),
    total: pagination.total,
    currentPage: pagination.page,
    totalPages: pagination.totalPages,
  })
);

// Status filter options
export const selectStatusFilterOptions = () => [
  { value: undefined, label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

