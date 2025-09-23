import React, { memo, useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";

// Confirmation Modal for Needs Completion Action
const NeedsCompletionModal = memo(
  ({ isOpen, onClose, onConfirm, request, isHandling = false }) => {
    const handleConfirm = useCallback(() => {
      if (request?.id) {
        onConfirm(request.id);
      }
    }, [onConfirm, request?.id]);

    const handleClose = useCallback(() => {
      onClose();
    }, [onClose]);

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Mark as Incomplete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this hotel request as incomplete?
              This will notify the hotel owner to complete their listing setup.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Request Details */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                Request Details
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Hotel:</span>
                  <span>{request?.hotel?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Requester:</span>
                  <span>
                    {request?.firstName || ""} {request?.lastName || ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{request?.email || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isHandling}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isHandling}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isHandling ? "Processing..." : "Mark as Incomplete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

// Confirmation Modal for Reject Action
const RejectModal = memo(
  ({ isOpen, onClose, onConfirm, request, isHandling = false }) => {
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");

    const handleConfirm = useCallback(() => {
      if (!reason.trim() || !request?.id) return;
      onConfirm(request.id, reason, notes);
      setReason("");
      setNotes("");
    }, [onConfirm, request?.id, reason, notes]);

    const handleClose = useCallback(() => {
      setReason("");
      setNotes("");
      onClose();
    }, [onClose]);

    const rejectionReasons = [
      "Incomplete information",
      "Invalid hotel details",
      "Duplicate request",
      "Does not meet requirements",
      "Other",
    ];

    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              Reject Hotel Request
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this hotel request. This
              will notify the requester.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Request Details */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                Request Details
              </h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Hotel:</span>
                  <span>{request?.hotel?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Requester:</span>
                  <span>
                    {request?.firstName || ""} {request?.lastName || ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Email:</span>
                  <span>{request?.email || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Rejection Reason */}
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Rejection Reason *</Label>
              <select
                id="reject-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select a reason...</option>
                {rejectionReasons.map((reasonOption) => (
                  <option key={reasonOption} value={reasonOption}>
                    {reasonOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="reject-notes">Additional Notes (Optional)</Label>
              <Textarea
                id="reject-notes"
                placeholder="Provide additional details about the rejection..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isHandling}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isHandling || !reason.trim()}
              variant="destructive"
            >
              {isHandling ? "Processing..." : "Reject Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

// Confirmation Modal for Delete Action
const DeleteModal = memo(
  ({ isOpen, onClose, onConfirm, request, isDeleting = false }) => {
    const handleConfirm = useCallback(() => {
      if (request?.id) {
        onConfirm(request.id);
      }
    }, [onConfirm, request?.id]);

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Delete Hotel Request
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this hotel request?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Request Details */}
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm text-red-900 dark:text-red-200">
                Request to be deleted:
              </h4>
              <div className="space-y-1 text-sm text-red-800 dark:text-red-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="font-medium">Hotel:</span>
                  <span>{request?.hotel?.name || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Requester:</span>
                  <span>
                    {request?.firstName || ""} {request?.lastName || ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">Requested:</span>
                  <span>
                    {request?.createdAt
                      ? new Date(request.createdAt).toLocaleDateString()
                      : "Not available"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>This action cannot be undone.</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

// Details Modal for Viewing Request
const DetailsModal = memo(({ isOpen, onClose, request }) => {
  const formattedDate = useCallback((dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            Hotel Request Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this hotel request
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hotel Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Hotel Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Hotel Name
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.hotel?.name || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Address
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.hotel?.address || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Country ID
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.hotel?.countryId || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    State ID
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.hotel?.stateId || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    City ID
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.hotel?.cityId || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    City Name
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.hotel?.city?.name || "Not available"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    State Name
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.hotel?.state?.name || "Not available"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Country Name
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.hotel?.country?.name || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Requester Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Requester Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    First Name
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.firstName || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Last Name
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.lastName || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Email
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Phone
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Job Function
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.jobFunction || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Management Company
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {request.managementCompany ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {request.message && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Message
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {request.message}
                </p>
              </div>
            </div>
          )}

          {/* Request Metadata */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Request Information
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white capitalize">
                    {request.status}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Request ID
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                    {request.id}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Created At
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formattedDate(request.createdAt)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Updated At
                  </Label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formattedDate(request.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

// Main HotelRequestModals component
function HotelRequestModals({
  // Modal states
  showRejectModal,
  showNeedsCompletionModal,
  showDeleteModal,
  showDetailsModal,

  // Current request
  currentRequest,

  // Loading states
  isHandling,
  isDeleting,

  // Handlers
  onCloseReject,
  onCloseNeedsCompletion,
  onCloseDelete,
  onCloseDetails,
  onConfirmReject,
  onConfirmNeedsCompletion,
  onConfirmDelete,
}) {
  return (
    <>
      <RejectModal
        isOpen={showRejectModal && !!currentRequest}
        onClose={onCloseReject}
        onConfirm={onConfirmReject}
        request={currentRequest}
        isHandling={isHandling}
      />

      <NeedsCompletionModal
        isOpen={showNeedsCompletionModal && !!currentRequest}
        onClose={onCloseNeedsCompletion}
        onConfirm={onConfirmNeedsCompletion}
        request={currentRequest}
        isHandling={isHandling}
      />

      <DeleteModal
        isOpen={showDeleteModal && !!currentRequest}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
        request={currentRequest}
        isDeleting={isDeleting}
      />

      <DetailsModal
        isOpen={showDetailsModal && !!currentRequest}
        onClose={onCloseDetails}
        request={currentRequest}
      />
    </>
  );
}

export default memo(HotelRequestModals);
