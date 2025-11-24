import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { createApiClient } from "../services/config";
import { UsersService } from "../features/users/services/usersService";
import { HotelsService } from "../features/hotels/services/hotelsService";
import { AdminService } from "../features/hotels/services/adminService";
import { LocationsService } from "../features/locations/services/locationsService";
import { HotelRequestsService } from "../features/hotel_requests/services/hotelRequestsService";
import { AmenitiesService } from "../features/global_amenities/services/amenitiesService";
import { ConditionsService } from "../features/conditions/services/conditionsService";

// Create the API Context
const ApiContext = createContext(null);

// Custom hook to use the API context
export const useApi = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

// API Provider component
export const ApiProvider = ({ children }) => {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  const apis = useMemo(() => {
    if (!isSignedIn || !isLoaded) {
      return null;
    }

    // Create authenticated axios instance
    const baseURL =
      import.meta.env.VITE_API_BASE_URL || "https://api.yomstay.com/api/v1";
    const apiClient = createApiClient(baseURL, getToken);

    // Return all service instances
    return {
      // Core services
      users: new UsersService(apiClient),
      hotels: new HotelsService(apiClient),
      admin: new AdminService(apiClient),
      locations: new LocationsService(apiClient),
      hotelRequests: new HotelRequestsService(apiClient),
      amenities: new AmenitiesService(apiClient),
      conditions: new ConditionsService(apiClient),

      // Legacy support - keep apiClient for any remaining direct calls
      apiClient,

      // TODO: Add other services as needed
      // currencies: new CurrenciesService(apiClient),
      // webhooks: new WebhooksService(apiClient),
    };
  }, [getToken, isSignedIn, isLoaded]);

  return <ApiContext.Provider value={apis}>{children}</ApiContext.Provider>;
};
