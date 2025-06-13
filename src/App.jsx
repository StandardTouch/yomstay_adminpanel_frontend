import React from "react";
import Layout from "./layout/layout";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import SignInPage from "./common/sigin.component";
import { Spinner } from "./common/spinner";
import UsersScreen from "./screens/UsersScreen";
import HotelsScreen from "./screens/HotelsScreen";
import DashboardScreen from "./screens/DashboardScreen";

function App() {
  const { isSignedIn, user, isLoaded } = useUser();

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

        {/* Dashboard route with nested routes */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardScreen />} />
          <Route path="users" element={<UsersScreen />} />
          <Route path="hotels" element={<HotelsScreen />} />
        </Route>

        {/* Login route */}
        <Route path="/login" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
