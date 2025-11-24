/**
 * Conditions Service
 * Handles all hotel conditions-related API calls using axios
 */
export class ConditionsService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List hotel conditions with filters and sorting
   * Returns both English and Arabic values in a single response
   * @param {Object} filters - Query parameters
   * @param {boolean} filters.isActive - Filter by active status
   * @param {boolean} filters.isRequired - Filter by required status
   * @param {string} filters.sortBy - Sort field (sortOrder, name, displayName, createdAt)
   * @param {string} filters.sortOrder - Sort order (asc, desc)
   * @param {string} filters.search - Search query to filter conditions
   * @returns {Promise} API response
   */
  async listConditions(filters = {}) {
    const {
      isActive,
      isRequired,
      sortBy = "sortOrder",
      sortOrder = "asc",
      search,
    } = filters;

    const params = {
      isActive,
      isRequired,
      sortBy,
      sortOrder,
      search: search && search.trim() ? search.trim() : undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    return this.apiClient.get("/admin/hotel-conditions", { params });
  }

  /**
   * Toggle a condition's active status
   * @param {string} id - Condition ID
   * @param {boolean} isActive - If provided, explicitly sets the status; if omitted, toggles current value
   * @returns {Promise} API response
   */
  async toggleActive(id, isActive = undefined) {
    if (!id) {
      throw new Error("Condition ID is required");
    }

    const body = {};
    if (typeof isActive === "boolean") {
      body.isActive = isActive;
    }

    return this.apiClient.patch(`/admin/hotel-conditions/${id}/toggle-active`, body);
  }

  /**
   * Reorder conditions (bulk update sortOrder)
   * @param {Object} data - Request payload
   * @param {Array} data.orders - Array of { id, sortOrder } objects
   * @returns {Promise} API response
   */
  async reorderConditions(data) {
    if (!data || !Array.isArray(data.orders) || data.orders.length === 0) {
      throw new Error("orders array is required");
    }

    // Ensure each order has id and sortOrder
    const payload = {
      orders: data.orders.map(({ id, sortOrder }) => ({ id, sortOrder })),
    };

    return this.apiClient.patch("/admin/hotel-conditions/reorder", payload);
  }

  /**
   * Create a new hotel condition
   * Supports bilingual input with displayName/displayNameAr and description/descriptionAr
   * @param {Object} data - Condition data
   * @param {string} data.name - Unique identifier (required)
   * @param {string} data.displayName - English display name (required)
   * @param {string} data.displayNameAr - Arabic display name (optional)
   * @param {string} data.description - English description (optional)
   * @param {string} data.descriptionAr - Arabic description (optional)
   * @param {boolean} data.isActive - Active status (default: true)
   * @param {boolean} data.isRequired - Required status (default: false)
   * @param {number} data.sortOrder - Sort order (default: 0)
   * @param {string} locale - Optional locale query parameter (en/ar) - not needed if using displayNameAr/descriptionAr
   * @returns {Promise} API response
   */
  async createCondition(data, locale = undefined) {
    if (!data) {
      throw new Error("Condition data is required");
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

    return this.apiClient.post("/admin/hotel-conditions", cleanedData, config);
  }

  /**
   * Update a condition (full update)
   * Supports bilingual input with displayName/displayNameAr and description/descriptionAr
   * @param {string} id - Condition ID
   * @param {Object} data - Condition data
   * @param {string} data.name - Unique identifier (optional)
   * @param {string} data.displayName - English display name (optional)
   * @param {string} data.displayNameAr - Arabic display name (optional)
   * @param {string} data.description - English description (optional)
   * @param {string} data.descriptionAr - Arabic description (optional)
   * @param {boolean} data.isActive - Active status (optional)
   * @param {boolean} data.isRequired - Required status (optional)
   * @param {number} data.sortOrder - Sort order (optional)
   * @param {string} locale - Optional locale query parameter (en/ar) - not needed if using displayNameAr/descriptionAr
   * @returns {Promise} API response
   */
  async updateCondition(id, data, locale = undefined) {
    if (!id) {
      throw new Error("Condition ID is required");
    }

    if (!data) {
      throw new Error("Condition data is required");
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

    return this.apiClient.put(`/admin/hotel-conditions/${id}`, cleanedData, config);
  }

  /**
   * Delete a hotel condition (soft delete by setting isActive to false)
   * @param {string} id - Condition ID
   * @returns {Promise} API response
   */
  async deleteCondition(id) {
    if (!id) {
      throw new Error("Condition ID is required");
    }

    return this.apiClient.delete(`/admin/hotel-conditions/${id}`);
  }
}

