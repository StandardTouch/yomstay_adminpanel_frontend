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
   * List room types with optional filtering and pagination
   * @param {Object} params - Query parameters (page, limit, search, isActive)
   * @returns {Promise} API response
   */
  async listRoomTypes(params = {}) {
    const queryParams = { ...params };
    // Remove undefined values
    Object.keys(queryParams).forEach(
      (key) => queryParams[key] === undefined && delete queryParams[key]
    );

    return this.apiClient.get("/admin/room-types", { params: queryParams });
  }

  /**
   * Create room type
   * @param {Object} data - Room type create data
   * @returns {Promise} API response
   */
  async createRoomType(data) {
    if (!data) {
      throw new Error("Room type data is required");
    }

    // Prepare payload with required and optional fields
    const payload = {
      name: data.name,
      displayName: data.displayName,
    };

    // Optional fields
    if (data.description !== undefined)
      payload.description = data.description || null;
    if (data.icon !== undefined) payload.icon = data.icon || null;
    if (data.isActive !== undefined) payload.isActive = data.isActive;
    if (data.sortOrder !== undefined) payload.sortOrder = data.sortOrder;

    return this.apiClient.post("/admin/room-types", payload);
  }

  /**
   * Update room type
   * @param {string} id - Room type ID
   * @param {Object} data - Room type update data
   * @returns {Promise} API response
   */
  async updateRoomType(id, data) {
    if (!id) {
      throw new Error("Room type ID is required");
    }
    if (!data) {
      throw new Error("Room type data is required");
    }

    // Prepare payload - only include defined fields
    const payload = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.displayName !== undefined) payload.displayName = data.displayName;
    if (data.description !== undefined) payload.description = data.description;
    if (data.icon !== undefined) payload.icon = data.icon;
    if (data.isActive !== undefined) payload.isActive = data.isActive;
    if (data.sortOrder !== undefined) payload.sortOrder = data.sortOrder;

    return this.apiClient.put(`/admin/room-types/${id}`, payload);
  }

  /**
   * Reorder room types
   * @param {{orders: {id: string, sortOrder: number}[]}} data
   * @returns {Promise} API response
   */
  async reorderRoomTypes(data) {
    if (!data || !Array.isArray(data.orders) || data.orders.length === 0) {
      throw new Error("orders array is required");
    }
    return this.apiClient.patch("/admin/room-types/reorder", data);
  }

  /**
   * Toggle active status for a room type
   * @param {string} id
   * @param {{isActive?: boolean}} body
   * @returns {Promise} API response
   */
  async toggleRoomTypeActive(id, body = {}) {
    if (!id) {
      throw new Error("Room type ID is required");
    }
    return this.apiClient.patch(`/admin/room-types/${id}/toggle-active`, body);
  }

  /**
   * Delete room type
   * @param {string} id - Room type ID
   * @returns {Promise} API response
   */
  async deleteRoomType(id) {
    if (!id) {
      throw new Error("Room type ID is required");
    }

    return this.apiClient.delete(`/admin/room-types/${id}`);
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
