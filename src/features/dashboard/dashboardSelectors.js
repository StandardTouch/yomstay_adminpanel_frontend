import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectDashboardState = (state) => state.dashboard;
export const selectDashboardKPIs = (state) => state.dashboard.kpis;
export const selectDashboardBookingTrends = (state) => state.dashboard.bookingTrends;
export const selectDashboardTopHotels = (state) => state.dashboard.topHotels;
export const selectDashboardRecentBookings = (state) => state.dashboard.recentBookings;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

// Memoized computed selectors
export const selectFormattedBookingTrends = createSelector(
  [selectDashboardBookingTrends],
  (trends) => {
    return trends.map((trend) => ({
      label: trend.month,
      value: trend.count,
      revenue: trend.revenue,
      year: trend.year,
    }));
  }
);

