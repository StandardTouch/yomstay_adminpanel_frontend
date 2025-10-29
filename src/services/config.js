import axios from "axios";

/**
 * Create and configure axios instance for API calls
 * @param {string} baseURL - Base URL for the API
 * @param {Function} getToken - Function to get auth token (from Clerk)
 * @returns {AxiosInstance} Configured axios instance
 */
export const createApiClient = (baseURL, getToken) => {
  const apiClient = axios.create({
    baseURL,
    timeout: 60000, // 60 seconds timeout
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - Add auth token to every request
  apiClient.interceptors.request.use(
    async (config) => {
      try {
        // Get fresh token for each request
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("Failed to get token for request:", error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - Handle errors globally
  apiClient.interceptors.response.use(
    (response) => {
      // Return response data directly
      return response.data;
    },
    async (error) => {
      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        // Enhanced error object
        const enhancedError = {
          message: data?.message || error.message || `HTTP ${status}`,
          statusCode: status,
          status,
          data: data,
          response: error.response,
        };

        // Log error for debugging
        console.error("API Error:", {
          status,
          message: enhancedError.message,
          data: data,
          url: error.config?.url,
        });

        return Promise.reject(enhancedError);
      } else if (error.request) {
        // Request was made but no response received
        const networkError = {
          message: "Network error. Please check your connection.",
          statusCode: 0,
          isNetworkError: true,
          request: error.request,
        };

        console.error("Network Error:", networkError);
        return Promise.reject(networkError);
      } else {
        // Error setting up the request
        console.error("Request Setup Error:", error.message);
        return Promise.reject(error);
      }
    }
  );

  return apiClient;
};

/**
 * Create FormData from object and file
 * @param {Object} data - Data object
 * @param {File|null} file - Optional file to include
 * @returns {FormData} FormData instance
 */
export const createFormData = (data, file = null) => {
  const formData = new FormData();

  // Add all data fields
  Object.keys(data).forEach((key) => {
    const value = data[key];

    // Handle arrays
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          // Handle nested objects in arrays (e.g., hotelStaffs)
          Object.keys(item).forEach((subKey) => {
            formData.append(`${key}[${index}][${subKey}]`, item[subKey]);
          });
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  // Add file if provided
  if (file && file instanceof File) {
    formData.append("profileImage", file);
  }

  return formData;
};
