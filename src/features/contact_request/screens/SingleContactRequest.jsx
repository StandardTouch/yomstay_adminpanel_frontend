import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, File, Image as ImageIcon, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  fetchContactRequestById,
  updateContactRequestStatus,
  clearCurrentRequest,
} from "../contactRequestsSlice";
import {
  selectCurrentContactRequest,
  selectPastContactRequests,
  selectContactRequestsLoadingSingle,
  selectContactRequestsError,
} from "../contactRequestsSelectors";
import { showError, showSuccess } from "../../../utils/toast";
import { Spinner } from "@/common/components/spinner";

export default function SingleContactRequest() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const request = useSelector(selectCurrentContactRequest);
  const pastRequests = useSelector(selectPastContactRequests);
  const loading = useSelector(selectContactRequestsLoadingSingle);
  const error = useSelector(selectContactRequestsError);

  // Local state
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statusOptions = ["open", "in_progress", "resolved", "closed"];

  const dateOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const statusColorMapping = {
    open: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  };

  // Fetch request on mount
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient && id) {
      dispatch(fetchContactRequestById({ id, apiClient }));
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearCurrentRequest());
    };
  }, [dispatch, isLoaded, isSignedIn, apiClient, id]);

  // Display error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  // Handle status change
  const handleStatusChange = async (newStatus) => {
    if (!request || !apiClient || newStatus === request.status) {
      return;
    }

    setUpdatingStatus(true);
    try {
      await dispatch(
        updateContactRequestStatus({
          id: request.id,
          status: newStatus,
          apiClient,
        })
      ).unwrap();

      showSuccess("Contact request status updated successfully");
    } catch (error) {
      console.error("Failed to update status:", error);
      // Error is already handled by the thunk and shown via toast
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Check if file is an image
  const isImage = (mimeType) => {
    return mimeType?.startsWith("image/");
  };

  // Get file icon based on mime type
  const getFileIcon = (mimeType) => {
    if (!mimeType) return <File className="w-8 h-8" />;
    
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="w-8 h-8" />;
    } else if (mimeType.includes("pdf")) {
      return <File className="w-8 h-8 text-red-500" />;
    } else if (mimeType.includes("word") || mimeType.includes("document")) {
      return <File className="w-8 h-8 text-blue-500" />;
    } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      return <File className="w-8 h-8 text-green-500" />;
    } else {
      return <File className="w-8 h-8" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error && !request) {
    return (
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/contact_request")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contact Requests
        </Button>
        <div className="text-center py-8 text-red-500">
          <p>Failed to load contact request. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/dashboard/contact_request")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contact Requests
        </Button>
        <div className="text-center py-8 text-muted-foreground">
          <p>Contact request not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto">
      {/* Back Button */}
      <Button
        variant="outline"
        onClick={() => navigate("/dashboard/contact_request")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Contact Requests
      </Button>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{request.subject}</CardTitle>
                <p className="text-muted-foreground">{request.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    disabled={updatingStatus}
                    className={`${
                      statusColorMapping[request.status] || statusColorMapping.closed
                    } px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1 hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {request.status?.replace("_", " ")}
                    <ChevronDown className="w-4 h-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {statusOptions.map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={status === request.status || updatingStatus}
                      >
                        <span className="capitalize">{status.replace("_", " ")}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Comment Card */}
        <Card>
          <CardHeader>
            <CardTitle>Message</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-muted/50">
              <p className="whitespace-pre-wrap">{request.comment}</p>
            </div>
          </CardContent>
        </Card>

        {/* Attachments Card */}
        {request.attachments && request.attachments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {request.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {isImage(attachment.mimeType) ? (
                      <div className="relative">
                        <img
                          src={attachment.url}
                          alt={attachment.fileName || "Attachment"}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div
                          className="hidden w-full h-48 bg-muted items-center justify-center"
                          style={{ display: "none" }}
                        >
                          {getFileIcon(attachment.mimeType)}
                        </div>
                        <div className="p-3 bg-background">
                          <p className="text-sm font-medium truncate">
                            {attachment.fileName || "Image"}
                          </p>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 mt-1"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </a>
                        </div>
                      </div>
                    ) : (
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-6 text-center hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-muted-foreground">
                            {getFileIcon(attachment.mimeType)}
                          </div>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[200px]">
                              {attachment.fileName || "File"}
                            </p>
                            {attachment.size && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {(attachment.size / 1024).toFixed(2)} KB
                              </p>
                            )}
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Reservation Number
                </p>
                <p className="text-base">
                  {request.reservationNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Booking ID
                </p>
                <p className="text-base">
                  {request.bookingId || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Created At
                </p>
                <p className="text-base">
                  {request.createdAt
                    ? new Date(request.createdAt).toLocaleDateString(
                        "en-US",
                        dateOptions
                      )
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Updated At
                </p>
                <p className="text-base">
                  {request.updatedAt
                    ? new Date(request.updatedAt).toLocaleDateString(
                        "en-US",
                        dateOptions
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Past Requests Card */}
        {pastRequests && pastRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Past Contact Requests from {request.email}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Previous requests from this email address (last 10)
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastRequests.map((pastRequest) => (
                  <div
                    key={pastRequest.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/contact_request/${pastRequest.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-base">{pastRequest.subject}</h4>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {pastRequest.comment}
                        </p>
                      </div>
                      <span
                        className={`${
                          statusColorMapping[pastRequest.status] || statusColorMapping.closed
                        } px-2 py-1 rounded text-xs font-medium capitalize ml-2 shrink-0`}
                      >
                        {pastRequest.status?.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                      <span>
                        {pastRequest.createdAt
                          ? new Date(pastRequest.createdAt).toLocaleDateString(
                              "en-US",
                              dateOptions
                            )
                          : "N/A"}
                      </span>
                      {pastRequest.reservationNumber && (
                        <span>Reservation: {pastRequest.reservationNumber}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

