import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";

export const useClerkApiClient = () => {
  const { getToken } = useAuth();

  const apiClient = useMemo(
    () => ({
      async request(endpoint, options = {}) {
        try {
          const token = await getToken();

          const config = {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${token}`,
              // Set Content-Type to application/json only if not FormData
              ...(options.body instanceof FormData
                ? {}
                : { "Content-Type": "application/json" }),
            },
          };

          const baseURL =
            import.meta.env.VITE_API_BASE_URL ||
            "https://api.yomstay.com/api/v1";
          const url = `${baseURL}${endpoint}`;

          const response = await fetch(url, config);

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Unauthorized - Please log in again");
            }
            if (response.status === 403) {
              throw new Error("Forbidden - Insufficient permissions");
            }
            if (response.status === 404) {
              throw new Error("Resource not found");
            }
            if (response.status >= 500) {
              throw new Error("Server error - Please try again later");
            }
            throw new Error(`Request failed with status ${response.status}`);
          }

          return response.json();
        } catch (error) {
          // Re-throw the error to be handled by the caller
          throw error;
        }
      },

      // Convenience methods
      get: (endpoint, options = {}) =>
        apiClient.request(endpoint, { ...options, method: "GET" }),

      post: (endpoint, data, options = {}) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return apiClient.request(endpoint, {
          ...options,
          method: "POST",
          body,
        });
      },

      put: (endpoint, data, options = {}) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return apiClient.request(endpoint, { ...options, method: "PUT", body });
      },

      delete: (endpoint, options = {}) =>
        apiClient.request(endpoint, { ...options, method: "DELETE" }),

      patch: (endpoint, data, options = {}) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        return apiClient.request(endpoint, {
          ...options,
          method: "PATCH",
          body,
        });
      },
    }),
    [getToken]
  );

  return apiClient;
};
