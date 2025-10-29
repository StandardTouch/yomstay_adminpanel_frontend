import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import {
  showSuccess,
  showError,
  showInfo,
  showWarning,
} from "../../../utils/toast";

// Redux actions and selectors
import {
  fetchHotelRequests,
  handleHotelRequest,
  clearAllErrors,
} from "../hotelRequestsSlice";
import {
  selectHotelRequests,
  selectHotelRequestsLoading,
  selectHotelRequestsError,
  selectHandling,
  selectHandleError,
  selectHotelRequestsByStatus,
  selectHotelRequestsStats,
  selectProcessedHotelRequests,
  selectAnyLoading,
  selectAnyError,
} from "../hotelRequestsSelectors";

// Components
import HotelRequestCard from "../components/HotelRequestCard";
import HotelRequestModals from "../components/HotelRequestModals";
import { Spinner } from "../../../common/components/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Building2,
  AlertCircle,
} from "lucide-react";

// Memoized components for better performance
const LoadingSkeleton = memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {Array.from({ length: 4 }).map((_, index) => (
      <Card key={index} className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      </Card>
    ))}
  </div>
));

const ErrorState = memo(({ error, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      Failed to load hotel requests
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
      {error || "An unexpected error occurred while loading hotel requests."}
    </p>
    <Button onClick={onRetry} variant="outline">
      <RefreshCw className="w-4 h-4 mr-2" />
      Try Again
    </Button>
  </div>
));

const EmptyState = memo(() => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Building2 className="w-12 h-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      No hotel requests found
    </h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
      There are currently no hotel requests to review. New requests will appear
      here when submitted.
    </p>
  </div>
));

const StatsCard = memo(({ title, value, icon: Icon, color, percentage }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-4 w-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {percentage !== undefined && (
        <p className="text-xs text-muted-foreground">
          {percentage}% of total requests
        </p>
      )}
    </CardContent>
  </Card>
));

const FilterTabs = memo(({ activeFilter, onFilterChange, stats }) => (
  <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
    {[
      { key: "all", label: "All", count: stats.total, icon: Building2 },
      { key: "pending", label: "Pending", count: stats.pending, icon: Clock },
      {
        key: "needs_completion",
        label: "Incomplete",
        count: stats.needs_completion,
        icon: Clock,
      },
      {
        key: "approved",
        label: "Approved",
        count: stats.approved,
        icon: CheckCircle,
      },
      {
        key: "rejected",
        label: "Rejected",
        count: stats.rejected,
        icon: XCircle,
      },
    ].map(({ key, label, count, icon: Icon }) => (
      <Button
        key={key}
        variant={activeFilter === key ? "default" : "ghost"}
        size="sm"
        onClick={() => onFilterChange(key)}
        className="flex items-center gap-2"
      >
        <Icon className="w-4 h-4" />
        {label}
        <Badge variant="secondary" className="ml-1">
          {count}
        </Badge>
      </Button>
    ))}
  </div>
));

function HotelRequestsScreen() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const apiClient = useApi();

  // Redux state
  const hotelRequests = useSelector(selectHotelRequests);
  const loading = useSelector(selectHotelRequestsLoading);
  const error = useSelector(selectHotelRequestsError);
  const handling = useSelector(selectHandling);
  const handleError = useSelector(selectHandleError);
  const anyLoading = useSelector(selectAnyLoading);
  const anyError = useSelector(selectAnyError);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("pending");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showNeedsCompletionModal, setShowNeedsCompletionModal] =
    useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  // Memoized selectors
  const requestsByStatus = useSelector(selectHotelRequestsByStatus);
  const stats = useSelector(selectHotelRequestsStats);

  const filters = useMemo(
    () => ({
      search:
        searchTerm && typeof searchTerm === "string" ? searchTerm.trim() : "",
      status: activeFilter === "all" ? undefined : activeFilter,
    }),
    [searchTerm, activeFilter]
  );

  const paginationParams = useMemo(
    () => ({ page: currentPage, pageSize }),
    [currentPage, pageSize]
  );

  const processedRequests = useSelector((state) =>
    selectProcessedHotelRequests(state, filters, sortBy, paginationParams)
  );

  // Memoized API parameters
  const apiParams = useMemo(
    () => ({
      apiClient,
    }),
    [apiClient]
  );

  // Memoized authentication check
  const isAuthenticated = useMemo(
    () => isLoaded && isSignedIn && apiClient,
    [isLoaded, isSignedIn, apiClient]
  );

  // Load hotel requests on mount and when dependencies change
  useEffect(() => {
    if (isAuthenticated && apiClient) {
      dispatch(fetchHotelRequests(apiParams));
    }
  }, [dispatch, isAuthenticated, apiClient, apiParams]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showError(error);
    }
    if (handleError) {
      showError(handleError);
    }
  }, [error, handleError]);

  // Memoized callbacks
  const handleRetry = useCallback(() => {
    dispatch(clearAllErrors());
    dispatch(fetchHotelRequests(apiParams));
  }, [dispatch, apiParams]);

  const handleReject = useCallback(
    (requestId) => {
      const request = hotelRequests.find((req) => req.id === requestId);
      if (request) {
        setCurrentRequest(request);
        setShowRejectModal(true);
      }
    },
    [hotelRequests]
  );

  const handleNeedsCompletion = useCallback(
    (requestId) => {
      const request = hotelRequests.find((req) => req.id === requestId);
      if (request) {
        setCurrentRequest(request);
        setShowNeedsCompletionModal(true);
      }
    },
    [hotelRequests]
  );

  const handleViewDetails = useCallback((request) => {
    if (request) {
      setCurrentRequest(request);
      setShowDetailsModal(true);
    }
  }, []);

  const handleConfirmReject = useCallback(
    (requestId, reason, notes) => {
      dispatch(handleHotelRequest({ requestId, status: "rejected", apiClient }))
        .unwrap()
        .then(() => {
          showSuccess("Hotel request rejected successfully!");
          setShowRejectModal(false);
          setCurrentRequest(null);
        })
        .catch((error) => {
          showError(error || "Failed to reject hotel request");
        });
    },
    [dispatch, apiClient]
  );

  const handleConfirmNeedsCompletion = useCallback(
    (requestId) => {
      dispatch(
        handleHotelRequest({ requestId, status: "needs_completion", apiClient })
      )
        .unwrap()
        .then(() => {
          showSuccess("Hotel request marked as incomplete successfully!");
          setShowNeedsCompletionModal(false);
          setCurrentRequest(null);
        })
        .catch((error) => {
          showError(error || "Failed to mark hotel request as incomplete");
        });
    },
    [dispatch, apiClient]
  );

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value || "";
    setSearchTerm(typeof value === "string" ? value : "");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Modal handlers
  const handleCloseReject = useCallback(() => {
    setShowRejectModal(false);
    setCurrentRequest(null);
  }, []);

  const handleCloseNeedsCompletion = useCallback(() => {
    setShowNeedsCompletionModal(false);
    setCurrentRequest(null);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetailsModal(false);
    setCurrentRequest(null);
  }, []);

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hotel Requests
          </h1>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hotel Requests
          </h1>
        </div>
        <ErrorState error={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hotel Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage hotel requests from property owners
          </p>
        </div>
        <Button onClick={handleRetry} variant="outline" disabled={anyLoading}>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${anyLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Requests"
          value={stats.total}
          icon={Building2}
          color="text-blue-600"
        />
        <StatsCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="text-yellow-600"
          percentage={stats.pendingPercentage}
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle}
          color="text-green-600"
          percentage={stats.approvedPercentage}
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="text-red-600"
          percentage={stats.rejectedPercentage}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search requests..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSortBy(sortBy === "newest" ? "oldest" : "newest")}
          >
            <Filter className="w-4 h-4 mr-2" />
            {sortBy === "newest" ? "Newest First" : "Oldest First"}
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        stats={stats}
      />

      {/* Content */}
      {processedRequests.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {processedRequests.data.map((request) => (
            <HotelRequestCard
              key={request.id}
              request={request}
              onReject={handleReject}
              onNeedsCompletion={handleNeedsCompletion}
              onViewDetails={handleViewDetails}
              isHandling={handling}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {processedRequests.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {processedRequests.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === processedRequests.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Modals */}
      <HotelRequestModals
        showRejectModal={showRejectModal}
        showNeedsCompletionModal={showNeedsCompletionModal}
        showDetailsModal={showDetailsModal}
        currentRequest={currentRequest}
        isHandling={handling}
        onCloseReject={handleCloseReject}
        onCloseNeedsCompletion={handleCloseNeedsCompletion}
        onCloseDetails={handleCloseDetails}
        onConfirmReject={handleConfirmReject}
        onConfirmNeedsCompletion={handleConfirmNeedsCompletion}
      />
    </div>
  );
}

// Export memoized component for better performance
export default memo(HotelRequestsScreen);
