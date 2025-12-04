import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { selectDashboardRecentBookings } from "../../dashboard/dashboardSelectors";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function singleBooking({ setShowModal, bookingId }) {
  const recentBookings = useSelector(selectDashboardRecentBookings);
  const booking = recentBookings[bookingId];

  //   Class for Colors

  const detaileTitleClass =
    "font-medium text-gray-600 dark:text-gray-400 text-sm ";
  const detailValueClass = "text-lg font-semibold";

  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "confirmed") return "default";
    if (statusLower === "pending") return "secondary";
    if (statusLower === "cancelled" || statusLower === "canceled")
      return "destructive";
    return "outline";
  };
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  return (
    <div>
      <Card className="p-4 w-full *:grid *:md:grid-cols-2 *:text-left *:gap-4 **:gap-4">
        {/* first column */}
        <div>
          <div>
            <div className={detaileTitleClass}>Booking ID</div>
            <div className={detailValueClass}>{booking.id}</div>
          </div>
          <div>
            <div className={detaileTitleClass}>Confirmation Code</div>
            <div className={detailValueClass}>{booking.confirmationCode}</div>
          </div>
        </div>
        {/* second column */}
        <div>
          <div>
            <div className={detaileTitleClass}>Guest Name</div>
            <div className={detailValueClass}>
              {booking.user
                ? `${booking.user.firstName} ${booking.user.lastName}`
                : "N/A"}
            </div>
          </div>
          <div>
            <div className={detaileTitleClass}>Hotel Name</div>
            <div className={detailValueClass}>{booking.hotel.name}</div>
          </div>
        </div>
        {/* third column */}
        <div>
          <div>
            <div className={detaileTitleClass}>Check-in Date</div>
            <div className={detailValueClass}>
              <p>{formatDate(booking.checkInDate)}</p>
              <p className={detaileTitleClass}>
                {formatTime(booking.startTime)}
              </p>
            </div>
          </div>
          <div>
            <div className={detaileTitleClass}>Check-out Date</div>
            <div className={detailValueClass}>
              <p>{formatDate(booking.checkOutDate)}</p>
              <p className={detaileTitleClass}>{formatTime(booking.endTime)}</p>
            </div>
          </div>
        </div>
        {/* fourth column */}
        <div>
          <div>
            <div className={detaileTitleClass}>Room Type</div>
            <div className={detailValueClass}>{booking.room.name}</div>
          </div>
          <div>
            <div className={detaileTitleClass}>Amount</div>
            <div className={detailValueClass}>
              {booking.totalAmount.toFixed(2)} {booking.currency || "USD"}
            </div>
          </div>
        </div>
        {/* fifth column */}
        <div>
          <div>
            <div className={detaileTitleClass}>Status</div>
            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status || "Unknown"}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default singleBooking;
