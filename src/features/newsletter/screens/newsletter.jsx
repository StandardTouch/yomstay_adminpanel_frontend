import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  fetchNewsletterSubscriptions,
  deleteNewsletterSubscription,
  setNewsletterSearch,
  setNewsletterPage,
  setNewsletterLimit,
} from "../newsletterSlice";
import {
  selectNewsletterSubscriptions,
  selectNewsletterLoading,
  selectNewsletterError,
  selectNewsletterFilters,
  selectNewsletterPagination,
} from "../newsletterSelectors";
import { showError, showSuccess } from "../../../utils/toast";
import { Spinner } from "@/common/components/spinner";
import ConfirmationPopup from "@/common/components/Popup/ConfirmationPopup";

export default function Newsletter() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const subscriptions = useSelector(selectNewsletterSubscriptions);
  const loading = useSelector(selectNewsletterLoading);
  const error = useSelector(selectNewsletterError);
  const filters = useSelector(selectNewsletterFilters);
  const pagination = useSelector(selectNewsletterPagination);

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    subscription: null,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch subscriptions on mount and when filters change
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(
        fetchNewsletterSubscriptions({
          apiClient,
          page: filters.page,
          limit: filters.limit,
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
    searchTerm,
  ]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setNewsletterSearch(searchTerm || undefined));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, dispatch]);

  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(setNewsletterPage(newPage));
  };

  // Handle limit change
  const handleLimitChange = (newLimit) => {
    dispatch(setNewsletterLimit(newLimit));
  };

  // Display error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Handle delete button click
  const handleDeleteClick = (subscription) => {
    setDeleteModal({
      open: true,
      subscription,
    });
  };

  // Handle delete modal close
  const handleDeleteModalClose = () => {
    setDeleteModal({
      open: false,
      subscription: null,
    });
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!deleteModal.subscription || !deleteModal.subscription.id) {
      return;
    }

    setDeleteLoading(true);
    try {
      await dispatch(
        deleteNewsletterSubscription({
          id: deleteModal.subscription.id,
          apiClient,
        })
      ).unwrap();

      showSuccess("Newsletter subscription deleted successfully");
      handleDeleteModalClose();

      // Refresh the list
      dispatch(
        fetchNewsletterSubscriptions({
          apiClient,
          page: filters.page,
          limit: filters.limit,
          search: searchTerm && searchTerm.trim() ? searchTerm.trim() : undefined,
        })
      );
    } catch (error) {
      console.error("Failed to delete newsletter subscription:", error);
      // Error is already handled by the thunk and shown via toast
    } finally {
      setDeleteLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Newsletter Subscriptions</h1>
      </div>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md"
        />
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
          <p>Failed to load newsletter subscriptions. Please try again.</p>
        </div>
      )}

      {/* Subscriptions List */}
      {!loading && !error && (
        <>
          <div className="space-y-2 mb-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {subscription.email}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Subscribed on {formatDate(subscription.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(subscription)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {subscriptions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No newsletter subscriptions found.</p>
              {searchTerm && (
                <p className="text-sm mt-2">
                  Try adjusting your search terms.
                </p>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} subscriptions
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
                <label htmlFor="limit-select" className="text-sm">
                  Per page:
                </label>
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

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={deleteModal.open}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Newsletter Subscription"
        description={
          deleteModal.subscription
            ? `Are you sure you want to delete the subscription for "${deleteModal.subscription.email}"? This action cannot be undone.`
            : "Are you sure you want to delete this newsletter subscription? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        icon={Trash2}
        isLoading={deleteLoading}
      />
    </div>
  );
}
