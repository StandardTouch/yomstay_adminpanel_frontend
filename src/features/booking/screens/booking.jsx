import React from "react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { selectDashboardRecentBookings } from "../../dashboard/dashboardSelectors";
import SingleBookingModal from "./singleBooking";

function Booking() {
  const [showModal, setShowModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const recentBookings = useSelector(selectDashboardRecentBookings);

  // PAGINATION ------------------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(recentBookings.length / rowsPerPage);

  const currentData = recentBookings.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  // ------------------------------------------------

  // Format date for display
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

  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "confirmed") return "default";
    if (statusLower === "pending") return "secondary";
    if (statusLower === "cancelled" || statusLower === "canceled")
      return "destructive";
    return "outline";
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto relative ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold mb-4">{showModal ? "Single Booking Details" : "Bookings"}</h1>
        {showModal && <Button onClick={() => setShowModal(false)}>Back</Button>}
      </div>

      {!showModal && (
        <Card className="p-4 w-full">
          {currentData.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Confirmation Code</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Hotel</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currentData.map((booking, index) => (
                    <TableRow
                      key={booking.id}
                      onClick={() => {
                        setShowModal(true);
                        setBookingId(
                          (currentPage - 1) * rowsPerPage + index // To match original index
                        );
                      }}
                    >
                      <TableCell className="font-mono text-sm">
                        {booking.confirmationCode || "N/A"}
                      </TableCell>
                      <TableCell>
                        {booking.user
                          ? `${booking.user.firstName || ""} ${
                              booking.user.lastName || ""
                            }`.trim() ||
                            booking.user.email ||
                            "N/A"
                          : "N/A"}
                      </TableCell>
                      <TableCell>{booking.hotel?.name || "N/A"}</TableCell>
                      <TableCell>{booking.room?.name || "N/A"}</TableCell>
                      <TableCell>{formatDate(booking.checkInDate)}</TableCell>
                      <TableCell>{formatDate(booking.checkOutDate)}</TableCell>
                      <TableCell>
                        {booking.totalAmount != null
                          ? `${booking.totalAmount.toFixed(2)} ${
                              booking.currency || "SAR"
                            }`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(booking.status)}>
                          {booking.status || "Unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* PAGINATION UI */}
              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No recent bookings available
            </div>
          )}
        </Card>
      )}

      {showModal && (
        <SingleBookingModal setShowModal={setShowModal} bookingId={bookingId} />
      )}
    </div>
  );
}

export default Booking;
