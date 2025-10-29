import React, { memo, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  User,
  Clock,
  AlertCircle,
} from "lucide-react";

const HotelRequestCard = ({
  request,
  onReject,
  onNeedsCompletion,
  onViewDetails,
  isHandling = false,
}) => {
  // Memoized status badge configuration
  const statusConfig = useMemo(() => {
    const configs = {
      pending: {
        variant: "secondary",
        icon: Clock,
        text: "Pending",
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      },
      approved: {
        variant: "default",
        icon: CheckCircle,
        text: "Approved",
        className:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      rejected: {
        variant: "destructive",
        icon: XCircle,
        text: "Rejected",
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      needs_completion: {
        variant: "secondary",
        icon: Clock,
        text: "Needs More Info",
        className:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      },
    };
    return configs[request.status] || configs.pending;
  }, [request.status]);

  // Memoized formatted date
  const formattedDate = useMemo(() => {
    return new Date(request.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [request.createdAt]);

  // Memoized updated date
  const formattedUpdatedDate = useMemo(() => {
    if (!request.updatedAt) return null;
    return new Date(request.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [request.updatedAt]);

  // Memoized requester name
  const requesterName = useMemo(() => {
    return (
      `${request.firstName || ""} ${request.lastName || ""}`.trim() || "Unknown"
    );
  }, [request.firstName, request.lastName]);

  // Memoized hotel name
  const hotelName = useMemo(() => {
    return request.hotel?.name || "Unknown Hotel";
  }, [request.hotel?.name]);

  // Memoized hotel address
  const hotelAddress = useMemo(() => {
    return request.hotel?.address || "No address provided";
  }, [request.hotel?.address]);

  // Memoized callbacks for actions
  const handleReject = useCallback(() => {
    onReject?.(request.id);
  }, [onReject, request.id]);

  const handleNeedsCompletion = useCallback(() => {
    onNeedsCompletion?.(request.id);
  }, [onNeedsCompletion, request.id]);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(request);
  }, [onViewDetails, request]);

  const StatusIcon = statusConfig.icon;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate">
              {hotelName}
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Requested by {requesterName}
            </CardDescription>
          </div>
          <Badge className={`${statusConfig.className} flex-shrink-0 text-xs`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">{statusConfig.text}</span>
            <span className="sm:hidden">
              {statusConfig.text.length > 8
                ? statusConfig.text.split(" ")[0]
                : statusConfig.text}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
        {/* Hotel Information */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Building2 className="w-4 h-4 mr-2" />
            <span className="font-medium">Hotel:</span>
            <span className="ml-1">{hotelName}</span>
          </div>

          <div className="flex items-start text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span className="font-medium">Address:</span>
            <span className="ml-1">{hotelAddress}</span>
          </div>

          {/* Location Details */}
          <div className="text-xs text-muted-foreground ml-6 space-y-1">
            <p>
              City:{" "}
              {request.hotel?.city?.name || request.hotel?.cityId || "N/A"}
            </p>
            <p>
              State:{" "}
              {request.hotel?.state?.name || request.hotel?.stateId || "N/A"}
            </p>
            <p>
              Country:{" "}
              {request.hotel?.country?.name ||
                request.hotel?.countryId ||
                "N/A"}
            </p>
          </div>
        </div>

        {/* Requester Information */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <User className="w-4 h-4 mr-2" />
            <span className="font-medium">Requester:</span>
            <span className="ml-1">{requesterName}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 mr-2" />
            <span className="font-medium">Email:</span>
            <span className="ml-1">{request.email || "Not provided"}</span>
          </div>

          {request.phone && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Phone className="w-4 h-4 mr-2" />
              <span className="font-medium">Phone:</span>
              <span className="ml-1">{request.phone}</span>
            </div>
          )}

          {request.jobFunction && (
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4 mr-2" />
              <span className="font-medium">Role:</span>
              <span className="ml-1">{request.jobFunction}</span>
            </div>
          )}
        </div>

        {/* Message */}
        {request.message && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">Message:</span> {request.message}
            </p>
          </div>
        )}

        {/* Management Company */}
        {request.managementCompany && (
          <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
            <Building2 className="w-4 h-4 mr-2" />
            <span className="font-medium">Management Company</span>
          </div>
        )}

        {/* Needs More Info Alert Section */}
        {request.status === "needs_completion" && (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-sm text-orange-900 dark:text-orange-200">
                  Additional Information Requested
                </h4>
                <p className="text-sm text-orange-800 dark:text-orange-300">
                  The hotel partner has been notified to provide additional
                  information or complete missing details. They will update the
                  listing once they have the required information.
                </p>
                {formattedUpdatedDate && (
                  <div className="flex items-center text-xs text-orange-700 dark:text-orange-400 mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Requested on: {formattedUpdatedDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Request Date */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="font-medium">Requested:</span>
          <span className="ml-1">{formattedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between w-full gap-3 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="w-full sm:flex-1 sm:mr-2"
          >
            View Details
          </Button>

          {(request.status === "pending" ||
            request.status === "needs_completion") && (
            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 w-full sm:w-auto">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={isHandling}
                className="w-full sm:w-auto"
              >
                {isHandling ? "Processing..." : "Reject"}
              </Button>
              <Button
                size="sm"
                onClick={handleNeedsCompletion}
                disabled={isHandling}
                className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
              >
                <span className="hidden sm:inline">
                  {isHandling ? "Processing..." : "Request More Info"}
                </span>
                <span className="sm:hidden">
                  {isHandling ? "Processing..." : "Request Info"}
                </span>
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

// Export memoized component for better performance
export default memo(HotelRequestCard);
