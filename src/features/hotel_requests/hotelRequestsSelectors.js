import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectHotelRequestsState = (state) => state.hotelRequests;
export const selectHotelRequests = (state) => state.hotelRequests.hotelRequests;
export const selectHotelRequestsLoading = (state) =>
  state.hotelRequests.loading;
export const selectHotelRequestsError = (state) => state.hotelRequests.error;

// Action state selectors
export const selectHandling = (state) => state.hotelRequests.handling;

// Action error selectors
export const selectHandleError = (state) => state.hotelRequests.handleError;

// Computed selectors
export const selectHotelRequestsByStatus = createSelector(
  [selectHotelRequests],
  (requests) => {
    return {
      pending: requests.filter((req) => req.status === "pending"),
      needs_completion: requests.filter(
        (req) => req.status === "needs_completion"
      ),
      approved: requests.filter((req) => req.status === "approved"),
      rejected: requests.filter((req) => req.status === "rejected"),
    };
  }
);

export const selectHotelRequestsCount = createSelector(
  [selectHotelRequestsByStatus],
  (requestsByStatus) => ({
    total:
      requestsByStatus.pending.length +
      requestsByStatus.needs_completion.length +
      requestsByStatus.approved.length +
      requestsByStatus.rejected.length,
    pending: requestsByStatus.pending.length,
    needs_completion: requestsByStatus.needs_completion.length,
    approved: requestsByStatus.approved.length,
    rejected: requestsByStatus.rejected.length,
  })
);

export const selectHotelRequestsStats = createSelector(
  [selectHotelRequestsCount],
  (counts) => ({
    ...counts,
    pendingPercentage:
      counts.total > 0 ? Math.round((counts.pending / counts.total) * 100) : 0,
    needs_completionPercentage:
      counts.total > 0
        ? Math.round((counts.needs_completion / counts.total) * 100)
        : 0,
    approvedPercentage:
      counts.total > 0 ? Math.round((counts.approved / counts.total) * 100) : 0,
    rejectedPercentage:
      counts.total > 0 ? Math.round((counts.rejected / counts.total) * 100) : 0,
  })
);

// Filtered selectors
export const selectFilteredHotelRequests = createSelector(
  [selectHotelRequests, (state, filters) => filters],
  (requests, filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return requests;
    }

    return requests.filter((request) => {
      // Status filter
      if (filters.status && request.status !== filters.status) {
        return false;
      }

      // Search filter (search in name, email, hotel name)
      if (filters.search && typeof filters.search === "string") {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = [
          request.firstName,
          request.lastName,
          request.email,
          request.hotel?.name,
          request.hotel?.address,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateFrom) {
        const requestDate = new Date(request.createdAt);
        const fromDate = new Date(filters.dateFrom);
        if (requestDate < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const requestDate = new Date(request.createdAt);
        const toDate = new Date(filters.dateTo);
        if (requestDate > toDate) {
          return false;
        }
      }

      return true;
    });
  }
);

// Sorted selectors
export const selectSortedHotelRequests = createSelector(
  [selectFilteredHotelRequests, (state, sortBy) => sortBy],
  (requests, sortBy) => {
    if (!sortBy) {
      return requests;
    }

    const sortedRequests = [...requests].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "name":
          return (a.firstName + " " + a.lastName).localeCompare(
            b.firstName + " " + b.lastName
          );
        case "hotel":
          return (a.hotel?.name || "").localeCompare(b.hotel?.name || "");
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return sortedRequests;
  }
);

// Pagination selectors
export const selectPaginatedHotelRequests = createSelector(
  [selectSortedHotelRequests, (state, pagination) => pagination],
  (requests, pagination) => {
    if (!pagination) {
      return requests;
    }

    const { page = 1, pageSize = 20 } = pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      data: requests.slice(startIndex, endIndex),
      total: requests.length,
      page,
      pageSize,
      totalPages: Math.ceil(requests.length / pageSize),
    };
  }
);

// Recent requests selector
export const selectRecentHotelRequests = createSelector(
  [selectHotelRequests],
  (requests) => {
    return requests
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }
);

// Request by ID selector
export const selectHotelRequestById = createSelector(
  [selectHotelRequests, (state, requestId) => requestId],
  (requests, requestId) => {
    return requests.find((req) => req.id === requestId);
  }
);

// Loading states
export const selectAnyLoading = createSelector(
  [selectHotelRequestsLoading, selectHandling],
  (loading, handling) => {
    return loading || handling;
  }
);

// Error states
export const selectAnyError = createSelector(
  [selectHotelRequestsError, selectHandleError],
  (error, handleError) => {
    return error || handleError;
  }
);

// Combined selector for filtered, sorted, and paginated requests
export const selectProcessedHotelRequests = createSelector(
  [
    selectHotelRequests,
    (state, filters) => filters,
    (state, sortBy) => sortBy,
    (state, pagination) => pagination,
  ],
  (requests, filters, sortBy, pagination) => {
    // Filter requests
    let filteredRequests = requests;
    if (filters && Object.keys(filters).length > 0) {
      filteredRequests = requests.filter((request) => {
        // Status filter
        if (filters.status && request.status !== filters.status) {
          return false;
        }

        // Search filter (search in name, email, hotel name)
        if (filters.search && typeof filters.search === "string") {
          const searchTerm = filters.search.toLowerCase();
          const searchableText = [
            request.firstName,
            request.lastName,
            request.email,
            request.hotel?.name,
            request.hotel?.address,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          if (!searchableText.includes(searchTerm)) {
            return false;
          }
        }

        // Date range filter
        if (filters.dateFrom) {
          const requestDate = new Date(request.createdAt);
          const fromDate = new Date(filters.dateFrom);
          if (requestDate < fromDate) {
            return false;
          }
        }

        if (filters.dateTo) {
          const requestDate = new Date(request.createdAt);
          const toDate = new Date(filters.dateTo);
          if (requestDate > toDate) {
            return false;
          }
        }

        return true;
      });
    }

    // Sort requests
    let sortedRequests = filteredRequests;
    if (sortBy) {
      sortedRequests = [...filteredRequests].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt);
          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt);
          case "name":
            return (a.firstName + " " + a.lastName).localeCompare(
              b.firstName + " " + b.lastName
            );
          case "hotel":
            return (a.hotel?.name || "").localeCompare(b.hotel?.name || "");
          case "status":
            return a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });
    }

    // Paginate requests
    if (pagination) {
      const { page = 1, pageSize = 20 } = pagination;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = sortedRequests.slice(startIndex, endIndex);

      return {
        data: paginatedData,
        total: sortedRequests.length,
        page,
        pageSize,
        totalPages: Math.ceil(sortedRequests.length / pageSize),
      };
    }

    return {
      data: sortedRequests,
      total: sortedRequests.length,
      page: 1,
      pageSize: sortedRequests.length,
      totalPages: 1,
    };
  }
);
