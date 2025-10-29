/**
 * Admin Service
 * Handles admin-specific API calls for hotel management
 */
export class AdminService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Get hotel by ID (admin view with full details)
   * @param {string} id - Hotel ID
   * @returns {Promise} API response
   */
  async getHotelById(id) {
    if (!id) {
      throw new Error("Hotel ID is required");
    }

    return this.apiClient.get(`/admin/hotels/${id}`);
  }

  /**
   * Update hotel (admin - supports partial updates)
   * @param {string} id - Hotel ID
   * @param {Object} updates - Update payload
   * @returns {Promise} API response
   */
  async updateHotel(id, updates) {
    if (!id) {
      throw new Error("Hotel ID is required");
    }

    // Remove undefined values from updates
    const cleanedUpdates = JSON.parse(JSON.stringify(updates));
    Object.keys(cleanedUpdates).forEach((key) => {
      if (
        typeof cleanedUpdates[key] === "object" &&
        cleanedUpdates[key] !== null
      ) {
        Object.keys(cleanedUpdates[key]).forEach(
          (subKey) =>
            cleanedUpdates[key][subKey] === undefined &&
            delete cleanedUpdates[key][subKey]
        );
      } else if (cleanedUpdates[key] === undefined) {
        delete cleanedUpdates[key];
      }
    });

    return this.apiClient.put(`/admin/hotels/${id}`, cleanedUpdates);
  }

  /**
   * Get platform settings
   * @returns {Promise} API response
   */
  async getPlatformSettings() {
    return this.apiClient.get("/admin/platform-settings");
  }

  /**
   * Update platform settings
   * @param {Object} data - Platform settings data
   * @returns {Promise} API response
   */
  async updatePlatformSettings(data) {
    if (!data) {
      throw new Error("Platform settings data is required");
    }

    return this.apiClient.put("/admin/platform-settings", data);
  }

  /**
   * List all hotel conditions
   * @returns {Promise} API response
   */
  async listHotelConditions() {
    return this.apiClient.get("/admin/hotel-conditions");
  }

  /**
   * Get a single hotel condition by ID
   * @param {string} id - Condition ID
   * @returns {Promise} API response
   */
  async getHotelCondition(id) {
    if (!id) {
      throw new Error("Condition ID is required");
    }

    return this.apiClient.get(`/admin/hotel-conditions/${id}`);
  }

  /**
   * Create a new hotel condition
   * @param {Object} data - Condition data
   * @returns {Promise} API response
   */
  async createHotelCondition(data) {
    if (!data) {
      throw new Error("Condition data is required");
    }

    return this.apiClient.post("/admin/hotel-conditions", data);
  }

  /**
   * Update an existing hotel condition
   * @param {string} id - Condition ID
   * @param {Object} data - Condition data
   * @returns {Promise} API response
   */
  async updateHotelCondition(id, data) {
    if (!id) {
      throw new Error("Condition ID is required");
    }

    if (!data) {
      throw new Error("Condition data is required");
    }

    return this.apiClient.put(`/admin/hotel-conditions/${id}`, data);
  }

  /**
   * Delete a hotel condition
   * @param {string} id - Condition ID
   * @returns {Promise} API response
   */
  async deleteHotelCondition(id) {
    if (!id) {
      throw new Error("Condition ID is required");
    }

    return this.apiClient.delete(`/admin/hotel-conditions/${id}`);
  }
}
