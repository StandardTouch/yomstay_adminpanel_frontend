import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Hotel, Users, DollarSign, Plus, List, User } from "lucide-react";

// Dummy data
const overview = [
  { label: "Total Bookings", value: 1125, icon: <TrendingUp className="text-blue-500" /> },
  { label: "Active Hotels", value: 42, icon: <Hotel className="text-green-500" /> },
  { label: "Active Users", value: 320, icon: <Users className="text-yellow-500" /> },
  { label: "Revenue", value: "$18,400", icon: <DollarSign className="text-purple-500" /> },
];

const bookingTrends = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 150 },
  { label: "Mar", value: 180 },
  { label: "Apr", value: 170 },
  { label: "May", value: 210 },
  { label: "Jun", value: 250 },
];

const topHotels = [
  { name: "Grand Palace", bookings: 120, rating: 4.8 },
  { name: "City Lights Inn", bookings: 98, rating: 4.6 },
  { name: "Seaside Resort", bookings: 87, rating: 4.7 },
];

const recentBookings = [
  { id: "B001", user: "Alice Smith", hotel: "Grand Palace", date: "2024-06-01", status: "Confirmed" },
  { id: "B002", user: "Bob Lee", hotel: "City Lights Inn", date: "2024-06-02", status: "Pending" },
  { id: "B003", user: "Charlie Kim", hotel: "Seaside Resort", date: "2024-06-03", status: "Cancelled" },
];

export default function DashboardScreen() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {overview.map((item) => (
          <Card key={item.label} className="flex items-center gap-4 p-4 w-full">
            <div className="rounded-full bg-muted p-2">{item.icon}</div>
            <div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-muted-foreground text-sm">{item.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Booking Trends Chart */}
        <Card className="col-span-1 lg:col-span-2 p-4 w-full">
          <div className="font-semibold mb-2">Booking Trends (Last 6 Months)</div>
          <ChartContainer className="h-48" config={{}}>
            <LineChart data={bookingTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="label" />
              <YAxis />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              <RechartsTooltip />
            </LineChart>
          </ChartContainer>
        </Card>
        {/* Top Hotels */}
        <Card className="p-4 w-full">
          <div className="font-semibold mb-2">Top Hotels</div>
          <div className="flex flex-col gap-3">
            {topHotels.map((hotel) => (
              <div key={hotel.name} className="flex items-center gap-3">
                <Avatar className="h-8 w-8">{hotel.name[0]}</Avatar>
                <div className="flex-1">
                  <div className="font-medium">{hotel.name}</div>
                  <div className="text-xs text-muted-foreground">Bookings: {hotel.bookings}</div>
                </div>
                <Badge variant="secondary">⭐ {hotel.rating}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Bookings Table */}
      <Card className="p-4 w-full">
        <div className="font-semibold mb-2">Recent Bookings</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Hotel</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.user}</TableCell>
                <TableCell>{booking.hotel}</TableCell>
                <TableCell>{booking.date}</TableCell>
                <TableCell>
                  <Badge variant={
                    booking.status === "Confirmed"
                      ? "success"
                      : booking.status === "Pending"
                      ? "secondary"
                      : "destructive"
                  }>
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4 flex flex-wrap gap-4 items-center w-full">
        <div className="font-semibold mr-4">Quick Actions:</div>
        <Button variant="default" className="gap-2"><Plus size={16} /> Add Hotel</Button>
        <Button variant="secondary" className="gap-2"><List size={16} /> View All Bookings</Button>
        <Button variant="outline" className="gap-2"><User size={16} /> Manage Users</Button>
      </Card>
    </div>
  );
}
