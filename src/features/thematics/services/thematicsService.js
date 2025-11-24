/**
 * Thematics Service
 * Handles all thematics-related API calls using axios
 */
export class ThematicsService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List thematics with pagination and search
   * Returns both English and Arabic values in a single response
   * @param {Object} filters - Query parameters
   * @param {number} filters.page - Page number for pagination
   * @param {number} filters.limit - Number of items per page
   * @param {string} filters.search - Search term for name or displayName
   * @returns {Promise} API response
   */
  async listThematics(filters = {}) {
    const { page, limit, search } = filters;

    const params = {
      page,
      limit,
      search: search && search.trim() ? search.trim() : undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.apiClient.get("/admin/thematics", { params });
  }

  /**
   * Create a new thematic
   * Supports bilingual input with displayName/displayNameAr
   * @param {Object} data - Thematic data
   * @param {string} data.name - Unique identifier (required)
   * @param {string} data.displayName - English display name (required)
   * @param {string} data.displayNameAr - Arabic display name (optional)
   * @param {string} locale - Optional locale query parameter (en/ar) - not needed if using displayNameAr
   * @returns {Promise} API response
   */
  async createThematic(data, locale = undefined) {
    if (!data) {
      throw new Error("Thematic data is required");
    }

    if (!data.name || !data.displayName) {
      throw new Error("Name and displayName are required");
    }

    // Build request with optional locale query parameter
    const config = {};
    if (locale) {
      config.params = { locale };
    }

    // Clean up undefined values from data
    const cleanedData = { ...data };
    Object.keys(cleanedData).forEach(
      (key) => cleanedData[key] === undefined && delete cleanedData[key]
    );

    return this.apiClient.post("/admin/thematics", cleanedData, config);
  }

  /**
   * Update a thematic (full update)
   * Supports bilingual input with displayName/displayNameAr
   * @param {string} id - Thematic ID
   * @param {Object} data - Thematic data
   * @param {string} data.name - Unique identifier (optional)
   * @param {string} data.displayName - English display name (optional)
   * @param {string} data.displayNameAr - Arabic display name (optional)
   * @param {string} locale - Optional locale query parameter (en/ar) - not needed if using displayNameAr
   * @returns {Promise} API response
   */
  async updateThematic(id, data, locale = undefined) {
    if (!id) {
      throw new Error("Thematic ID is required");
    }

    if (!data) {
      throw new Error("Thematic data is required");
    }

    // Build request with optional locale query parameter
    const config = {};
    if (locale) {
      config.params = { locale };
    }

    // Clean up undefined values from data
    const cleanedData = { ...data };
    Object.keys(cleanedData).forEach(
      (key) => cleanedData[key] === undefined && delete cleanedData[key]
    );

    return this.apiClient.put(`/admin/thematics/${id}`, cleanedData, config);
  }

  /**
   * Delete a thematic
   * @param {string} id - Thematic ID
   * @returns {Promise} API response
   */
  async deleteThematic(id) {
    if (!id) {
      throw new Error("Thematic ID is required");
    }

    return this.apiClient.delete(`/admin/thematics/${id}`);
  }
}

