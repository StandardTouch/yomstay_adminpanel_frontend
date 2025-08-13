// Simple API Client that gets fresh tokens from Clerk on every request
class ApiClientManager {
  constructor() {
    this.baseURL =
      import.meta.env.VITE_API_BASE_URL || "https://api.yomstay.com/api/v1";
    this.isAuth = false;
    this.getTokenFunction = null; // Function to get fresh token from Clerk
  }

  setAuth(isLoggedIn, getTokenFunction = null) {
    this.isAuth = isLoggedIn;
    this.getTokenFunction = getTokenFunction;
  }

  getBaseURL() {
    return this.baseURL;
  }

  updateBaseURL(newBaseURL) {
    this.baseURL = newBaseURL;
  }

  async getAuthHeaders() {
    const headers = {};

    if (this.isAuth && this.getTokenFunction) {
      try {
        const freshToken = await this.getTokenFunction();
        if (freshToken) {
          headers["Authorization"] = `Bearer ${freshToken}`;
        }
      } catch (error) {
        console.error("Failed to get fresh token:", error);
      }
    }
    return headers;
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        ...(await this.getAuthHeaders()),
        ...options.headers,
      },
    };

    // Set Content-Type to application/json only if not FormData
    if (!(options.body instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  getAuthStatus() {
    return {
      isAuth: this.isAuth,
      hasTokenFunction: !!this.getTokenFunction,
    };
  }
}

// Create singleton instance
const apiClientManager = new ApiClientManager();

export default apiClientManager;

// Export commonly used methods
export const getBaseURL = () => apiClientManager.getBaseURL();
export const updateBaseURL = (newBaseURL) =>
  apiClientManager.updateBaseURL(newBaseURL);
export const getAuthStatus = () => apiClientManager.getAuthStatus();
export const setAuth = (isLoggedIn, getTokenFunction) =>
  apiClientManager.setAuth(isLoggedIn, getTokenFunction);
export const makeRequest = (endpoint, options) =>
  apiClientManager.makeRequest(endpoint, options);
