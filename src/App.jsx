import React, { useEffect } from "react";
import Layout from "./layout/layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import SignInPage from "./features/auth/screens/SigninPage";
import AuthGuard from "./features/auth/components/AuthGuard";
import { Spinner } from "./common/components/spinner";
import UsersScreen from "./features/users/screens/UsersScreen";
import HotelsScreen from "./features/hotels/screens/hotel_listing/HotelsScreen";
import DashboardScreen from "./features/dashboard/screens/DashboardScreen";
import GlobalAmenities from "./features/global_amenities/screens/GlobalAmenities";
import Filter from "./features/filters/screens/Filter";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyMagicLinkWithPasswordReset from "./features/auth/test";

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
          <Route path="amenities" element={<GlobalAmenities />} />
          <Route path="filter" element={<Filter />} />
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
