/**
 * Hotels Service
 * Handles all hotel-related API calls using axios
 */
export class HotelsService {
  /**
   * Initialize with authenticated axios instance
   * @param {AxiosInstance} apiClient - Authenticated axios instance
   */
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List hotels with filters and pagination
   * @param {Object} filters - Query parameters
   * @returns {Promise} API response
   */
  async listHotels(filters = {}) {
    const {
      search,
      city,
      state,
      country,
      status,
      lat,
      lng,
      page = 1,
      pageSize = 20,
    } = filters;

    const params = {
      search,
      city,
      state,
      country,
      status,
      lat,
      lng,
      page,
      pageSize,
      include: "images", // Include images in response
    };

    // Remove undefined and empty string values
    Object.keys(params).forEach(
      (key) =>
        (params[key] === undefined || params[key] === "") && delete params[key]
    );

    return this.apiClient.get("/hotels", { params });
  }

  /**
   * Get a single hotel by ID
   * @param {string} id - Hotel ID or slug
   * @returns {Promise} API response
   */
  async getHotel(id) {
    if (!id) {
      throw new Error("Hotel ID is required");
    }

    return this.apiClient.get(`/hotels/${id}`);
  }

  /**
   * Create a new hotel
   * @param {Object} hotelData - Hotel data
   * @returns {Promise} API response
   */
  async createHotel(hotelData) {
    if (!hotelData) {
      throw new Error("Hotel data is required");
    }

    return this.apiClient.post("/hotels", hotelData);
  }

  /**
   * Update an existing hotel
   * @param {string} id - Hotel ID
   * @param {Object} hotelData - Hotel data to update
   * @returns {Promise} API response
   */
  async updateHotel(id, hotelData) {
    if (!id) {
      throw new Error("Hotel ID is required");
    }

    if (!hotelData) {
      throw new Error("Hotel data is required");
    }

    return this.apiClient.put(`/hotels/${id}`, hotelData);
  }

  /**
   * Delete a hotel
   * @param {string} id - Hotel ID to delete
   * @returns {Promise} API response
   */
  async deleteHotel(id) {
    if (!id) {
      throw new Error("Hotel ID is required");
    }

    return this.apiClient.delete(`/hotels/${id}`);
  }
}
