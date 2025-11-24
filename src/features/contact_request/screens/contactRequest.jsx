import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";
import {
  fetchContactRequests,
  setContactRequestsStatus,
  setContactRequestsSearch,
  setContactRequestsPage,
  setContactRequestsLimit,
} from "../contactRequestsSlice";
import {
  selectContactRequests,
  selectContactRequestsLoading,
  selectContactRequestsError,
  selectContactRequestsFilters,
  selectContactRequestsPagination,
  selectStatusFilterOptions,
} from "../contactRequestsSelectors";
import { showError } from "../../../utils/toast";
import { Spinner } from "@/common/components/spinner";

export default function ContactRequest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const requests = useSelector(selectContactRequests);
  const loading = useSelector(selectContactRequestsLoading);
  const error = useSelector(selectContactRequestsError);
  const filters = useSelector(selectContactRequestsFilters);
  const pagination = useSelector(selectContactRequestsPagination);
  const statusOptions = useSelector(selectStatusFilterOptions);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");

  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const tableHead = [
    "Email",
    "Subject",
    "Reservation",
    "Status",
    "Created At",
    "Actions",
  ];

  const statusColorMapping = {
    open: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };

  // Fetch requests on mount and when filters change
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(
        fetchContactRequests({
          apiClient,
          page: filters.page,
          limit: filters.limit,
          status: filters.status,
          search: searchTerm && searchTerm.trim() ? searchTerm.trim() : undefined,
        })
      );
    }
  }, [
    dispatch,
    isLoaded,
    isSignedIn,
    apiClient,
    filters.page,
    filters.limit,
    filters.status,
    searchTerm,
  ]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setContactRequestsSearch(searchTerm || undefined));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, dispatch]);

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setContactRequestsPage(newPage));
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    dispatch(setContactRequestsLimit(newLimit));
  };

  // Handle status filter change
  const handleStatusFilterChange = (value) => {
    const statusValue = value === "all" ? undefined : value;
    dispatch(setContactRequestsStatus(statusValue));
  };

  // Display error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Handle view button click - navigate to single request page
  const handleViewClick = (requestId) => {
    navigate(`/dashboard/contact_request/${requestId}`);
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contact Requests</h1>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Label htmlFor="status-filter" className="text-sm">
            Status:
          </Label>
          <Select
            value={filters.status || "all"}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className="w-[180px]" id="status-filter">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value || "all"} value={option.value || "all"}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by email or reservation number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-8 text-red-500">
          <p>Failed to load contact requests. Please try again.</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <div className="mt-4 border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHead.map((head) => (
                    <TableHead key={head}>{head}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No contact requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.email}
                      </TableCell>
                      <TableCell>
                        {request.subject?.slice(0, 20)}
                        {request.subject?.length > 20 ? "..." : ""}
                      </TableCell>
                      <TableCell>
                        {request.reservationNumber || "N/A"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`${
                            statusColorMapping[request.status] || statusColorMapping.closed
                          } px-2 py-1 rounded text-xs font-medium capitalize`}
                        >
                          {request.status?.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell>
                        {request.createdAt
                          ? new Date(request.createdAt).toLocaleDateString(
                              "en-US",
                              dateOptions
                            )
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewClick(request.id)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} requests
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="limit-select" className="text-sm">
                  Per page:
                </Label>
                <select
                  id="limit-select"
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="px-3 py-1 border rounded-md text-sm dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
