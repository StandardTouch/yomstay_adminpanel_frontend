import React, { createContext, useContext, useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  ApiClient,
  UserApi,
  HotelApi,
  HotelAmenityApi,
  LocationApi,
  CurrenciesApi,
  WebhooksApi,
} from "@StandardTouch/yomstay_api";

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

    // Create API client with base URL
    const basePath =
      import.meta.env.VITE_API_BASE_URL || "https://api.yomstay.com/api/v1";
    const apiClient = new ApiClient(basePath);

    // Override callApi to refresh token on each request
    const originalCallApi = apiClient.callApi;
    apiClient.callApi = async function (...args) {
      try {
        // Refresh token before each API call
        const token = await getToken();
        if (token) {
          this.authentications.bearerAuth.accessToken = token;
        }

        return await originalCallApi.apply(this, args);
      } catch (error) {
        console.error("API call failed:", error);
        throw error;
      }
    };

    // Return all available API instances
    return {
      users: new UserApi(apiClient),
      hotels: new HotelApi(apiClient),
      hotelAmenities: new HotelAmenityApi(apiClient),
      locations: new LocationApi(apiClient),
      currencies: new CurrenciesApi(apiClient),
      webhooks: new WebhooksApi(apiClient),
      // Add other APIs as needed
    };
  }, [getToken, isSignedIn, isLoaded]);

  return <ApiContext.Provider value={apis}>{children}</ApiContext.Provider>;
};
