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
} from "lucide-react";

function HotelRequestCard({
  request,
  onReject,
  onNeedsCompletion,
  onViewDetails,
  isHandling = false,
}) {
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
        text: "Incomplete",
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
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              {hotelName}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Requested by {requesterName}
            </CardDescription>
          </div>
          <Badge className={statusConfig.className}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
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

        {/* Request Date */}
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="font-medium">Requested:</span>
          <span className="ml-1">{formattedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t">
        <div className="flex items-center justify-between w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="flex-1 mr-2"
          >
            View Details
          </Button>

          {(request.status === "pending" ||
            request.status === "needs_completion") && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleReject}
                disabled={isHandling}
              >
                {isHandling ? "Processing..." : "Reject"}
              </Button>
              <Button
                size="sm"
                onClick={handleNeedsCompletion}
                disabled={isHandling}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isHandling ? "Processing..." : "Mark Incomplete"}
              </Button>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

// Export memoized component for better performance
export default memo(HotelRequestCard);
