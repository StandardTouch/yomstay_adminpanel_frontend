import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/clerk-react";
import { useApi } from "../../../contexts/ApiContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip } from "recharts";
import { TrendingUp, Hotel, Users, DollarSign, Plus, List, User } from "lucide-react";
import { Spinner } from "@/common/components/spinner";
import {
  fetchDashboard,
  clearDashboardError,
} from "../dashboardSlice";
import {
  selectDashboardKPIs,
  selectDashboardBookingTrends,
  selectDashboardTopHotels,
  selectDashboardRecentBookings,
  selectDashboardLoading,
  selectDashboardError,
  selectFormattedBookingTrends,
} from "../dashboardSelectors";
import { showError } from "../../../utils/toast";

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const { isLoaded, isSignedIn } = useAuth();
  const apiClient = useApi();

  // Redux state
  const kpis = useSelector(selectDashboardKPIs);
  const bookingTrends = useSelector(selectFormattedBookingTrends);
  const topHotels = useSelector(selectDashboardTopHotels);
  const recentBookings = useSelector(selectDashboardRecentBookings);
  const loading = useSelector(selectDashboardLoading);
  const error = useSelector(selectDashboardError);

  // Fetch dashboard data on mount
  useEffect(() => {
    if (isLoaded && isSignedIn && apiClient) {
      dispatch(
        fetchDashboard({
          topHotelsLimit: 3,
          recentBookingsLimit: 10,
          apiClient,
        })
      );
    }
  }, [dispatch, isLoaded, isSignedIn, apiClient]);

  // Display errors
  useEffect(() => {
    if (error) {
      showError(error);
      dispatch(clearDashboardError());
    }
  }, [error, dispatch]);

  // Format KPIs for display
  const overview = kpis
    ? [
        {
          label: "Total Bookings",
          value: kpis.totalBookings?.toLocaleString() || "0",
          icon: <TrendingUp className="text-blue-500" />,
        },
        {
          label: "Active Hotels",
          value: kpis.activeHotels?.toLocaleString() || "0",
          icon: <Hotel className="text-green-500" />,
        },
        {
          label: "Active Users",
          value: kpis.activeUsers?.toLocaleString() || "0",
          icon: <Users className="text-yellow-500" />,
        },
        {
          label: "Revenue",
          value: kpis.revenue?.formatted || "0.00 SAR",
          icon: <DollarSign className="text-purple-500" />,
        },
      ]
    : [];

  // Format booking status badge variant
  const getStatusVariant = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "confirmed") return "default";
    if (statusLower === "pending") return "secondary";
    if (statusLower === "cancelled" || statusLower === "canceled") return "destructive";
    return "outline";
  };

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

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {overview.length > 0 ? (
          overview.map((item) => (
            <Card key={item.label} className="flex items-center gap-4 p-4 w-full">
              <div className="rounded-full bg-muted p-2">{item.icon}</div>
              <div>
                <div className="text-2xl font-bold text-center">{item.value}</div>
                <div className="text-muted-foreground text-sm text-center">{item.label}</div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-4 text-center text-muted-foreground py-8">
            No data available
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Booking Trends Chart */}
        <Card className="col-span-1 lg:col-span-2 p-4 w-full">
          <div className="font-semibold mb-2">Booking Trends (Last 6 Months)</div>
          {bookingTrends.length > 0 ? (
            <ChartContainer className="h-48" config={{}}>
              <LineChart data={bookingTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="label" />
                <YAxis />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                <RechartsTooltip />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No booking trends data available
            </div>
          )}
        </Card>
        {/* Top Hotels */}
        <Card className="p-4 w-full">
          <div className="font-semibold mb-2">Top Hotels</div>
          {topHotels.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topHotels.map((hotel) => (
                <div key={hotel.id} className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{hotel.name?.[0]?.toUpperCase() || "H"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{hotel.name || "Unknown Hotel"}</div>
                    <div className="text-xs text-muted-foreground">
                      Bookings: {hotel.bookings || 0}
                    </div>
                  </div>
                  {hotel.averageRating !== null && hotel.averageRating !== undefined && (
                    <Badge variant="secondary">
                      ⭐ {hotel.averageRating.toFixed(1)}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No top hotels data available
            </div>
          )}
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card className="p-4 w-full">
        <div className="font-semibold mb-2">Recent Bookings</div>
        {recentBookings.length > 0 ? (
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
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-mono text-sm">
                    {booking.confirmationCode || "N/A"}
                  </TableCell>
                  <TableCell>
                    {booking.user
                      ? `${booking.user.firstName || ""} ${booking.user.lastName || ""}`.trim() ||
                        booking.user.email ||
                        "N/A"
                      : "N/A"}
                  </TableCell>
                  <TableCell>{booking.hotel?.name || "N/A"}</TableCell>
                  <TableCell>{booking.room?.name || "N/A"}</TableCell>
                  <TableCell>
                    <div>{formatDate(booking.checkInDate)}</div>
                    {booking.startTime && (
                      <div className="text-xs text-muted-foreground">
                        {formatTime(booking.startTime)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>{formatDate(booking.checkOutDate)}</div>
                    {booking.endTime && (
                      <div className="text-xs text-muted-foreground">
                        {formatTime(booking.endTime)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.totalAmount !== null && booking.totalAmount !== undefined
                      ? `${booking.totalAmount.toFixed(2)} ${booking.currency || "SAR"}`
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
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No recent bookings available
          </div>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 w-full">
        <div className="font-semibold mb-3">Quick Actions:</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button variant="default" className="gap-2 w-full justify-center">
            <Plus size={16} /> Add Hotel
          </Button>
          <Button variant="secondary" className="gap-2 w-full justify-center">
            <List size={16} /> View All Bookings
          </Button>
          <Button variant="outline" className="gap-2 w-full justify-center">
            <User size={16} /> Manage Users
          </Button>
        </div>
      </Card>
    </div>
  );
}
