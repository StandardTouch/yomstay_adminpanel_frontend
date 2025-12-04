import React, { useEffect } from "react";
import Layout from "./layout/layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import SignInPage from "./features/auth/screens/SigninPage";
import AuthGuard from "./features/auth/components/AuthGuard";
import { Spinner } from "./common/components/spinner";
import UsersScreen from "./features/users/screens/UsersScreen";
import HotelsScreen from "./features/hotels/screens/hotel_listing/HotelsScreen";
import SingleHotelScreen from "./features/hotels/screens/single_hotel/SingleHotelScreen";
import HotelRequestsScreen from "./features/hotel_requests/screens/HotelRequestsScreen";
import DashboardScreen from "./features/dashboard/screens/DashboardScreen";
import GlobalAmenities from "./features/global_amenities/screens/GlobalAmenities";
import Filter from "./features/filters/screens/Filter";
import Conditions from "./features/conditions/screens/conditions";
import Newsletter from "./features/newsletter/screens/newsletter";
import ThematicsScreen from "./features/thematics/screens/ThematicsScreen";
import ContactRequest from "./features/contact_request/screens/contactRequest";
import SingleContactRequest from "./features/contact_request/screens/SingleContactRequest";
import Booking from "./features/booking/screens/booking";
import SupportRequest from "./features/support_request/screens/supportRequest";
import CurrencyConversion from "./features/currency_conversion/screens/currencyConversion";
import Countries from "./features/countries/screens/countries";
import Cities from "./features/cities/screens/cities";
import States from "./features/states/screens/states";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyMagicLinkWithPasswordReset from "./features/auth/test";
import Settings from "./features/settings/screens/settings";
import { Contact } from "lucide-react";

function App() {
  const { isSignedIn, user, isLoaded } = useUser();

  // No cleanup needed - Clerk handles auth automatically

  // Prevent redirects before the user state is loaded
  if (!isLoaded) {
    return <Spinner />; // Or some loading state
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect based on authentication */}
        <Route
          path="/"
          element={
            isSignedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* Dashboard route with nested routes - Protected by AuthGuard */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard requiredRole="admin">
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<DashboardScreen />} />
          <Route path="users" element={<UsersScreen />} />
          <Route path="hotels" element={<HotelsScreen />} />
          <Route path="hotels/:hotelId" element={<SingleHotelScreen />} />
          <Route path="hotel_requests" element={<HotelRequestsScreen />} />
          <Route path="amenities" element={<GlobalAmenities />} />
          <Route path="filter" element={<Filter />} />
          <Route path="conditions" element={<Conditions />} />
          <Route path="newsletter" element={<Newsletter />} />
          <Route path="settings" element={<Settings />} />
          <Route path="theme" element={<ThematicsScreen />} />
          <Route path="contact_request" element={<ContactRequest />} />
          <Route path="contact_request/:id" element={<SingleContactRequest />} />
          <Route path="booking" element={<Booking />} />
          <Route path="support_request" element={<SupportRequest />} />
          <Route path="currency_conversion" element={<CurrencyConversion />} />
          <Route path="countries" element={<Countries />} />
          <Route path="cities" element={<Cities />} />
          <Route path="states" element={<States />} />
          {/* <Route path="request_hotels" element={<RequestHotels />} /> */}
        </Route>

        {/* Login route */}
        <Route path="/login" element={<SignInPage />} />
        <Route path="/verify" element={<VerifyMagicLinkWithPasswordReset />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
