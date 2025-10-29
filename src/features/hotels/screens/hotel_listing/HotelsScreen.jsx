import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import UpdateHotel from "../single_hotel/singleHotel"; // No longer needed - using navigation
import { ChevronDown, Hand, Hotel, Plus, Upload, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddButton from "@/components/AddButton";
import HotelCard from "@/features/hotels/components/hotelCard";
import AddNewHotel from "../add_new_hotel/addNewHotel";
import { useApi } from "../../../../contexts/ApiContext";
import {
  fetchHotels,
  setHotelFilters,
  setHotelPagination,
  clearHotelFilters,
} from "../../hotelsSlice";
import {
  selectHotels,
  selectHotelsLoading,
  selectHotelsError,
  selectHotelsFilters,
  selectHotelsPagination,
  selectCityOptions,
  selectCountryOptions,
  selectStatusOptions,
} from "../../hotelsSelectors";
import { showError } from "../../../../utils/toast";

// Memoized HotelCard component to prevent unnecessary re-renders
const MemoizedHotelCard = memo(HotelCard);

// Memoized filter dropdown component
const FilterDropdown = memo(
  ({ label, value, options, onSelect, placeholder }) => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex justify-center items-center gap-1 w-full border shadow p-1 rounded-md cursor-pointer">
        {value === "" ? placeholder : value} <ChevronDown size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 h-56">
        <DropdownMenuItem onClick={() => onSelect("")}>
          All {placeholder}
        </DropdownMenuItem>
        {options.slice(1).map((option) => (
          <DropdownMenuItem
            key={option.value}
            value={option.value}
            onClick={() => onSelect(option.value)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
);

// Memoized pagination component
const PaginationControls = memo(
  ({ currentPage, totalPages, onPageChange, disabled }) => (
    <div className="flex justify-center items-center gap-2 mt-6">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
      >
        Next
      </Button>
    </div>
  )
);

// Memoized loading skeleton
const LoadingSkeleton = memo(() => (
  <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
    {/* Header Skeleton */}
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
        </div>
      </div>

      {/* Search Bar Skeleton */}
      <div className="relative">
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full max-w-md animate-pulse"></div>
      </div>
    </div>

    {/* Filter Section Skeleton (Collapsed state) */}
    <div className="h-0 overflow-hidden mb-3"></div>

    {/* Hotel Cards Skeleton */}
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="min-[800px]:flex-col min-[1010px]:flex-row flex-col gap-2 px-2 py-3 shadow-sm rounded-lg border animate-pulse"
        >
          {/* Image Section */}
          <div className="w-full">
            <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col w-full justify-between">
            <div className="px-2 flex flex-col gap-4">
              {/* Title and Rating */}
              <div className="w-full flex justify-between items-start">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              </div>

              {/* Description Section */}
              <div className="border-t-2 pt-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t-2 pt-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-36"></div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-2 pt-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Pagination Skeleton */}
    <div className="flex justify-center items-center gap-2 mt-6">
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
      <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
    </div>
  </div>
));

// Memoized error state
const ErrorState = memo(({ error, onRetry }) => (
  <div className="flex flex-col gap-2 items-center justify-center h-50">
    <p className="text-center text-red-500">Error loading hotels: {error}</p>
    <Button onClick={onRetry}>Retry</Button>
  </div>
));

// Memoized empty state
const EmptyState = memo(() => (
  <div className="flex flex-col gap-2 items-center justify-center h-50">
    <p className="text-center text-muted-foreground">No hotels found</p>
  </div>
));

function HotelsScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state - using memoized selectors
  const hotels = useSelector(selectHotels);
  const loading = useSelector(selectHotelsLoading);
  const error = useSelector(selectHotelsError);
  const filters = useSelector(selectHotelsFilters);
  const pagination = useSelector(selectHotelsPagination);
  const cityOptions = useSelector(selectCityOptions);
  const countryOptions = useSelector(selectCountryOptions);
  const statusOptions = useSelector(selectStatusOptions);

  // Local UI state
  const [addOpen, setAddOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [checkform, setCheckform] = useState("Add Hotel");
  const [searchTerm, setSearchTerm] = useState("");
  const [addHotel, setAddHotel] = useState({
    id: Math.random().toString(),
    name: "",
    status: "approved",
    address: "",
    postalCode: "",
    description: "",
    ownerId: "",
    createdAt: "",
    updatedAt: "",
    starRating: 1,
    numberOfRooms: 1,
    location: {
      lat: "",
      lng: "",
    },
    country: {
      id: Math.random().toString(),
      name: "",
    },
    state: {
      id: Math.random().toString(),
      name: "",
    },
    city: {
      id: Math.random().toString(),
      name: "",
    },
    images: [],
    amenities: [],
    faq: [],
    reviews: [],
    avgReview: 1.7,
    totalReviews: 3,
  });

  // Memoized API call parameters to prevent unnecessary re-renders
  const apiParams = useMemo(
    () => ({
      apiClient,
      search: searchTerm,
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
    }),
    [apiClient, searchTerm, filters, pagination.page, pagination.pageSize]
  );

  // Memoized authentication check
  const isAuthenticated = useMemo(
    () => isLoaded && isSignedIn && apiClient,
    [isLoaded, isSignedIn, apiClient]
  );

  // Load hotels on mount and when dependencies change
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchHotels(apiParams));
    }
  }, [dispatch, isAuthenticated, apiParams]);

  // Handle search with debounce - memoized callback
  const debouncedSearch = useCallback(() => {
    if (searchTerm !== filters.search) {
      dispatch(setHotelFilters({ search: searchTerm }));
      dispatch(setHotelPagination({ page: 1 })); // Reset to first page
    }
  }, [searchTerm, filters.search, dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(debouncedSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [debouncedSearch]);

  // Handle errors - memoized callback
  const handleError = useCallback((error) => {
    if (error) {
      showError(error);
    }
  }, []);

  useEffect(() => {
    handleError(error);
  }, [error, handleError]);

  // Memoized callbacks for better performance

  const handleAddHotel = useCallback(
    (event) => {
      event.preventDefault();
      setAddHotel({
        ...addHotel,
        id: Math.random().toString(),
      });
      if (addHotel.name === "") return;
      if (addHotel.description === "") return;
      if (addHotel.address === "") return;
      if (addHotel.city === "") return;
      if (addHotel.state === "") return;
      if (addHotel.country === "") return;
      if (addHotel.numberOfRooms === 0) return;
      // This will be handled by Redux when we implement create functionality
      console.log("Add hotel:", addHotel);
      setAddHotel({ images: [] });
      setAddOpen(false);
    },
    [addHotel]
  );

  const handleFilterChange = useCallback(
    (filterType, value) => {
      dispatch(setHotelFilters({ [filterType]: value }));
      dispatch(setHotelPagination({ page: 1 })); // Reset to first page
    },
    [dispatch]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      dispatch(setHotelPagination({ page: newPage }));
    },
    [dispatch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(clearHotelFilters());
    setSearchTerm("");
    dispatch(setHotelPagination({ page: 1 }));
  }, [dispatch]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setFilterOpen(!filterOpen);
    setCheckform("Filter");
  }, [filterOpen]);

  const handleAddToggle = useCallback(() => {
    setAddOpen(true);
    setCheckform("Add Hotel");
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  // Memoized computed values
  const totalPages = useMemo(
    () => Math.ceil(pagination.total / pagination.pageSize),
    [pagination.total, pagination.pageSize]
  );

  const shouldShowPagination = useMemo(
    () => !loading && !error && pagination.total > pagination.pageSize,
    [loading, error, pagination.total, pagination.pageSize]
  );

  const shouldShowEmptyState = useMemo(
    () => !hotels || hotels.length === 0,
    [hotels]
  );

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Hotels</h1>
          <div className="flex gap-2">
            <AddButton buttonValue="Filter" onAdd={handleFilterToggle} />
            <AddButton buttonValue="Add Hotel" onAdd={handleAddToggle} />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search hotels by name, city, or country..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-full max-w-md"
          />
        </div>
      </div>

      <div
        className={`${
          filterOpen
            ? "p-2 flex gap-2 border shadow rounded-md mb-3 transition-hight duration-300 h-fit"
            : " h-0 overflow-hidden"
        }`}
      >
        <FilterDropdown
          value={filters.country}
          options={countryOptions}
          onSelect={(value) => handleFilterChange("country", value)}
          placeholder="Country"
        />
        <FilterDropdown
          value={filters.city}
          options={cityOptions}
          onSelect={(value) => handleFilterChange("city", value)}
          placeholder="City"
        />
        <FilterDropdown
          value={filters.state}
          options={cityOptions} // Using cityOptions as placeholder for state
          onSelect={(value) => handleFilterChange("state", value)}
          placeholder="State"
        />
        <FilterDropdown
          value={filters.status}
          options={statusOptions}
          onSelect={(value) => handleFilterChange("status", value)}
          placeholder="Status"
        />
        <Button onClick={handleClearFilters}>Clear</Button>
      </div>

      {/* Modal for updating a hotel - Now handled by navigation */}

      {/* Loading State */}
      {loading && <LoadingSkeleton />}

      {/* Error State */}
      {error && !loading && <ErrorState error={error} onRetry={handleRetry} />}

      {/* List of hotels */}
      {!loading && !error && (
        <div className="flex flex-col gap-4">
          {/* Hotels List */}
          {shouldShowEmptyState && <EmptyState />}
          {hotels &&
            hotels.length > 0 &&
            hotels.map((hotel) =>
              hotel && hotel.id ? (
                <MemoizedHotelCard
                  hotel={hotel}
                  key={hotel.id}
                  showHotel={() => navigate(`/dashboard/hotels/${hotel.id}`)}
                  showAlert={() => {
                    // This will be handled by Redux when we implement delete functionality
                    console.log("Delete hotel:", hotel.id);
                  }}
                />
              ) : null
            )}
        </div>
      )}

      {/* Pagination */}
      {shouldShowPagination && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          disabled={loading}
        />
      )}

      {/* Add New Hotel */}
      <AddNewHotel
        addOpen={addOpen}
        addHotel={addHotel}
        setAddHotel={setAddHotel}
        setAddOpen={setAddOpen}
        HandleAddHotel={handleAddHotel}
        checkform={checkform}
      />
    </div>
  );
}

// Export memoized component for better performance
export default memo(HotelsScreen);
