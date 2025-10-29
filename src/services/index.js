import { createApiClient } from "./config";

/**
 * Create service instances with authenticated API client
 * This replaces the generated client from @StandardTouch/yomstay_api
 *
 * @param {Function} getToken - Function to get auth token from Clerk
 * @returns {Object} Object containing all service instances
 */
export const createServices = (getToken) => {
  const baseURL =
    import.meta.env.VITE_API_BASE_URL || "https://api.yomstay.com/api/v1";

  // Create authenticated axios instance
  const apiClient = createApiClient(baseURL, getToken);

  return {
    apiClient, // Export for direct access if needed
    // Services will be imported and instantiated here
    // They will use the same apiClient instance
  };
};

/**
 * Service Factory Hook
 * This can be used as a React hook or standalone
 */
export const useServices = (getToken) => {
  return createServices(getToken);
};
